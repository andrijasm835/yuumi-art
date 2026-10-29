"use client";

import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { bookingServices } from "@/lib/booking/services";
import type { AdminBookingItem, AvailabilityException, BookingRecord, BookingStatus, WeeklyAvailability } from "@/lib/booking/types";
import { addDays, belgradeDate, intervalsOverlap, timeToMinutes } from "@/lib/booking/time";

function todayIso() {
  return belgradeDate();
}

const weekdays = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
const statusLabels: Record<BookingStatus, string> = { pending: "Čeka potvrdu", confirmed: "Potvrđeno", rejected: "Odbijeno", cancelled: "Otkazano" };
const pages = {
  overview: { label: "Pregled", icon: "◈", description: "Sve važno za tvoj radni dan, na jednom mestu." },
  bookings: { label: "Termini i upiti", icon: "☷", description: "Potvrdi nove zahteve i pronađi zakazivanja svojih klijenata." },
  calendar: { label: "Kalendar", icon: "▦", description: "Pogledaj zakazane termine i slobodno vreme po danima." },
  hours: { label: "Radno vreme", icon: "◷", description: "Podesi kada klijenti mogu da zakažu termin tokom nedelje." },
  timeoff: { label: "Slobodni dani", icon: "☼", description: "Zatvori zakazivanje za odmor, putovanje ili slobodan dan." },
  add: { label: "Dodaj termin", icon: "+", description: "Upiši termin dogovoren telefonom ili porukom." },
};
type AdminPage = keyof typeof pages;
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
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Belgrade" }).format(new Date());
}

function statusClass(status: BookingStatus) {
  if (status === "confirmed") return "border-[#1f6f3f]/25 bg-[#1f6f3f]/10 text-[#1f6f3f]";
  if (status === "pending") return "border-[#b88a45]/30 bg-[#b88a45]/15 text-[#8a5a09]";
  if (status === "rejected") return "border-[#6f1d2a]/20 bg-[#6f1d2a]/8 text-[#6f1d2a]";
  return "border-[#6b574e]/20 bg-[#6b574e]/10 text-[#6b574e]";
}

function fieldClass() {
  return styles.input;
}

function intervalsAreValid(intervals: WeekInterval[]) {
  const sorted = intervals
    .filter((interval) => interval.startTime && interval.endTime)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  if (sorted.length !== intervals.length) return false;
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
  const [page, setPage] = useState<AdminPage>("overview");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [period, setPeriod] = useState("upcoming");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [summaryBookings, setSummaryBookings] = useState<AdminBookingItem[]>([]);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [weekStart, setWeekStart] = useState(todayIso());
  const [busyBookingId, setBusyBookingId] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [weeklyDraft, setWeeklyDraft] = useState<Record<number, WeekInterval[]>>({});
  const [slotsVersion, setSlotsVersion] = useState(0);
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

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/auth/session", { cache: "no-store", signal: controller.signal })
      .then((response) => { if (!controller.signal.aborted) setAuthenticated(response.ok); })
      .catch(() => { if (!controller.signal.aborted) setError("Provera sesije nije uspela. Pokušajte ponovo."); })
      .finally(() => { if (!controller.signal.aborted) setCheckingSession(false); });
    return () => controller.abort();
  }, []);

  async function logout() {
    try {
        const response = await fetch("/api/admin/auth/logout", { method: "POST" });
        if (!response.ok) throw new Error("logout");
        setAuthenticated(false);
      setLoading(true);
      setAvailabilityLoaded(false);
      setExceptions([]);
      setWeeklyDraft({});
        setSummaryBookings([]);
        setScheduleDays([]);
        setError("");
        setNotice("");
    } catch {
      setError("Odjava nije uspela. Pokušajte ponovo.");
    }
  }

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
    setPassword("");
    setPage("overview");
    setAuthenticated(true);
  }

  async function loadSummaryBookings() {
    if (!authenticated) return;
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      if (response.ok) { setSummaryBookings(data.bookings ?? []); }
      else setError(data.error || "Lista termina nije dostupna.");
    } catch { setError("Podaci nisu učitani. Proverite vezu i osvežite stranicu."); }
    finally { setLoading(false); }
  }

  async function loadAvailability() {
    if (!authenticated) return;
    try {
      const response = await fetch("/api/admin/availability");
      const data = await response.json();
      if (response.ok) {
        setAvailabilityLoaded(true);
        setExceptions(data.exceptions ?? []);
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
      } else setError("Radno vreme nije dostupno. Osvežite stranicu i pokušajte ponovo.");
    } catch { setError("Podaci nisu učitani. Proverite vezu i osvežite stranicu."); }
  }

  async function loadSchedule() {
    if (!authenticated) return;
    try {
      const response = await fetch(`/api/admin/schedule?start=${weekStart}`);
      const data = await response.json();
      if (response.ok) setScheduleDays(data.days ?? []);
      else setError(data.error || "Kalendar nije dostupan.");
    } catch { setError("Podaci nisu učitani. Proverite vezu i osvežite stranicu."); }
  }

  useEffect(() => {
    const task = window.setTimeout(() => void loadAvailability(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadSummaryBookings(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    if (!notice) return;
    const task = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(task);
  }, [notice]);

  useEffect(() => {
    const task = window.setTimeout(() => void loadSchedule(), 0);
    return () => window.clearTimeout(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, weekStart]);

  useEffect(() => {
    if (!authenticated || !manual.serviceId || !manual.date) return;
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
  }, [authenticated, manual.serviceId, manual.date, slotsVersion]);

  async function updateStatus(id: string, nextStatus: BookingStatus, recordType: AdminBookingItem["recordType"] = "appointment") {
    if (busyBookingId) return;
    if (nextStatus !== "confirmed" && !window.confirm(`${nextStatus === "rejected" ? "Odbiti zahtev" : "Otkazati termin"}? Klijent će dobiti obaveštenje ako je ostavio email.`)) return;
    setBusyBookingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, recordType }),
      });
      if (!response.ok) setError("Status nije promenjen.");
      else setNotice("Status termina je promenjen.");
      await loadSummaryBookings();
      await loadSchedule();
    } catch { setError("Promena nije sačuvana. Proverite vezu i pokušajte ponovo."); }
    finally { setBusyBookingId(""); }
  }

  async function createManual(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manual),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error || "Termin nije sačuvan.");
      else {
        setNotice("Termin je dodat i potvrđen.");
        setSlotsVersion((value) => value + 1);
        setError("");
        setManual((current) => ({ ...current, fullName: "", phone: "", email: "" }));
      }
      await loadSummaryBookings();
      await loadSchedule();
    } catch { setError("Čuvanje nije uspelo. Proverite vezu i pokušajte ponovo."); }
    finally { setSaving(false); }
  }

  async function createBlock(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setNotice("Slobodni dani su sačuvani.");
        setSlotsVersion((value) => value + 1);
        setError("");
        setBlock((current) => ({ ...current, reason: "" }));
        await loadSchedule();
        await loadAvailability();
      }
    } catch { setError("Čuvanje nije uspelo. Proverite vezu i pokušajte ponovo."); }
    finally { setSaving(false); }
  }

  async function saveWeekday(weekday: number, intervals: WeekInterval[]) {
    if (!intervalsAreValid(intervals)) {
      setError("Vreme početka mora biti pre završetka. Periodi rada ne smeju da se preklapaju.");
      return;
    }
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekday, active: intervals.length > 0, intervals }),
      });
      if (!response.ok) setError("Radno vreme nije sačuvano.");
      else {
        setNotice("Radno vreme je sačuvano.");
        setSlotsVersion((value) => value + 1);
        setError("");
      }
      await loadAvailability();
      await loadSchedule();
    } catch { setError("Čuvanje nije uspelo. Proverite vezu i pokušajte ponovo."); }
    finally { setSaving(false); }
  }

  const today = todayIso();
  const nowInBelgrade = new Intl.DateTimeFormat("sr-Latn-RS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Belgrade",
  }).format(new Date());
  const allSummaryBookings = summaryBookings;
  const activeBookings = allSummaryBookings.filter((item) => item.status === "confirmed" || item.status === "pending");
  const todaysBookings = activeBookings.filter((item) => isAppointment(item) && item.booking_date === today)
    .sort((a, b) => isAppointment(a) && isAppointment(b) ? a.start_time.localeCompare(b.start_time) : 0);
  const pendingBookings = allSummaryBookings.filter((item) => item.status === "pending");
  const upcomingBookings = activeBookings.filter((item): item is BookingRecord & { recordType: "appointment" } => isAppointment(item) && `${item.booking_date} ${normalizeTime(item.start_time)}` >= `${today} ${nowInBelgrade}`)
    .sort((a, b) => `${a.booking_date} ${a.start_time}`.localeCompare(`${b.booking_date} ${b.start_time}`));
  const nextBooking = upcomingBookings[0];
  const visibleBookings = allSummaryBookings.filter((item) => {
    if (status && item.status !== status) return false;
    if (date && (!isAppointment(item) || item.booking_date !== date)) return false;
    const matchesSearch = `${item.customer_name} ${item.email ?? ""} ${item.phone ?? ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesPeriod = period === "all" || !isAppointment(item) || (period === "upcoming" ? item.booking_date >= today : item.booking_date < today);
    return matchesSearch && (date ? true : matchesPeriod);
  }).sort((a, b) => {
    if (isAppointment(a) && isAppointment(b)) return `${a.booking_date} ${a.start_time}`.localeCompare(`${b.booking_date} ${b.start_time}`);
    return Number(a.status !== "pending") - Number(b.status !== "pending");
  });

  function openBookings(nextStatus = "", nextDate = "") {
    setStatus(nextStatus); setDate(nextDate); setPeriod(nextStatus === "pending" ? "all" : "upcoming"); setSearch(""); setPage("bookings");
  }

  function bookingList(items: AdminBookingItem[], empty: string) {
    return <div className={styles.bookingList}>
      {items.length === 0 ? <div className={styles.empty}><span aria-hidden="true">✓</span><p>{loading ? "Učitavanje termina…" : empty}</p></div> : items.map((item) => <article className={styles.booking} key={item.id}>
        <div className={styles.bookingTime}>
          <strong>{isAppointment(item) ? normalizeTime(item.start_time) : "Upit"}</strong>
          <span>{isAppointment(item) ? formatTableDate(item.booking_date) : "Dogovor oko datuma"}</span>
        </div>
        <div className={styles.bookingPerson}><strong>{item.customer_name || "Klijent"}</strong><span>{bookingServices.find((service) => service.id === item.service_id)?.name}</span>
          <div className={styles.contacts}>{item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : null}{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : null}</div>
        </div>
        <span className={`${styles.badge} ${statusClass(item.status)}`}>{statusLabels[item.status]}</span>
        <div className={styles.bookingActions}>
          {item.status === "pending" ? <><button className={styles.primarySmall} disabled={Boolean(busyBookingId)} onClick={() => item.id && void updateStatus(item.id, "confirmed", item.recordType)}>{busyBookingId === item.id ? "Čuvanje…" : "Potvrdi"}</button><button className={styles.secondarySmall} disabled={Boolean(busyBookingId)} onClick={() => item.id && void updateStatus(item.id, "rejected", item.recordType)}>Odbij</button></> : null}
          {item.status === "confirmed" ? <button className={styles.secondarySmall} disabled={Boolean(busyBookingId)} onClick={() => item.id && void updateStatus(item.id, "cancelled", item.recordType)}>{busyBookingId === item.id ? "Čuvanje…" : "Otkaži"}</button> : null}
        </div>
      </article>)}
    </div>;
  }

  if (checkingSession) return <main className="grid min-h-svh place-items-center bg-[#1b1110] text-[#fff7ef]" role="status">Provera sesije...</main>;

  if (!authenticated) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#1b1110] p-5 text-[#fff7ef]">
        <form className="w-full max-w-md border border-[#d8bd80]/35 bg-[#fff7ef] p-8 text-[#241916] shadow-[0_30px_120px_rgba(0,0,0,0.35)]" onSubmit={login}>
          <p className="text-xs font-bold tracking-[0.35em] text-[#8f6d5a]">YUUMI ART ADMIN</p>
          <h1 className="mt-4 font-serif text-5xl text-[#6f1d2a]">Prijava</h1>
          {error ? <p className="mt-4 border border-[#6f1d2a]/20 bg-[#6f1d2a]/8 p-3 text-sm text-[#6f1d2a]">• {error}</p> : null}
          <label className="mt-8 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            EMAIL
            <input className={fieldClass()} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="mt-4 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            LOZINKA
            <input className={fieldClass()} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="mt-6 w-full bg-[#6f1d2a] px-5 py-3 text-xs font-bold tracking-[0.22em] text-white">ULOGUJ SE</button>
        </form>
      </main>
    );
  }

  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/admin"><span>yuumi<span className={styles.brandDot}>.</span></span><small>ART STUDIO · ADMIN</small></a>
        <p className={styles.menuCaption}>TVOJ STUDIO</p>
        <nav className={styles.nav} aria-label="Admin navigacija">{(Object.keys(pages) as AdminPage[]).map((key) => <button key={key} aria-current={page === key ? "page" : undefined} className={`${styles.navItem} ${page === key ? styles.navActive : ""}`} onClick={() => setPage(key)}><span aria-hidden="true">{pages[key].icon}</span>{pages[key].label}{key === "bookings" && pendingBookings.length > 0 ? <b>{pendingBookings.length}</b> : null}</button>)}</nav>
        <div className={styles.sidebarFooter}><p>Sve je na svom mestu.</p><span>Termini, klijenti i vreme za tebe.</span><a href="/" target="_blank" rel="noreferrer">Otvori sajt ↗</a><button onClick={() => void logout()}>Odjavi se ↗</button></div>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}><div><p className={styles.eyebrow}>YUUMI ART / {pages[page].label.toLocaleUpperCase("sr-Latn")}</p><h1>{page === "overview" ? "Tvoj studio, na dlanu." : pages[page].label}</h1><p className={styles.subtitle}>{pages[page].description}</p></div><div className={styles.headerActions}><div className={styles.account}><span>{currentAdminDate()}</span><button onClick={() => void logout()}>Odjavi se</button></div>{page !== "add" ? <button className={styles.primary} onClick={() => setPage("add")}>+ Dodaj termin</button> : null}</div></header>
        {error ? <div className={styles.error} role="alert">{error}<button aria-label="Zatvori poruku" onClick={() => setError("")}>×</button></div> : null}
        {notice ? <div className={styles.notice} role="status">✓ {notice}</div> : null}

        {page === "overview" ? <>
          <section className={styles.stats} aria-label="Pregled zakazivanja">
            <button className={styles.stat} onClick={() => openBookings("", today)}><span>TERMINI DANAS <i>◷</i></span><strong>{loading ? "—" : todaysBookings.length}</strong><small>Pogledaj današnji raspored ↗</small></button>
            <button className={`${styles.stat} ${styles.statAccent}`} onClick={() => openBookings("pending")}><span>ČEKA POTVRDU <i>◉</i></span><strong>{loading ? "—" : pendingBookings.length}</strong><small>{pendingBookings.length ? "Novi zahtevi su spremni za pregled ↗" : "Svi zahtevi su pregledani"}</small></button>
            <button className={styles.stat} onClick={() => openBookings("confirmed")}><span>PREDSTOJEĆI TERMINI <i>▦</i></span><strong>{loading ? "—" : upcomingBookings.filter((item) => item.status === "confirmed").length}</strong><small>Potvrđena zakazivanja ↗</small></button>
          </section>
          <div className={styles.overviewGrid}>
            <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>PRVO NA REDU</p><h2>Zahtevi za potvrdu</h2></div><button className={styles.textButton} onClick={() => openBookings("pending")}>Svi zahtevi →</button></div>{bookingList(pendingBookings.slice(0, 4), "Sve je rešeno. Nema zahteva koji čekaju potvrdu.")}</section>
            <section className={`${styles.panel} ${styles.nextPanel}`}><p className={styles.eyebrow}>SLEDEĆI TERMIN</p>{nextBooking ? <><p className={styles.nextTime}>{normalizeTime(nextBooking.start_time)}</p><p className={styles.nextDate}>{formatTableDate(nextBooking.booking_date)}</p><h2>{nextBooking.customer_name}</h2><p>{bookingServices.find((service) => service.id === nextBooking.service_id)?.name}</p><span className={`${styles.badge} ${statusClass(nextBooking.status)}`}>{statusLabels[nextBooking.status]}</span><button className={styles.secondary} onClick={() => openBookings("", nextBooking.booking_date)}>Pogledaj termine za taj dan →</button></> : <div className={styles.empty}><p>{loading ? "Učitavanje…" : "Trenutno nema predstojećih termina."}</p></div>}</section>
          </div>
          <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.eyebrow}>TVOJ DAN</p><h2>Današnji termini</h2></div><button className={styles.textButton} onClick={() => setPage("calendar")}>Otvori kalendar →</button></div>{bookingList(todaysBookings, "Danas nema zakazanih termina. Imaš vremena za sebe.")}</section>
          <section className={styles.quickActions}><button onClick={() => setPage("timeoff")}><span>☼</span><div><strong>Planiraš slobodan dan?</strong><p>Zatvori zakazivanje za odabrane datume.</p></div><b>→</b></button><button onClick={() => setPage("hours")}><span>◷</span><div><strong>Menjaš radno vreme?</strong><p>Podesi raspored za svaki dan u nedelji.</p></div><b>→</b></button></section>
        </> : null}

        {page === "bookings" ? <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h2>Termini i upiti</h2><p>Upiti za edukacije nemaju fiksan datum — dogovorite ga sa klijentom.</p></div><span className={styles.counter}>{visibleBookings.length} rezultata</span></div>
          <div className={styles.filters}><label className={styles.label}>Pronađi klijenta<input className={styles.input} type="search" placeholder="Ime, telefon ili email…" value={search} onChange={(e) => setSearch(e.target.value)} /></label><label className={styles.label}>Prikaži<select className={styles.input} value={period} onChange={(e) => setPeriod(e.target.value)}><option value="upcoming">Predstojeći termini</option><option value="all">Svi termini</option><option value="past">Prošli termini</option></select></label><label className={styles.label}>Status<select className={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Svi statusi</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className={styles.label}>Datum<input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><button className={styles.textButton} onClick={() => { setSearch(""); setDate(""); setStatus(""); setPeriod("all"); }}>Očisti filtere</button></div>
          {bookingList(visibleBookings, "Nema rezultata. Promeni datum ili očisti filtere.")}
        </section> : null}

        {page === "calendar" ? <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h2>{formatAdminDate(weekStart)} – {formatAdminDate(addDays(weekStart, 6))}</h2><p>Sedam dana tvog rasporeda. Izaberi dan za detalje.</p></div><div className={styles.weekControls}><button className={styles.secondarySmall} aria-label="Prethodnih sedam dana" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</button><button className={styles.secondarySmall} onClick={() => setWeekStart(todayIso())}>Danas</button><button className={styles.secondarySmall} aria-label="Sledećih sedam dana" onClick={() => setWeekStart(addDays(weekStart, 7))}>→</button></div></div>
          <div className={styles.calendar}>{scheduleDays.map((day) => {
            const blocked = day.exceptions.some((item) => item.type === "blocked_day");
            const working = dayWorkingIntervals(day);
            return <article key={day.date} className={`${styles.calendarDay} ${day.date === today ? styles.calendarToday : ""}`}><button className={styles.dayHeading} onClick={() => openBookings("", day.date)}><span>{weekdays[day.weekday]}{day.date === today ? " · danas" : ""}</span><strong>{formatAdminDate(day.date)}</strong></button>{blocked || working.length === 0 ? <span className={styles.closed}>{blocked ? "Slobodan dan" : "Neradni dan"}</span> : <p className={styles.workTime}>{working.map((item) => `${item.start}–${item.end}`).join(", ")}</p>}
              {day.bookings.map((booking) => <button key={booking.id} className={`${styles.calendarBooking} ${statusClass(booking.status)}`} onClick={() => openBookings("", day.date)}><strong>{normalizeTime(booking.start_time)}</strong><span>{booking.customer_name}</span><small>{statusLabels[booking.status]}</small></button>)}
              {day.exceptions.filter((item) => item.type === "blocked_interval").map((item) => <p className={styles.closed} key={item.id}>{normalizeTime(item.start_time || "")}–{normalizeTime(item.end_time || "")} · pauza</p>)}
              {!blocked ? availableSegments(day).map((item) => <p key={item.start} className={styles.freeTime}>{item.start}–{item.end} slobodno</p>) : null}
            </article>;
          })}</div>
        </section> : null}

        {page === "hours" && !availabilityLoaded ? <section className={styles.panel}><p className={styles.muted}>Učitavanje radnog vremena…</p></section> : null}
        {page === "hours" && availabilityLoaded ? <section className={styles.panel}><div className={styles.panelHeading}><div><h2>Tvoja radna nedelja</h2><p>Dodaj vreme rada ili ukloni sve periode za neradni dan. Sačuvaj svaki izmenjeni dan.</p></div></div><div className={styles.hoursList}>{[1, 2, 3, 4, 5, 6, 0].map((weekday) => {
          const intervals = weeklyDraft[weekday] ?? [];
          return <div className={styles.hoursDay} key={weekday}><div><strong>{weekdays[weekday]}</strong><small>{intervals.length ? "Radni dan" : "Neradni dan"}</small></div><div className={styles.intervals}>{intervals.length === 0 ? <p className={styles.muted}>Klijenti ne mogu da zakažu termin.</p> : intervals.map((interval, index) => <div className={styles.interval} key={index}><label className={styles.label}>Od<input className={styles.input} type="time" value={interval.startTime} onChange={(e) => setWeeklyDraft((current) => ({ ...current, [weekday]: current[weekday].map((item, i) => i === index ? { ...item, startTime: e.target.value } : item) }))} /></label><label className={styles.label}>Do<input className={styles.input} type="time" value={interval.endTime} onChange={(e) => setWeeklyDraft((current) => ({ ...current, [weekday]: current[weekday].map((item, i) => i === index ? { ...item, endTime: e.target.value } : item) }))} /></label><button className={styles.textButton} aria-label={`Ukloni period ${interval.startTime}–${interval.endTime} za ${weekdays[weekday]}`} onClick={() => setWeeklyDraft((current) => ({ ...current, [weekday]: current[weekday].filter((_, i) => i !== index) }))}>Ukloni</button></div>)}</div><div className={styles.hoursActions}><button className={styles.textButton} onClick={() => setWeeklyDraft((current) => ({ ...current, [weekday]: [...(current[weekday] ?? []), { startTime: "10:00", endTime: "18:00" }] }))}>+ Period rada</button><button className={styles.secondarySmall} disabled={saving} onClick={() => void saveWeekday(weekday, intervals)}>Sačuvaj dan</button></div></div>;
        })}</div></section> : null}

        {page === "add" ? <div className={styles.formLayout}><form className={styles.formPanel} onSubmit={createManual}><p className={styles.eyebrow}>NOVO ZAKAZIVANJE</p><h2>Dodaj novi termin</h2><p className={styles.muted}>Izaberi slobodno vreme i unesi podatke klijenta.</p><div className={styles.formFields}>
          <label className={`${styles.label} ${styles.fullWidth}`}>Usluga<select className={styles.input} value={manual.serviceId} onChange={(e) => setManual((current) => ({ ...current, serviceId: e.target.value, startTime: "" }))}>{appointmentServices.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
          <label className={styles.label}>Datum<input className={styles.input} type="date" min={today} required value={manual.date} onChange={(e) => setManual((current) => ({ ...current, date: e.target.value, startTime: "" }))} /></label>
          <label className={styles.label}>Slobodno vreme<select className={styles.input} required value={manual.startTime} onChange={(e) => setManual((current) => ({ ...current, startTime: e.target.value }))} disabled={manualSlotsLoading || manualSlots.length === 0}><option value="">{manualSlotsLoading ? "Učitavanje…" : manualSlots.length ? "Izaberi vreme" : "Nema slobodnih termina"}</option>{manualSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></label>
          <label className={`${styles.label} ${styles.fullWidth}`}>Ime i prezime<input className={styles.input} required autoComplete="name" value={manual.fullName} onChange={(e) => setManual((current) => ({ ...current, fullName: e.target.value }))} placeholder="Ime klijenta" /></label>
          <label className={styles.label}>Telefon <small>nije obavezno</small><input className={styles.input} type="tel" autoComplete="tel" value={manual.phone} onChange={(e) => setManual((current) => ({ ...current, phone: e.target.value }))} /></label>
          <label className={styles.label}>Email <small>nije obavezno</small><input className={styles.input} type="email" autoComplete="email" value={manual.email} onChange={(e) => setManual((current) => ({ ...current, email: e.target.value }))} /></label>
        </div><div className={styles.formFooter}><button className={styles.primary} disabled={saving || !manual.startTime || manualSlotsLoading} type="submit">{saving ? "Čuvanje…" : "Sačuvaj termin"}</button><button type="button" className={styles.textButton} onClick={() => setPage("overview")}>Nazad na pregled</button></div></form><aside className={styles.helpCard}><span>✧</span><h3>Već ste se dogovorile?</h3><p>Ovde upiši termine dogovorene telefonom, preko Instagrama ili uživo.</p><p>Termin će odmah biti potvrđen i zauzeće izabrano vreme u kalendaru.</p><p>Ako uneseš email, klijent će dobiti obaveštenje o zakazivanju.</p></aside></div> : null}

        {page === "timeoff" ? <div className={styles.formLayout}><div><form className={styles.formPanel} onSubmit={createBlock}><p className={styles.eyebrow}>VREME ZA TEBE</p><h2>Dodaj slobodne dane</h2><p className={styles.muted}>Za ove datume neće biti moguće novo zakazivanje.</p><div className={styles.formFields}><label className={`${styles.label} ${styles.fullWidth}`}>Koliko dana?<select className={styles.input} value={block.rangeMode} onChange={(e) => setBlock((current) => ({ ...current, rangeMode: e.target.value, endDate: current.date }))}><option value="single">Jedan dan</option><option value="range">Više dana</option></select></label><label className={styles.label}>{block.rangeMode === "range" ? "Od datuma" : "Datum"}<input className={styles.input} type="date" min={today} required value={block.date} onChange={(e) => setBlock((current) => ({ ...current, date: e.target.value, endDate: current.endDate < e.target.value || current.rangeMode === "single" ? e.target.value : current.endDate }))} /></label>{block.rangeMode === "range" ? <label className={styles.label}>Do datuma<input className={styles.input} type="date" min={block.date} required value={block.endDate} onChange={(e) => setBlock((current) => ({ ...current, endDate: e.target.value }))} /></label> : null}<label className={`${styles.label} ${styles.fullWidth}`}>Beleška <small>nije obavezno</small><input className={styles.input} maxLength={200} placeholder="Npr. odmor, putovanje…" value={block.reason} onChange={(e) => setBlock((current) => ({ ...current, reason: e.target.value }))} /></label></div><div className={styles.formFooter}><button className={styles.primary} disabled={saving} type="submit">{saving ? "Čuvanje…" : "Sačuvaj slobodne dane"}</button></div></form>
          <section className={styles.panel}><div className={styles.panelHeading}><h2>Planirani slobodni dani</h2></div>{exceptions.filter((item) => item.type === "blocked_day" && item.date >= today).length === 0 ? <p className={styles.muted}>Još nema dodatih slobodnih dana.</p> : <ul className={styles.timeoffList}>{exceptions.filter((item) => item.type === "blocked_day" && item.date >= today).map((item) => <li key={item.id}><strong>{formatTableDate(item.date)}</strong><span>{item.reason || "Slobodan dan"}</span></li>)}</ul>}</section>
        </div><aside className={styles.helpCard}><span>☼</span><h3>Odmor bez novih zakazivanja.</h3><p>Izaberi jedan datum ili ceo period, uključujući početni i poslednji dan.</p><p>Postojeći termini ostaju zakazani. Ako je potrebno, otkaži ih posebno u odeljku „Termini i upiti“.</p><button className={styles.textButton} onClick={() => openBookings()}>Pogledaj postojeće termine →</button></aside></div> : null}
        <footer className={styles.footer}>YUUMI ART <span>Tvoj prostor za organizovan dan.</span></footer>
      </main>
    </div>
  );
}
