"use client";

import { useEffect, useState } from "react";
import { bookingServices } from "@/lib/booking/services";
import type { AdminBookingItem, AvailabilityException, BookingRecord, BookingStatus, WeeklyAvailability } from "@/lib/booking/types";
import { addDays, belgradeDate, intervalsOverlap, timeToMinutes } from "@/lib/booking/time";

function todayIso() {
  return belgradeDate();
}

const weekdays = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
const appointmentServices = bookingServices.filter((service) => service.schedulingMode === "appointment");

type WeekInterval = { startTime: string; endTime: string };
type ScheduleDay = {
  date: string;
  weekday: number;
  weekly: WeeklyAvailability[];
  exceptions: AvailabilityException[];
  bookings: BookingRecord[];
};

function normalizeTime(time: string) {
  return time.slice(0, 5);
}

function isAppointment(item: AdminBookingItem): item is BookingRecord & { recordType: "appointment" } {
  return item.recordType !== "inquiry";
}

function formatAdminDate(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "2-digit", month: "2-digit" }).format(new Date(`${date}T00:00:00`));
}

function formatTableDate(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function currentAdminDate() {
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
}

function statusClass(status: BookingStatus) {
  if (status === "confirmed") return "border-[#1f6f3f]/25 bg-[#1f6f3f]/10 text-[#1f6f3f]";
  if (status === "pending") return "border-[#b88a45]/30 bg-[#b88a45]/15 text-[#8a5a09]";
  if (status === "rejected") return "border-[#6f1d2a]/20 bg-[#6f1d2a]/8 text-[#6f1d2a]";
  return "border-[#6b574e]/20 bg-[#6b574e]/10 text-[#6b574e]";
}

function fieldClass() {
  return "w-full border border-[#d8bd80]/45 bg-[#fffaf4] px-3 py-2.5 text-sm outline-none transition focus:border-[#6f1d2a] focus:ring-2 focus:ring-[#6f1d2a]/15";
}

function labelClass() {
  return "grid gap-1.5 text-[10px] font-bold tracking-[0.18em] text-[#8f6d5a]";
}

function intervalsAreValid(intervals: WeekInterval[]) {
  const sorted = intervals
    .filter((interval) => interval.startTime && interval.endTime)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  if (sorted.some((interval) => timeToMinutes(interval.startTime) >= timeToMinutes(interval.endTime))) return false;
  return sorted.every((interval, index) => index === 0 || !intervalsOverlap(
    { start: sorted[index - 1].startTime, end: sorted[index - 1].endTime },
    { start: interval.startTime, end: interval.endTime },
  ));
}

function dayWorkingIntervals(day: ScheduleDay) {
  if (day.exceptions.some((exception) => exception.type === "blocked_day")) return [];
  const custom = day.exceptions.filter((exception) => exception.type === "custom_availability" && exception.start_time && exception.end_time);
  if (custom.length > 0) return custom.map((item) => ({ start: normalizeTime(item.start_time as string), end: normalizeTime(item.end_time as string) }));
  return day.weekly.map((item) => ({ start: normalizeTime(item.start_time), end: normalizeTime(item.end_time) }));
}

function availableSegments(day: ScheduleDay) {
  const working = dayWorkingIntervals(day);
  const occupied = [
    ...day.bookings.map((booking) => ({ start: normalizeTime(booking.start_time), end: normalizeTime(booking.end_time) })),
    ...day.exceptions
      .filter((exception) => exception.type === "blocked_interval" && exception.start_time && exception.end_time)
      .map((exception) => ({ start: normalizeTime(exception.start_time as string), end: normalizeTime(exception.end_time as string) })),
  ].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

  return working.flatMap((work) => {
    const segments: { start: string; end: string }[] = [];
    let cursor = work.start;
    occupied.forEach((busy) => {
      if (!intervalsOverlap(work, busy)) return;
      if (timeToMinutes(cursor) < timeToMinutes(busy.start)) segments.push({ start: cursor, end: busy.start });
      if (timeToMinutes(cursor) < timeToMinutes(busy.end)) cursor = busy.end;
    });
    if (timeToMinutes(cursor) < timeToMinutes(work.end)) segments.push({ start: cursor, end: work.end });
    return segments;
  });
}

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [summaryBookings, setSummaryBookings] = useState<AdminBookingItem[]>([]);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [weekStart, setWeekStart] = useState(todayIso());
  const [busyBookingId, setBusyBookingId] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [weeklyDraft, setWeeklyDraft] = useState<Record<number, WeekInterval[]>>({});
  const [manualSlots, setManualSlots] = useState<string[]>([]);
  const [manualSlotsLoading, setManualSlotsLoading] = useState(false);
  const [manual, setManual] = useState({
    serviceId: appointmentServices[0]?.id ?? bookingServices[0].id,
    date: todayIso(),
    startTime: "10:00",
    fullName: "",
    phone: "",
    email: "",
  });
  const [block, setBlock] = useState({
    date: todayIso(),
    endDate: todayIso(),
    rangeMode: "single",
    reason: "",
  });

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Prijava nije uspela.");
      return;
    }
    setToken(data.session.access_token);
  }

  async function loadBookings() {
    if (!token) return;
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (date) params.set("date", date);
    const response = await fetch(`/api/admin/bookings?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setBookings(data.bookings ?? []);
    else setError(data.error || "Booking lista nije dostupna.");
  }

  async function loadSummaryBookings() {
    if (!token) return;
    const response = await fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setSummaryBookings(data.bookings ?? []);
    else setError(data.error || "Booking lista nije dostupna.");
  }

  async function loadAvailability() {
    if (!token) return;
    const response = await fetch("/api/admin/availability", { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) {
      const nextWeekly = data.weekly ?? [];
      setWeeklyDraft(
        Object.fromEntries(
          weekdays.map((_, weekday) => [
            weekday,
            nextWeekly
              .filter((item: WeeklyAvailability) => item.weekday === weekday && item.active)
              .map((item: WeeklyAvailability) => ({ startTime: normalizeTime(item.start_time), endTime: normalizeTime(item.end_time) })),
          ]),
        ),
      );
    }
  }

  async function loadSchedule() {
    if (!token) return;
    const response = await fetch(`/api/admin/schedule?start=${weekStart}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setScheduleDays(data.days ?? []);
    else setError(data.error || "Kalendar nije dostupan.");
  }

  useEffect(() => {
    const task = window.setTimeout(() => void loadBookings(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status, date]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadAvailability(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadSummaryBookings(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!notice) return;
    const task = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(task);
  }, [notice]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadSchedule(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, weekStart]);

  useEffect(() => {
    if (!token || !manual.serviceId || !manual.date) return;
    const controller = new AbortController();
    async function loadManualSlots() {
      setManualSlotsLoading(true);
      try {
        const response = await fetch(`/api/availability?serviceId=${encodeURIComponent(manual.serviceId)}&date=${encodeURIComponent(manual.date)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          setManualSlots([]);
          return;
        }
        const slots = Array.isArray(data.slots) ? data.slots.map((slot: string) => normalizeTime(slot)) : [];
        setManualSlots(slots);
        setManual((current) => (
          current.serviceId === manual.serviceId && current.date === manual.date && !slots.includes(current.startTime)
            ? { ...current, startTime: slots[0] ?? "" }
            : current
        ));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setManualSlots([]);
      } finally {
        if (!controller.signal.aborted) setManualSlotsLoading(false);
      }
    }
    void loadManualSlots();
    return () => controller.abort();
  }, [token, manual.serviceId, manual.date]);

  async function updateStatus(id: string, nextStatus: BookingStatus, recordType: AdminBookingItem["recordType"] = "appointment") {
    if (busyBookingId) return;
    setBusyBookingId(id);
    setError("");
    const response = await fetch(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, recordType }),
    });
    if (!response.ok) setError("Status nije promenjen.");
    else setNotice("Status termina je promenjen.");
    await loadBookings();
    await loadSummaryBookings();
    await loadSchedule();
    setBusyBookingId("");
  }

  async function createManual(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(manual),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Manual booking nije sačuvan.");
    else {
      setNotice("Termin je dodat.");
      setError("");
      setManual((current) => ({ ...current, fullName: "", phone: "", email: "" }));
    }
    await loadBookings();
    await loadSummaryBookings();
    await loadSchedule();
  }

  async function createBlock(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "blocked_day",
        date: block.date,
        endDate: block.rangeMode === "range" ? block.endDate : block.date,
        reason: block.reason,
      }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Blokada nije sačuvana.");
    else {
      setNotice("Dostupnost je sačuvana.");
      setError("");
      setBlock((current) => ({ ...current, reason: "" }));
      await loadSchedule();
    }
  }

  async function saveWeekday(weekday: number, intervals: WeekInterval[]) {
    if (!intervalsAreValid(intervals)) {
      setError("Intervali moraju imati start < end i ne smeju se preklapati.");
      return;
    }
    const response = await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ weekday, active: intervals.length > 0, intervals }),
    });
    if (!response.ok) setError("Radno vreme nije sačuvano.");
    else {
      setNotice("Radno vreme je sačuvano.");
      setError("");
    }
    await loadAvailability();
    await loadSchedule();
  }

  const today = todayIso();
  const nowInBelgrade = new Intl.DateTimeFormat("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Belgrade",
  }).format(new Date());
  const allSummaryBookings = [...scheduleDays.flatMap((day) => day.bookings.map((booking) => ({ ...booking, recordType: "appointment" as const }))), ...summaryBookings]
    .filter((booking, index, all) => booking.id ? all.findIndex((item) => item.id === booking.id) === index : true);
  const todaysBookings = allSummaryBookings.filter((booking) => booking.recordType === "appointment" && booking.booking_date === today);
  const pendingCount = allSummaryBookings.filter((booking) => booking.status === "pending").length;
  const confirmedCount = allSummaryBookings.filter((booking) => booking.status === "confirmed").length;
  const nextBooking = allSummaryBookings
    .filter((booking): booking is BookingRecord & { recordType: "appointment" } => isAppointment(booking) && (booking.status === "pending" || booking.status === "confirmed"))
    .sort((a, b) => `${a.booking_date} ${a.start_time}`.localeCompare(`${b.booking_date} ${b.start_time}`))
    .find((booking) => `${booking.booking_date} ${normalizeTime(booking.start_time)}` >= `${today} ${nowInBelgrade}`);

  if (!token) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#1b1110] p-5 text-[#fff7ef]">
        <form className="w-full max-w-md border border-[#d8bd80]/35 bg-[#fff7ef] p-8 text-[#241916] shadow-[0_30px_120px_rgba(0,0,0,0.35)]" onSubmit={login}>
          <p className="text-xs font-bold tracking-[0.35em] text-[#8f6d5a]">YUUMI ART ADMIN</p>
          <h1 className="mt-4 font-serif text-5xl text-[#6f1d2a]">Prijava</h1>
          {error ? <p className="mt-4 border border-[#6f1d2a]/20 bg-[#6f1d2a]/8 p-3 text-sm text-[#6f1d2a]">• {error}</p> : null}
          <label className="mt-8 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            EMAIL
            <input className={fieldClass()} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="mt-4 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            LOZINKA
            <input className={fieldClass()} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="mt-6 w-full bg-[#6f1d2a] px-5 py-3 text-xs font-bold tracking-[0.22em] text-white">ULOGUJ SE</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-svh overflow-x-hidden bg-[#f7efe8] p-4 text-[#241916] md:p-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8bd80]/45 pb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] text-[#8f6d5a]">YUUMI ART ADMIN</p>
            <h1 className="mt-2 font-serif text-5xl text-[#6f1d2a] md:text-6xl">Zakazivanja</h1>
          </div>
          <div className="flex items-center gap-5 text-right">
            <p className="hidden text-sm text-[#6b574e] sm:block">{currentAdminDate()}</p>
            <button className="text-xs font-bold tracking-[0.3em] text-[#6f1d2a]" onClick={() => setToken("")}>ODJAVA</button>
          </div>
        </header>

        {error ? <p className="border border-[#6f1d2a]/20 bg-[#6f1d2a]/8 p-3 text-sm text-[#6f1d2a]">• {error}</p> : null}
        {notice ? <p className="border border-[#1f6f3f]/20 bg-[#1f6f3f]/10 p-3 text-sm text-[#1f6f3f]">• {notice}</p> : null}

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["DANAS", `${todaysBookings.length} ${todaysBookings.length === 1 ? "termin" : "termina"}`],
            ["ČEKA POTVRDU", `${pendingCount} ${pendingCount === 1 ? "zahtev" : "zahteva"}`],
            ["POTVRĐENO", String(confirmedCount)],
            ["SLEDEĆI TERMIN", nextBooking ? `${normalizeTime(nextBooking.start_time)} · ${nextBooking.customer_name ?? ""}` : "Nema"],
          ].map(([label, value]) => (
            <div className="border border-[#d8bd80]/45 bg-[#fff7ef] p-4" key={label}>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">{label}</p>
              <p className="mt-2 font-serif text-2xl text-[#6f1d2a]">{value}</p>
            </div>
          ))}
        </section>

        <section className="border border-[#d8bd80]/45 bg-[#fff7ef] p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className={labelClass()}>
              STATUS
              <select className={fieldClass()} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">Svi statusi</option>
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="rejected">REJECTED</option>
                <option value="cancelled">CANCELLED</option>
              </select>
            </label>
            <label className={labelClass()}>
              DATUM
              <input className={fieldClass()} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <button className="border border-[#d8bd80]/50 px-4 py-3 text-xs font-bold tracking-[0.2em] text-[#6f1d2a]" onClick={() => { setStatus(""); setDate(""); }}>
              RESET
            </button>
          </div>
        </section>

        <section className="border border-[#d8bd80]/45 bg-[#fff7ef] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">KALENDAR</p>
              <h2 className="font-serif text-3xl text-[#6f1d2a]">Nedelja</h2>
            </div>
            <div className="flex overflow-hidden border border-[#d8bd80]/45 text-[10px] font-bold tracking-[0.18em] text-[#6f1d2a]">
              <button className="border-r border-[#d8bd80]/45 px-3 py-2" onClick={() => setWeekStart(addDays(weekStart, -7))}>PRETHODNA</button>
              <button className="border-r border-[#d8bd80]/45 bg-[#6f1d2a]/8 px-3 py-2" onClick={() => setWeekStart(todayIso())}>DANAS</button>
              <button className="px-3 py-2" onClick={() => setWeekStart(addDays(weekStart, 7))}>SLEDEĆA</button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="grid min-w-[980px] grid-cols-7 gap-2">
              {scheduleDays.map((day) => {
                const working = dayWorkingIntervals(day);
                const available = availableSegments(day);
                const blockedDay = day.exceptions.some((exception) => exception.type === "blocked_day");
                return (
                  <div className="min-h-56 border border-[#d8bd80]/35 bg-[#fffaf4] p-3" key={day.date}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.18em] text-[#8f6d5a]">{weekdays[day.weekday].toUpperCase()}</p>
                        <p className="font-serif text-2xl text-[#6f1d2a]">{formatAdminDate(day.date)}</p>
                      </div>
                      {blockedDay ? <span className="border border-[#6f1d2a]/25 bg-[#6f1d2a]/10 px-2 py-1 text-[9px] font-bold text-[#6f1d2a]">BLOCKED</span> : null}
                    </div>
                    {!blockedDay && working.length === 0 ? <p className="mt-10 text-center text-xs font-bold tracking-[0.18em] text-[#8f6d5a]/70">NEDOSTUPNO</p> : null}
                    {!blockedDay && working.map((interval) => (
                      <p className="mt-2 text-[11px] font-bold text-[#8f6d5a]" key={`${interval.start}-${interval.end}`}>{interval.start}–{interval.end}</p>
                    ))}
                    <div className="mt-3 grid gap-2">
                      {day.bookings.map((booking) => (
                        <div className={`border p-2 text-xs ${statusClass(booking.status)}`} key={booking.id}>
                          <p className="font-bold">{normalizeTime(booking.start_time)} · {booking.customer_name ?? "Klijent"}</p>
                          <p className="mt-1 text-[10px] font-bold tracking-[0.16em]">{booking.status.toUpperCase()}</p>
                        </div>
                      ))}
                      {day.exceptions.filter((exception) => exception.type === "blocked_interval").map((exception) => (
                        <div className="border border-[#6f1d2a]/25 bg-[#6f1d2a]/8 p-2 text-xs text-[#6f1d2a]" key={exception.id}>
                          <p className="font-bold">{normalizeTime(exception.start_time || "")}–{normalizeTime(exception.end_time || "")}</p>
                          <p className="mt-1 text-[10px] font-bold tracking-[0.16em]">NEDOSTUPNO</p>
                        </div>
                      ))}
                      {!blockedDay && available.slice(0, 3).map((segment) => (
                        <p className="rounded-sm bg-[#1f6f3f]/5 px-2 py-1 text-[11px] text-[#1f6f3f]/75" key={`${segment.start}-${segment.end}`}>{segment.start}–{segment.end} dostupno</p>
                      ))}
                      {!blockedDay && available.length > 3 ? <p className="px-2 text-[11px] text-[#6b574e]/70">+ još dostupnosti</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border border-[#d8bd80]/45 bg-[#fff7ef]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8bd80]/35 px-4 py-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">BOOKINGS</p>
              <h2 className="font-serif text-3xl text-[#6f1d2a]">Termini</h2>
            </div>
          </div>
          <div className="hidden grid-cols-[0.9fr_0.8fr_1.4fr_1.3fr_0.9fr_1fr] bg-[#241916] px-4 py-3 text-xs font-bold tracking-[0.16em] text-[#fff7ef] lg:grid">
              <span>TIP / DATUM</span><span>VREME</span><span>KLIJENT</span><span>USLUGA</span><span>STATUS</span><span>AKCIJE</span>
          </div>
          {bookings.length === 0 ? <p className="p-5 text-[#6b574e]">Nema termina za izabrane filtere.</p> : null}
          {bookings.map((booking: AdminBookingItem) => (
            <div className="grid gap-3 border-t border-[#d8bd80]/25 px-4 py-4 text-sm lg:grid-cols-[0.9fr_0.8fr_1.4fr_1.3fr_0.9fr_1fr] lg:items-center" key={booking.id}>
              <span>
                <small className="mb-1 block w-fit border border-[#d8bd80]/45 px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-[#8f6d5a]">{booking.recordType === "inquiry" ? "UPIT" : "TERMIN"}</small>
                {!isAppointment(booking) ? (booking.created_at ? formatTableDate(booking.created_at.slice(0, 10)) : "Upit") : formatTableDate(booking.booking_date)}
              </span>
              <span>{!isAppointment(booking) ? "Dogovor" : `${normalizeTime(booking.start_time)}–${normalizeTime(booking.end_time)}`}</span>
              <span>
                <strong className="block text-[#241916]">{booking.customer_name}</strong>
                <small className="block text-[#6b574e]">{booking.phone}</small>
                {booking.email ? <small className="block text-[#6b574e]">{booking.email}</small> : null}
              </span>
              <span>{bookingServices.find((service) => service.id === booking.service_id)?.name}</span>
              <span className={`w-fit border px-2 py-1 text-[10px] font-bold tracking-[0.16em] ${statusClass(booking.status)}`}>{booking.status.toUpperCase()}</span>
              <span className="flex flex-wrap gap-2">
                {booking.status === "pending" ? (
                  <>
                    <button
                      className="border border-[#1f6f3f]/30 px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-[#1f6f3f] disabled:cursor-wait disabled:opacity-45"
                      disabled={busyBookingId === booking.id}
                      onClick={() => booking.id && updateStatus(booking.id, "confirmed", booking.recordType)}
                    >
                      {busyBookingId === booking.id ? "..." : "POTVRDI"}
                    </button>
                    <button
                      className="border border-[#6f1d2a]/30 px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-[#6f1d2a] disabled:cursor-wait disabled:opacity-45"
                      disabled={busyBookingId === booking.id}
                      onClick={() => booking.id && updateStatus(booking.id, "rejected", booking.recordType)}
                    >
                      {busyBookingId === booking.id ? "..." : "ODBIJ"}
                    </button>
                  </>
                ) : null}
                {booking.status === "confirmed" ? (
                  <button
                    className="border border-[#6f1d2a]/30 px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-[#6f1d2a] disabled:cursor-wait disabled:opacity-45"
                    disabled={busyBookingId === booking.id}
                    onClick={() => booking.id && updateStatus(booking.id, "cancelled", booking.recordType)}
                  >
                    {busyBookingId === booking.id ? "..." : "OTKAŽI"}
                  </button>
                ) : null}
              </span>
            </div>
          ))}
        </section>

        <section className="border border-[#d8bd80]/45 bg-[#fff7ef] p-4">
          <div className="mb-3">
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">DOSTUPNOST</p>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Radno vreme</h2>
          </div>
          <div className="grid gap-2">
            {weekdays.map((label, weekday) => {
              const intervals = weeklyDraft[weekday] ?? [];
              return (
                <div className="grid gap-2 border-t border-[#d8bd80]/25 py-3 lg:grid-cols-[150px_1fr_auto_auto] lg:items-start" key={label}>
                  <p className="text-sm font-bold">{label}</p>
                  <div className="grid gap-2">
                    {intervals.length === 0 ? <p className="text-xs font-bold tracking-[0.14em] text-[#8f6d5a]/70">NEDOSTUPNO</p> : null}
                    {intervals.map((interval, index) => (
                      <div className="grid max-w-md grid-cols-[1fr_auto_1fr_auto] items-center gap-2" key={`${weekday}-${index}`}>
                        <input
                          className={fieldClass()}
                          type="time"
                          value={interval.startTime}
                          onChange={(event) => setWeeklyDraft((current) => ({
                            ...current,
                            [weekday]: current[weekday].map((item, itemIndex) => itemIndex === index ? { ...item, startTime: event.target.value } : item),
                          }))}
                        />
                        <span className="text-[#8f6d5a]">—</span>
                        <input
                          className={fieldClass()}
                          type="time"
                          value={interval.endTime}
                          onChange={(event) => setWeeklyDraft((current) => ({
                            ...current,
                            [weekday]: current[weekday].map((item, itemIndex) => itemIndex === index ? { ...item, endTime: event.target.value } : item),
                          }))}
                        />
                        <button
                          className="text-[10px] font-bold tracking-[0.14em] text-[#6f1d2a]"
                          onClick={() => setWeeklyDraft((current) => ({
                            ...current,
                            [weekday]: current[weekday].filter((_, itemIndex) => itemIndex !== index),
                          }))}
                        >
                          UKLONI
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="text-left text-[10px] font-bold tracking-[0.16em] text-[#6f1d2a]"
                    onClick={() => setWeeklyDraft((current) => ({
                      ...current,
                      [weekday]: [...(current[weekday] ?? []), { startTime: "10:00", endTime: "18:00" }],
                    }))}
                  >
                    + INTERVAL
                  </button>
                  <button className="bg-[#6f1d2a] px-4 py-2 text-[10px] font-bold tracking-[0.16em] text-white" onClick={() => void saveWeekday(weekday, intervals)}>SAČUVAJ</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <form className="border border-[#d8bd80]/45 bg-[#fff7ef] p-5" onSubmit={createManual}>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">BRZE AKCIJE</p>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Dodaj termin</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={`${labelClass()} sm:col-span-2`}>Usluga
                <select className={fieldClass()} value={manual.serviceId} onChange={(event) => setManual((current) => ({ ...current, serviceId: event.target.value }))}>
                  {appointmentServices.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
                </select>
              </label>
              <label className={labelClass()}>Datum
                <input className={fieldClass()} type="date" value={manual.date} onChange={(event) => setManual((current) => ({ ...current, date: event.target.value }))} />
              </label>
              <label className={labelClass()}>Vreme
                <select
                  className={fieldClass()}
                  value={manual.startTime}
                  onChange={(event) => setManual((current) => ({ ...current, startTime: event.target.value }))}
                  disabled={manualSlotsLoading || manualSlots.length === 0}
                >
                  {manualSlotsLoading ? <option value="">Učitavanje...</option> : null}
                  {!manualSlotsLoading && manualSlots.length === 0 ? <option value="">Nema slobodnih termina</option> : null}
                  {manualSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </label>
              <label className={labelClass()}>Ime i prezime
                <input className={fieldClass()} value={manual.fullName} onChange={(event) => setManual((current) => ({ ...current, fullName: event.target.value }))} />
              </label>
              <label className={labelClass()}>Telefon
                <input className={fieldClass()} value={manual.phone} onChange={(event) => setManual((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label className={labelClass()}>Email *
                <input className={fieldClass()} value={manual.email} onChange={(event) => setManual((current) => ({ ...current, email: event.target.value }))} />
              </label>
            </div>
            <button className="mt-4 bg-[#6f1d2a] px-5 py-3 text-xs font-bold tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-45" disabled={!manual.startTime || manualSlotsLoading}>DODAJ TERMIN</button>
          </form>

          <form className="border border-[#d8bd80]/45 bg-[#fff7ef] p-5" onSubmit={createBlock}>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#8f6d5a]">BRZE AKCIJE</p>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Blokiraj dostupnost</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={`${labelClass()} sm:col-span-2`}>Tip
                <input className={fieldClass()} value="Blokiraj ceo dan" readOnly />
              </label>
              <label className={`${labelClass()} sm:col-span-2`}>Trajanje
                <select className={fieldClass()} value={block.rangeMode} onChange={(event) => setBlock((current) => ({ ...current, rangeMode: event.target.value, endDate: event.target.value === "single" ? current.date : current.endDate }))}>
                  <option value="single">Jedan dan</option>
                  <option value="range">Interval od više dana</option>
                </select>
              </label>
              <label className={labelClass()}>Datum
                <input className={fieldClass()} type="date" value={block.date} onChange={(event) => setBlock((current) => ({ ...current, date: event.target.value, endDate: current.rangeMode === "single" ? event.target.value : current.endDate }))} />
              </label>
              {block.rangeMode === "range" ? (
                <label className={labelClass()}>Do datuma
                  <input className={fieldClass()} type="date" value={block.endDate} onChange={(event) => setBlock((current) => ({ ...current, endDate: event.target.value }))} />
                </label>
              ) : null}
              <label className={`${labelClass()} sm:col-span-2`}>Razlog
                <input className={fieldClass()} value={block.reason} onChange={(event) => setBlock((current) => ({ ...current, reason: event.target.value }))} />
              </label>
            </div>
            <button className="mt-4 bg-[#6f1d2a] px-5 py-3 text-xs font-bold tracking-[0.18em] text-white">SAČUVAJ DOSTUPNOST</button>
          </form>
        </section>
      </div>
    </main>
  );
}
