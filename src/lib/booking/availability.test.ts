import test from "node:test";
import assert from "node:assert/strict";
import { availableTimeSlots, blockingIntervals } from "@/lib/booking/availability";
import { intervalsOverlap } from "@/lib/booking/time";
import type { AvailabilityException, BookingRecord, WeeklyAvailability } from "@/lib/booking/types";

const weekly: WeeklyAvailability[] = [{ weekday: 1, start_time: "10:00", end_time: "18:00", active: true }];
const monday = "2026-10-05";

test("boundary bookings do not overlap when one ends as another begins", () => {
  assert.equal(intervalsOverlap({ start: "10:00", end: "11:30" }, { start: "11:30", end: "13:00" }), false);
});

test("pending booking blocks slot", () => {
  const bookings: BookingRecord[] = [{ service_id: "professional-makeup", booking_date: monday, start_time: "10:00", end_time: "11:30", status: "pending" }];
  const slots = availableTimeSlots({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions: [], bookings });
  assert.equal(slots.includes("10:00"), false);
  assert.equal(slots.includes("11:30"), true);
});

test("confirmed booking blocks slot", () => {
  const bookings: BookingRecord[] = [{ service_id: "professional-makeup", booking_date: monday, start_time: "12:00", end_time: "13:30", status: "confirmed" }];
  const intervals = blockingIntervals(bookings, []);
  assert.deepEqual(intervals, [{ start: "12:00", end: "13:30" }]);
});

test("rejected and cancelled bookings do not block slot", () => {
  const bookings: BookingRecord[] = [
    { service_id: "professional-makeup", booking_date: monday, start_time: "10:00", end_time: "11:30", status: "rejected" },
    { service_id: "professional-makeup", booking_date: monday, start_time: "12:00", end_time: "13:30", status: "cancelled" },
  ];
  const slots = availableTimeSlots({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions: [], bookings });
  assert.equal(slots.includes("10:00"), true);
  assert.equal(slots.includes("12:00"), true);
});

test("blocked interval removes affected times", () => {
  const exceptions: AvailabilityException[] = [{ date: monday, start_time: "12:00", end_time: "15:00", type: "blocked_interval" }];
  const slots = availableTimeSlots({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions, bookings: [] });
  assert.equal(slots.includes("12:00"), false);
  assert.equal(slots.includes("15:00"), true);
});

test("service duration is respected", () => {
  const slots = availableTimeSlots({ serviceId: "basic-course", date: monday, weeklyAvailability: weekly, exceptions: [], bookings: [] });
  assert.equal(slots.includes("15:30"), false);
  assert.equal(slots.includes("15:00"), true);
});

test("custom date availability overrides weekly schedule", () => {
  const exceptions: AvailabilityException[] = [{ date: monday, start_time: "14:00", end_time: "18:00", type: "custom_availability" }];
  const slots = availableTimeSlots({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions, bookings: [] });
  assert.equal(slots.includes("10:00"), false);
  assert.equal(slots.includes("14:00"), true);
});
