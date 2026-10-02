import test from "node:test";
import assert from "node:assert/strict";
import { availableTimeSlots, blockingIntervals, dateHasAvailableSlot } from "@/lib/booking/availability";
import { belgradeDate, intervalsOverlap } from "@/lib/booking/time";
import { isDatabaseOverlapError } from "@/lib/booking/server";
import { isAuthorizedAdmin } from "@/lib/supabase/server";
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

test("non-admin authenticated user is not authorized", () => {
  assert.equal(isAuthorizedAdmin({ email: "user@example.com", app_metadata: { role: "user" } }), false);
  assert.equal(isAuthorizedAdmin({ email: "adriana@example.com", app_metadata: { role: "admin" } }), true);
});

test("Europe/Belgrade date boundary uses local calendar date", () => {
  assert.equal(belgradeDate(new Date("2026-03-28T23:30:00.000Z")), "2026-03-29");
  assert.equal(belgradeDate(new Date("2026-10-24T22:30:00.000Z")), "2026-10-25");
});

test("weekly unavailable day is disabled", () => {
  assert.equal(dateHasAvailableSlot({ serviceId: "professional-makeup", date: "2026-10-07", weeklyAvailability: weekly, exceptions: [], bookings: [] }), false);
});

test("blocked day is disabled", () => {
  assert.equal(dateHasAvailableSlot({
    serviceId: "professional-makeup",
    date: monday,
    weeklyAvailability: weekly,
    exceptions: [{ date: monday, start_time: null, end_time: null, type: "blocked_day" }],
    bookings: [],
  }), false);
});

test("fully booked day is disabled", () => {
  const bookings: BookingRecord[] = [{ service_id: "professional-makeup", booking_date: monday, start_time: "10:00", end_time: "18:00", status: "confirmed" }];
  assert.equal(dateHasAvailableSlot({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions: [], bookings }), false);
});

test("database overlap conflict is normalized", () => {
  assert.equal(isDatabaseOverlapError(new Error("violates exclusion constraint no_active_booking_overlap")), true);
});
