import type { TimeInterval } from "@/lib/booking/types";

const BELGRADE_TIME_ZONE = "Europe/Belgrade";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function intervalsOverlap(a: TimeInterval, b: TimeInterval) {
  return timeToMinutes(a.start) < timeToMinutes(b.end) && timeToMinutes(b.start) < timeToMinutes(a.end);
}

export function containsInterval(container: TimeInterval, child: TimeInterval) {
  return timeToMinutes(container.start) <= timeToMinutes(child.start) && timeToMinutes(child.end) <= timeToMinutes(container.end);
}

export function isPastDate(date: string, now = new Date()) {
  return date < belgradeDate(now);
}

export function weekdayForDate(date: string) {
  return new Date(`${date}T12:00:00+01:00`).getDay();
}

export function belgradeDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BELGRADE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00+01:00`);
  value.setDate(value.getDate() + days);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}
