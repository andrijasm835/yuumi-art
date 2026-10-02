import { bookingServices } from "@/lib/booking/services";
import type { AvailabilityException, BookingRecord, TimeInterval, WeeklyAvailability } from "@/lib/booking/types";
import { addMinutes, containsInterval, intervalsOverlap, isPastDate, timeToMinutes, weekdayForDate } from "@/lib/booking/time";

const SLOT_STEP_MINUTES = 30;

export function blockingIntervals(bookings: BookingRecord[], exceptions: AvailabilityException[]) {
  const occupied = bookings
    .filter((booking) => booking.status === "pending" || booking.status === "confirmed")
    .map((booking) => ({ start: booking.start_time, end: booking.end_time }));

  const blocked = exceptions
    .filter((exception) => exception.type === "blocked_interval" && exception.start_time && exception.end_time)
    .map((exception) => ({ start: exception.start_time as string, end: exception.end_time as string }));

  return [...occupied, ...blocked];
}

export function workingIntervalsForDate(
  date: string,
  weeklyAvailability: WeeklyAvailability[],
  exceptions: AvailabilityException[],
) {
  if (isPastDate(date)) return [];
  if (exceptions.some((exception) => exception.type === "blocked_day")) return [];

  const custom = exceptions
    .filter((exception) => exception.type === "custom_availability" && exception.start_time && exception.end_time)
    .map((exception) => ({ start: exception.start_time as string, end: exception.end_time as string }));

  if (custom.length > 0) return custom;

  return weeklyAvailability
    .filter((item) => item.active && item.weekday === weekdayForDate(date))
    .map((item) => ({ start: item.start_time, end: item.end_time }));
}

export function intervalIsAvailable(interval: TimeInterval, workingIntervals: TimeInterval[], blockedIntervals: TimeInterval[]) {
  return (
    workingIntervals.some((working) => containsInterval(working, interval)) &&
    !blockedIntervals.some((blocked) => intervalsOverlap(blocked, interval))
  );
}

export function availableTimeSlots(input: {
  serviceId: string;
  date: string;
  weeklyAvailability: WeeklyAvailability[];
  exceptions: AvailabilityException[];
  bookings: BookingRecord[];
}) {
  const service = bookingServices.find((item) => item.id === input.serviceId && item.active);
  if (!service) return [];

  const working = workingIntervalsForDate(input.date, input.weeklyAvailability, input.exceptions);
  const blocked = blockingIntervals(input.bookings, input.exceptions);
  const slots: string[] = [];

  for (const interval of working) {
    for (
      let cursor = timeToMinutes(interval.start);
      cursor + service.durationMinutes <= timeToMinutes(interval.end);
      cursor += SLOT_STEP_MINUTES
    ) {
      const start = addMinutes("00:00", cursor);
      const candidate = { start, end: addMinutes(start, service.durationMinutes) };
      if (intervalIsAvailable(candidate, working, blocked)) slots.push(start);
    }
  }

  return slots;
}

export function dateHasAvailableSlot(input: {
  serviceId: string;
  date: string;
  weeklyAvailability: WeeklyAvailability[];
  exceptions: AvailabilityException[];
  bookings: BookingRecord[];
}) {
  return availableTimeSlots(input).length > 0;
}
