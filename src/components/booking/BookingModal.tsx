"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BookingService } from "@/lib/booking/types";

type Step = 0 | 1 | 2 | 3 | 4;

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = ["USLUGA", "DATUM", "VREME", "PODACI", "POTVRDA"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function nextDays(count = 45) {
  const days: string[] = [];
  const start = new Date();
  for (let i = 0; i < count; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "long" }).format(new Date(`${date}T00:00:00`));
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [services, setServices] = useState<BookingService[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ service: string; date: string; time: string } | null>(null);
  const [details, setDetails] = useState({ fullName: "", phone: "", email: "", instagram: "", note: "" });

  const selectedService = services.find((service) => service.id === serviceId);
  const days = useMemo(() => nextDays(), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data.services ?? []);
        setServiceId((current) => current || data.services?.[0]?.id || "");
      })
      .catch(() => setError("Usluge trenutno ne mogu da se učitaju."));
  }, [open]);

  useEffect(() => {
    if (!open || !serviceId || !date) return;
    const task = window.setTimeout(() => {
      setLoadingSlots(true);
      setError("");
      setStartTime("");
      fetch(`/api/availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Termini trenutno nisu dostupni.");
          setSlots(data.slots ?? []);
        })
        .catch((err: Error) => {
          setSlots([]);
          setError(err.message);
        })
        .finally(() => setLoadingSlots(false));
    }, 0);
    return () => window.clearTimeout(task);
  }, [open, serviceId, date]);

  if (!open) return null;

  const canContinue =
    (step === 0 && serviceId) ||
    (step === 1 && date) ||
    (step === 2 && startTime) ||
    (step === 3 && details.fullName.trim() && details.phone.trim());

  async function submit() {
    setError("");
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, date, startTime, ...details }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Termin nije moguće poslati.");
      return;
    }
    setSuccess({ service: selectedService?.name ?? "", date, time: startTime });
    setStep(4);
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Zakazivanje termina"
      className="fixed inset-0 z-[110] bg-[#160f0c]/82 p-3 text-[#241916] backdrop-blur-md md:p-8"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden bg-[#fff7ef] shadow-[0_40px_160px_rgba(0,0,0,0.45)] outline-none"
      >
        <div className="flex items-center justify-between border-b border-[#d8bd80]/35 px-5 py-4 md:px-8">
          <div className="text-[10px] font-bold tracking-[0.35em] text-[#8f6d5a]">YUMMI ART BOOKING</div>
          <button className="text-xs font-bold tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a]" onClick={onClose}>
            ZATVORI
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto md:grid-cols-[0.34fr_0.66fr]">
          <aside className="border-b border-[#d8bd80]/25 p-5 md:border-b-0 md:border-r md:p-8">
            <h2 className="font-serif text-[clamp(3rem,8vw,6.8rem)] leading-[0.84] text-[#6f1d2a]">
              ZAKAŽI
              <br />
              TERMIN
            </h2>
            <div className="mt-8 grid gap-3">
              {steps.map((item, index) => (
                <button
                  key={item}
                  className={`text-left text-xs font-bold tracking-[0.28em] ${index === step ? "text-[#6f1d2a]" : "text-[#8f6d5a]/60"}`}
                  disabled={index > step}
                  onClick={() => setStep(index as Step)}
                >
                  {String(index + 1).padStart(2, "0")} {item}
                </button>
              ))}
            </div>
          </aside>

          <main className="p-5 md:p-10">
            {error ? <p className="mb-5 bg-[#6f1d2a]/10 p-3 text-sm text-[#6f1d2a]">{error}</p> : null}

            {step === 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    className={`border p-5 text-left transition ${serviceId === service.id ? "border-[#6f1d2a] bg-[#6f1d2a]/8" : "border-[#d8bd80]/40"}`}
                    onClick={() => {
                      setServiceId(service.id);
                      setStartTime("");
                    }}
                  >
                    <span className="font-serif text-3xl text-[#6f1d2a]">{service.name}</span>
                    <span className="mt-2 block text-sm text-[#6b574e]">{service.description}</span>
                    <span className="mt-3 block text-xs font-bold tracking-[0.25em] text-[#8f6d5a]">{service.durationMinutes} MIN</span>
                  </button>
                ))}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {days.map((item) => (
                  <button
                    key={item}
                    className={`border p-4 text-left ${date === item ? "border-[#6f1d2a] bg-[#6f1d2a]/8" : "border-[#d8bd80]/40"}`}
                    onClick={() => setDate(item)}
                  >
                    <span className="block font-serif text-2xl">{new Date(`${item}T00:00:00`).getDate()}</span>
                    <span className="text-xs font-bold tracking-[0.22em] text-[#8f6d5a]">{formatDate(item)}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                {loadingSlots ? <p>Učitavanje termina...</p> : null}
                {!loadingSlots && slots.length === 0 ? <p>Nema dostupnih termina za izabrani datum.</p> : null}
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`border px-4 py-3 font-bold ${startTime === slot ? "border-[#6f1d2a] bg-[#6f1d2a]/8" : "border-[#d8bd80]/40"}`}
                      onClick={() => setStartTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4">
                {[
                  ["fullName", "Ime i prezime *"],
                  ["phone", "Telefon *"],
                  ["email", "Email"],
                  ["instagram", "Instagram"],
                ].map(([key, label]) => (
                  <label className="grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]" key={key}>
                    {label}
                    <input
                      className="border border-[#d8bd80]/50 bg-transparent px-4 py-3 text-base font-normal tracking-normal text-[#241916] outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a]"
                      value={details[key as keyof typeof details]}
                      onChange={(event) => setDetails((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </label>
                ))}
                <label className="grid gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]">
                  Napomena
                  <textarea
                    className="min-h-28 border border-[#d8bd80]/50 bg-transparent px-4 py-3 text-base font-normal tracking-normal text-[#241916] outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a]"
                    value={details.note}
                    onChange={(event) => setDetails((current) => ({ ...current, note: event.target.value }))}
                  />
                </label>
              </div>
            ) : null}

            {step === 4 && success ? (
              <div className="max-w-xl">
                <h3 className="font-serif text-6xl leading-[0.9] text-[#6f1d2a]">ZAHTEV JE POSLAT.</h3>
                <p className="mt-6 text-lg leading-8">Termin: {formatDate(success.date)} · {success.time}</p>
                <p className="mt-2 text-lg leading-8">Usluga: {success.service}</p>
                <p className="mt-6 text-[#6b574e]">Tvoj termin čeka potvrdu.</p>
              </div>
            ) : null}
          </main>
        </div>

        {step < 4 ? (
          <div className="flex justify-between border-t border-[#d8bd80]/35 px-5 py-4 md:px-8">
            <button disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1) as Step)}>
              NAZAD
            </button>
            <button
              className="font-bold text-[#6f1d2a] disabled:text-[#8f6d5a]/40"
              disabled={!canContinue}
              onClick={() => {
                if (step === 3) void submit();
                else setStep((current) => Math.min(4, current + 1) as Step);
              }}
            >
              {step === 3 ? "POŠALJI ZAHTEV" : "DALJE"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
