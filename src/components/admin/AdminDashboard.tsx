"use client";

import { useEffect, useState } from "react";
import { bookingServices } from "@/lib/booking/services";
import type { BookingRecord, BookingStatus, WeeklyAvailability } from "@/lib/booking/types";
import { addDays, belgradeDate } from "@/lib/booking/time";

function todayIso() {
  return belgradeDate();
}

const weekdays = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [weekly, setWeekly] = useState<WeeklyAvailability[]>([]);
  const [manual, setManual] = useState({
    serviceId: bookingServices[0].id,
    date: todayIso(),
    startTime: "10:00",
    fullName: "",
    phone: "",
  });
  const [block, setBlock] = useState({
    date: todayIso(),
    type: "blocked_interval",
    startTime: "12:00",
    endTime: "15:00",
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

  async function loadAvailability() {
    if (!token) return;
    const response = await fetch("/api/admin/availability", { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setWeekly(data.weekly ?? []);
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

  async function updateStatus(id: string, nextStatus: BookingStatus) {
    const response = await fetch(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!response.ok) setError("Status nije promenjen.");
    await loadBookings();
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
    await loadBookings();
  }

  async function createBlock(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(block),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Blokada nije sačuvana.");
    else setError("");
  }

  async function saveWeekday(weekday: number, active: boolean, intervals: { startTime: string; endTime: string }[]) {
    const response = await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ weekday, active, intervals }),
    });
    if (!response.ok) setError("Radno vreme nije sačuvano.");
    await loadAvailability();
  }

  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(date || todayIso(), index));

  if (!token) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#1b1110] p-5 text-[#fff7ef]">
        <form className="w-full max-w-md border border-[#d8bd80]/35 bg-[#fff7ef] p-8 text-[#241916]" onSubmit={login}>
          <p className="text-xs font-bold tracking-[0.35em] text-[#8f6d5a]">YUMMI ART ADMIN</p>
          <h1 className="mt-4 font-serif text-5xl text-[#6f1d2a]">Prijava</h1>
          {error ? <p className="mt-4 text-sm text-[#6f1d2a]">{error}</p> : null}
          <label className="mt-8 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            EMAIL
            <input className="border px-4 py-3" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="mt-4 grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            LOZINKA
            <input className="border px-4 py-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="mt-6 w-full bg-[#6f1d2a] px-5 py-3 font-bold text-white">ULOGUJ SE</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-[#f7efe8] p-5 text-[#241916] md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8bd80]/45 pb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] text-[#8f6d5a]">YUMMI ART ADMIN</p>
            <h1 className="mt-2 font-serif text-6xl text-[#6f1d2a]">Zakazivanja</h1>
          </div>
          <button className="text-xs font-bold tracking-[0.3em]" onClick={() => setToken("")}>ODJAVA</button>
        </header>

        {error ? <p className="mt-5 bg-[#6f1d2a]/10 p-3 text-[#6f1d2a]">{error}</p> : null}

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            STATUS
            <select className="border bg-transparent px-3 py-3" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Svi</option>
              <option value="pending">PENDING</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="rejected">REJECTED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
            DATUM
            <input className="border bg-transparent px-3 py-3" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.38fr]">
          <div className="grid gap-5">
          <div className="border border-[#d8bd80]/45 bg-[#fff7ef] p-4">
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Week view</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-7">
              {weekDates.map((item) => {
                const dayBookings = bookings.filter((booking) => booking.booking_date === item);
                return (
                  <div className="min-h-32 border border-[#d8bd80]/35 p-3" key={item}>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#8f6d5a]">{item}</p>
                    {dayBookings.length === 0 ? <p className="mt-3 text-xs text-[#6b574e]">AVAILABLE</p> : null}
                    {dayBookings.map((booking) => (
                      <p className={`mt-2 text-xs font-bold ${booking.status === "confirmed" ? "text-[#1f6f3f]" : booking.status === "pending" ? "text-[#9b6a10]" : "text-[#6b574e]"}`} key={booking.id}>
                        {booking.start_time.slice(0, 5)} {booking.status.toUpperCase()}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="overflow-hidden border border-[#d8bd80]/45 bg-[#fff7ef]">
            <div className="grid grid-cols-7 bg-[#241916] px-4 py-3 text-xs font-bold tracking-[0.18em] text-[#fff7ef]">
              <span>DATUM</span><span>VREME</span><span className="col-span-2">KLIJENT</span><span>USLUGA</span><span>STATUS</span><span>AKCIJE</span>
            </div>
            {bookings.length === 0 ? <p className="p-5 text-[#6b574e]">Nema termina za izabrane filtere.</p> : null}
            {bookings.map((booking) => (
              <div className="grid grid-cols-7 items-center gap-2 border-t border-[#d8bd80]/25 px-4 py-3 text-sm" key={booking.id}>
                <span>{booking.booking_date}</span>
                <span>{booking.start_time.slice(0, 5)}–{booking.end_time.slice(0, 5)}</span>
                <span className="col-span-2">{booking.customer_name}<br /><small>{booking.phone}</small></span>
                <span>{bookingServices.find((service) => service.id === booking.service_id)?.name}</span>
                <span className="font-bold">{booking.status.toUpperCase()}</span>
                <span className="flex flex-wrap gap-2">
                  <button onClick={() => booking.id && updateStatus(booking.id, "confirmed")}>CONFIRM</button>
                  <button onClick={() => booking.id && updateStatus(booking.id, "rejected")}>REJECT</button>
                  <button onClick={() => booking.id && updateStatus(booking.id, "cancelled")}>CANCEL</button>
                </span>
              </div>
            ))}
          </div>
          </div>

          <div className="grid gap-5">
            <div className="border border-[#d8bd80]/45 bg-[#fff7ef] p-5">
              <h2 className="font-serif text-3xl text-[#6f1d2a]">Radno vreme</h2>
              <div className="mt-4 grid gap-4">
                {weekdays.map((label, weekday) => {
                  const intervals = weekly.filter((item) => item.weekday === weekday && item.active);
                  const first = intervals[0] ?? { start_time: "10:00", end_time: "18:00" };
                  return (
                    <form
                      className="grid grid-cols-[1fr_auto] gap-2 border-t border-[#d8bd80]/25 pt-3"
                      key={label}
                      onSubmit={(event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        void saveWeekday(weekday, form.get("active") === "on", [
                          { startTime: String(form.get("startTime")), endTime: String(form.get("endTime")) },
                        ]);
                      }}
                    >
                      <label className="text-sm font-bold">
                        <input className="mr-2" name="active" type="checkbox" defaultChecked={intervals.length > 0} />
                        {label}
                      </label>
                      <button className="text-xs font-bold text-[#6f1d2a]">SAVE</button>
                      <input className="border bg-transparent p-2" name="startTime" defaultValue={String(first.start_time).slice(0, 5)} />
                      <input className="border bg-transparent p-2" name="endTime" defaultValue={String(first.end_time).slice(0, 5)} />
                    </form>
                  );
                })}
              </div>
            </div>
            <form className="border border-[#d8bd80]/45 bg-[#fff7ef] p-5" onSubmit={createManual}>
              <h2 className="font-serif text-3xl text-[#6f1d2a]">Manual booking</h2>
              <select className="mt-4 w-full border bg-transparent p-3" value={manual.serviceId} onChange={(event) => setManual((current) => ({ ...current, serviceId: event.target.value }))}>
                {bookingServices.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
              <input className="mt-3 w-full border bg-transparent p-3" type="date" value={manual.date} onChange={(event) => setManual((current) => ({ ...current, date: event.target.value }))} />
              <input className="mt-3 w-full border bg-transparent p-3" value={manual.startTime} onChange={(event) => setManual((current) => ({ ...current, startTime: event.target.value }))} />
              <input className="mt-3 w-full border bg-transparent p-3" placeholder="Ime" value={manual.fullName} onChange={(event) => setManual((current) => ({ ...current, fullName: event.target.value }))} />
              <input className="mt-3 w-full border bg-transparent p-3" placeholder="Telefon" value={manual.phone} onChange={(event) => setManual((current) => ({ ...current, phone: event.target.value }))} />
              <button className="mt-4 w-full bg-[#6f1d2a] p-3 font-bold text-white">SAČUVAJ</button>
            </form>

            <form className="border border-[#d8bd80]/45 bg-[#fff7ef] p-5" onSubmit={createBlock}>
              <h2 className="font-serif text-3xl text-[#6f1d2a]">Blokiraj termin</h2>
              <select className="mt-4 w-full border bg-transparent p-3" value={block.type} onChange={(event) => setBlock((current) => ({ ...current, type: event.target.value }))}>
                <option value="blocked_interval">Blokiraj interval</option>
                <option value="blocked_day">Blokiraj ceo dan</option>
                <option value="custom_availability">Custom dostupnost</option>
              </select>
              <input className="mt-3 w-full border bg-transparent p-3" type="date" value={block.date} onChange={(event) => setBlock((current) => ({ ...current, date: event.target.value }))} />
              {block.type !== "blocked_day" ? (
                <>
                  <input className="mt-3 w-full border bg-transparent p-3" value={block.startTime} onChange={(event) => setBlock((current) => ({ ...current, startTime: event.target.value }))} />
                  <input className="mt-3 w-full border bg-transparent p-3" value={block.endTime} onChange={(event) => setBlock((current) => ({ ...current, endTime: event.target.value }))} />
                </>
              ) : null}
              <input className="mt-3 w-full border bg-transparent p-3" placeholder="Razlog" value={block.reason} onChange={(event) => setBlock((current) => ({ ...current, reason: event.target.value }))} />
              <button className="mt-4 w-full bg-[#6f1d2a] p-3 font-bold text-white">SAČUVAJ</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
