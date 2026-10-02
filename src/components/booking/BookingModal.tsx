"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BookingService } from "@/lib/booking/types";
import { addDays, belgradeDate } from "@/lib/booking/time";
import { stepsForSchedulingMode } from "@/lib/booking/flow";

type Step = number;

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

function nextDays(count = 45) {
  const start = belgradeDate();
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function formatWeekday(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { weekday: "short" })
    .format(new Date(`${date}T00:00:00`))
    .replace(".", "")
    .toUpperCase();
}

function formatMonthYear(date: string) {
  return new Intl.DateTimeFormat("sr-Latn-RS", { month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)).toUpperCase();
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [services, setServices] = useState<BookingService[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(belgradeDate());
  const [bookableDates, setBookableDates] = useState<Record<string, boolean>>({});
  const [slots, setSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ service: string; date?: string; time?: string; duration?: string; mode: "appointment" | "inquiry" } | null>(null);
  const [details, setDetails] = useState({ fullName: "", phone: "", email: "", instagram: "", note: "" });

  const selectedService = services.find((service) => service.id === serviceId);
  const isInquiry = selectedService?.schedulingMode === "inquiry";
  const activeSteps = stepsForSchedulingMode(selectedService?.schedulingMode);
  const currentStep = activeSteps[step] ?? "USLUGA";
  const days = useMemo(() => nextDays(), []);
  const groupedDays = useMemo(() => {
    return days.reduce<Array<{ month: string; dates: string[] }>>((groups, item) => {
      const month = monthKey(item);
      const current = groups.at(-1);
      if (current?.month === month) current.dates.push(item);
      else groups.push({ month, dates: [item] });
      return groups;
    }, []);
  }, [days]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__yummiLenis?.stop();
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.__yummiLenis?.start();
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
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
    if (!open || !serviceId || isInquiry) {
      return;
    }
    const task = window.setTimeout(() => {
      fetch(`/api/bookable-dates?serviceId=${encodeURIComponent(serviceId)}`)
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Datumi trenutno nisu dostupni.");
          const map = Object.fromEntries((data.dates ?? []).map((item: { date: string; available: boolean }) => [item.date, item.available]));
          setBookableDates(map);
          if (!map[date]) {
            const first = (data.dates ?? []).find((item: { date: string; available: boolean }) => item.available)?.date;
            if (first) setDate(first);
          }
        })
        .catch((err: Error) => setError(err.message));
    }, 0);
    return () => window.clearTimeout(task);
  }, [open, serviceId, date, isInquiry]);

  useEffect(() => {
    if (!open || !serviceId || !date || isInquiry) {
      return;
    }
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
  }, [open, serviceId, date, isInquiry]);

  if (!open) return null;

  const canContinue =
    (currentStep === "USLUGA" && serviceId) ||
    (currentStep === "DATUM" && date) ||
    (currentStep === "VREME" && startTime) ||
    (currentStep === "PODACI" && details.fullName.trim() && details.phone.trim());

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isInquiry ? { serviceId, ...details } : { serviceId, date, startTime, ...details }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Termin nije moguće poslati.");
        return;
      }
      setSuccess({
        service: selectedService?.name ?? "",
        date: isInquiry ? undefined : date,
        time: isInquiry ? undefined : startTime,
        duration: selectedService?.durationLabel,
        mode: isInquiry ? "inquiry" : "appointment",
      });
      setStep(activeSteps.length - 1);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Zakazivanje termina"
      className="fixed inset-0 z-[110] grid place-items-center bg-[#160f0c]/84 text-[#241916] backdrop-blur-md md:p-8"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex h-[100svh] w-full flex-col overflow-hidden bg-[#fff7ef] shadow-[0_40px_160px_rgba(0,0,0,0.45)] outline-none md:h-[min(89svh,860px)] md:w-[82vw] md:max-w-[1220px] md:rounded-[10px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#d8bd80]/35 px-5 py-4 md:px-8">
          <div className="text-[10px] font-bold tracking-[0.35em] text-[#8f6d5a]">YUUMI ART BOOKING</div>
          <button className="px-2 py-1 text-[10px] font-bold tracking-[0.28em] text-[#6f1d2a] outline-none transition hover:text-[#241916] focus-visible:ring-2 focus-visible:ring-[#6f1d2a]" onClick={onClose}>
            ZATVORI
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(250px,0.32fr)_minmax(0,0.68fr)] md:grid-rows-none">
          <aside className="shrink-0 border-b border-[#d8bd80]/25 p-5 md:border-b-0 md:border-r md:p-8 lg:p-10">
            <h2 className="max-w-full overflow-hidden font-serif text-[clamp(3.1rem,4.6vw,4.9rem)] leading-[0.88] text-[#6f1d2a]">
              ZAKAŽI
              <br />
              TERMIN
            </h2>
            <div className="mt-7 grid gap-2 md:mt-10">
              {activeSteps.map((item, index) => (
                <button
                  key={item}
                  className={`group flex items-center gap-3 py-1.5 text-left text-[11px] font-bold tracking-[0.24em] outline-none transition focus-visible:ring-2 focus-visible:ring-[#6f1d2a] ${
                    index === step ? "text-[#6f1d2a]" : "text-[#8f6d5a]/65"
                  }`}
                  disabled={index > step}
                  onClick={() => setStep(index)}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${index === step ? "bg-[#6f1d2a]" : "bg-[#d8bd80]/55"}`} />
                  <span className={`h-px w-7 ${index === step ? "bg-[#6f1d2a]" : "bg-[#d8bd80]/35"}`} />
                  <span>{String(index + 1).padStart(2, "0")} {item}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="min-h-0 min-w-0 w-full max-w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-5 [touch-action:pan-y] md:p-8 lg:p-10">
            {error ? <p className="mb-5 border border-[#6f1d2a]/20 bg-[#6f1d2a]/8 p-3 text-sm text-[#6f1d2a]">{error}</p> : null}

            {currentStep === "USLUGA" ? (
              <div className="grid min-w-0 max-w-full gap-3 2xl:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    className={`min-w-0 border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a] ${
                      serviceId === service.id ? "border-[#6f1d2a] bg-[#6f1d2a]/7" : "border-[#d8bd80]/45 hover:border-[#b88a45]/70"
                    }`}
                    onClick={() => {
                      setServiceId(service.id);
                      setStartTime("");
                      if (service.schedulingMode === "inquiry") {
                        setDate(belgradeDate());
                        setBookableDates({});
                        setSlots([]);
                      }
                      setStep(0);
                    }}
                  >
                    <span className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                      <span className="min-w-0 font-serif text-[clamp(1.65rem,2.2vw,2.35rem)] leading-none text-[#6f1d2a]">{service.name}</span>
                      {serviceId === service.id ? <span className="w-fit text-[10px] font-bold tracking-[0.22em] text-[#6f1d2a]">IZABRANO</span> : null}
                    </span>
                    <span className="mt-4 block text-sm leading-6 text-[#6b574e]">{service.description}</span>
                    <span className="mt-5 block text-[11px] font-bold tracking-[0.25em] text-[#8f6d5a]">{service.durationLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {currentStep === "DATUM" ? (
              <div className="grid min-w-0 max-w-full gap-7">
                {groupedDays.map((group) => (
                  <section className="min-w-0 max-w-full" key={group.month}>
                    <h3 className="mb-3 text-[11px] font-bold tracking-[0.26em] text-[#8f6d5a]">{formatMonthYear(`${group.month}-01`)}</h3>
                    <div className="grid min-w-0 grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7 xl:grid-cols-9">
                      {group.dates.map((item) => (
                        <button
                          key={item}
                          disabled={!bookableDates[item]}
                          className={`aspect-[1/0.92] border p-2 text-center transition disabled:cursor-not-allowed disabled:border-[#d8bd80]/20 disabled:bg-[#e8ddd1]/35 disabled:text-[#8f6d5a]/35 ${
                            date === item
                              ? "border-[#6f1d2a] bg-[#6f1d2a] text-[#fff7ef]"
                              : "border-[#d8bd80]/45 text-[#241916] hover:border-[#b88a45]"
                          }`}
                          onClick={() => setDate(item)}
                        >
                          <span className={`block text-[10px] font-bold tracking-[0.18em] ${date === item ? "text-[#f3d99b]" : "text-[#8f6d5a]"}`}>{formatWeekday(item)}</span>
                          <span className="mt-1 block font-serif text-3xl leading-none">{new Date(`${item}T00:00:00`).getDate()}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}

            {currentStep === "VREME" ? (
              <div className="min-w-0 max-w-full">
                <p className="text-[11px] font-bold tracking-[0.26em] text-[#8f6d5a]">DOSTUPNI TERMINI</p>
                <div className="mt-3 border-l border-[#d8bd80]/55 pl-4">
                  <p className="font-serif text-3xl text-[#6f1d2a]">{selectedService?.name}</p>
                  <p className="mt-1 text-sm text-[#6b574e]">{formatFullDate(date)}</p>
                </div>
                {loadingSlots ? <p className="mt-8 text-[#6b574e]">Učitavanje termina...</p> : null}
                {!loadingSlots && slots.length === 0 ? <p className="mt-8 text-[#6b574e]">Nema dostupnih termina za izabrani datum.</p> : null}
                <div className="mt-8 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`border px-4 py-3 text-sm font-bold tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f1d2a] ${
                        startTime === slot ? "border-[#6f1d2a] bg-[#6f1d2a] text-[#fff7ef]" : "border-[#d8bd80]/45 text-[#6f1d2a] hover:border-[#b88a45]"
                      }`}
                      onClick={() => setStartTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {currentStep === "PODACI" ? (
              <div className="grid min-w-0 max-w-full gap-5 md:grid-cols-2">
                {[
                  ["fullName", "Ime i prezime *"],
                  ["phone", "Telefon *"],
                  ["email", "Email"],
                  ["instagram", "Instagram"],
                ].map(([key, label]) => (
                  <label className="grid min-w-0 gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a]" key={key}>
                    {label}
                    <input
                      className="min-w-0 w-full border border-[#d8bd80]/45 bg-[#fffaf4] px-4 py-4 text-base font-normal tracking-normal text-[#241916] outline-none transition focus:border-[#6f1d2a] focus-visible:ring-2 focus-visible:ring-[#6f1d2a]"
                      value={details[key as keyof typeof details]}
                      onChange={(event) => setDetails((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </label>
                ))}
                <label className="grid min-w-0 gap-2 text-xs font-bold tracking-[0.2em] text-[#8f6d5a] md:col-span-2">
                  {isInquiry ? "Napomena / željeni period" : "Napomena"}
                  <textarea
                    className="min-h-32 min-w-0 w-full border border-[#d8bd80]/45 bg-[#fffaf4] px-4 py-4 text-base font-normal tracking-normal text-[#241916] outline-none transition focus:border-[#6f1d2a] focus-visible:ring-2 focus-visible:ring-[#6f1d2a]"
                    value={details.note}
                    onChange={(event) => setDetails((current) => ({ ...current, note: event.target.value }))}
                  />
                </label>
              </div>
            ) : null}

            {currentStep === "POTVRDA" && success ? (
              <div className="max-w-2xl">
                <h3 className="font-serif text-[clamp(3.6rem,7vw,6.2rem)] leading-[0.86] text-[#6f1d2a]">{success.mode === "inquiry" ? "UPIT JE POSLAT." : "ZAHTEV JE POSLAT."}</h3>
                <div className="mt-8 grid gap-5 border-l border-[#d8bd80]/65 pl-5 sm:grid-cols-2">
                  {(success.mode === "inquiry" ? [
                    ["USLUGA", success.service],
                    ["TRAJANJE", success.duration ?? ""],
                    ["STATUS", "Čeka odgovor"],
                  ] : [
                    ["USLUGA", success.service],
                    ["DATUM", success.date ? formatFullDate(success.date) : ""],
                    ["VREME", success.time ?? ""],
                    ["STATUS", "Čeka potvrdu"],
                  ]).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold tracking-[0.24em] text-[#8f6d5a]">{label}</p>
                      <p className="mt-1 text-lg text-[#241916]">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-[#6b574e]">
                  {success.mode === "inquiry"
                    ? details.email.trim()
                      ? "Adriana će te kontaktirati radi dogovora termina i organizacije kursa. Dobićeš email kada upit bude obrađen."
                      : "Adriana će te kontaktirati radi dogovora termina i organizacije kursa."
                    : details.email.trim()
                      ? "Dobićeš email kada termin bude potvrđen."
                      : "Adriana će potvrditi ili odbiti termin u skladu sa dostupnošću."}
                </p>
              </div>
            ) : null}
          </main>
        </div>

        {currentStep !== "POTVRDA" ? (
          <div className="flex shrink-0 justify-between border-t border-[#d8bd80]/35 bg-[#fff7ef] px-5 py-4 md:px-8">
            <button className="text-xs font-bold tracking-[0.22em] text-[#6f1d2a] outline-none disabled:text-[#8f6d5a]/35 focus-visible:ring-2 focus-visible:ring-[#6f1d2a]" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
              NAZAD
            </button>
            <button
              className="text-xs font-bold tracking-[0.22em] text-[#6f1d2a] outline-none disabled:text-[#8f6d5a]/40 focus-visible:ring-2 focus-visible:ring-[#6f1d2a]"
              disabled={!canContinue || submitting}
              onClick={() => {
                if (currentStep === "PODACI") void submit();
                else setStep((current) => Math.min(activeSteps.length - 1, current + 1));
              }}
            >
              {currentStep === "PODACI" ? (submitting ? "SLANJE..." : "POŠALJI ZAHTEV") : "DALJE"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
