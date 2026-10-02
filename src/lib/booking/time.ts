import type { TimeInterval } from "@/lib/booking/types";

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
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(`${date}T00:00:00`) < today;
}

export function weekdayForDate(date: string) {
  return new Date(`${date}T00:00:00`).getDay();
}
