import test from "node:test";
import assert from "node:assert/strict";
import { availableTimeSlots, blockingIntervals, dateHasAvailableSlot } from "@/lib/booking/availability";
import { belgradeDate, intervalsOverlap } from "@/lib/booking/time";
import { isDatabaseOverlapError, validateBookingRequestShape } from "@/lib/booking/server";
import { validateCustomerDetails } from "@/lib/booking/validation";
import { isAuthorizedAdmin } from "@/lib/supabase/server";
import { bookingServices, getBookingService } from "@/lib/booking/services";
import { nextSelectionState, stepsForSchedulingMode } from "@/lib/booking/flow";
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
  const slots = availableTimeSlots({ serviceId: "professional-makeup", date: monday, weeklyAvailability: weekly, exceptions: [], bookings: [] });
  assert.equal(slots.includes("17:00"), true);
  assert.equal(slots.includes("17:30"), false);
});

test("professional makeup duration is 60 minutes and uses appointment scheduling", () => {
  const service = getBookingService("professional-makeup");
  assert.equal(service?.durationMinutes, 60);
  assert.equal(service?.durationLabel, "60 MIN");
  assert.equal(service?.schedulingMode, "appointment");
});

test("education services use inquiry scheduling and natural duration labels", () => {
  assert.deepEqual(
    bookingServices.filter((service) => service.schedulingMode === "inquiry").map((service) => [service.id, service.durationMinutes, service.durationLabel]),
    [
      ["self-makeup-course", 180, "3 ČASA"],
      ["basic-course", 420, "7 ČASOVA"],
      ["advanced-training", 180, "3 ČASA"],
    ],
  );
});

test("booking modal flow adapts to service scheduling mode", () => {
  assert.deepEqual([...stepsForSchedulingMode("appointment")], ["USLUGA", "DATUM", "VREME", "PODACI", "POTVRDA"]);
  assert.deepEqual([...stepsForSchedulingMode("inquiry")], ["USLUGA", "PODACI", "POTVRDA"]);
});

test("switching appointment to inquiry resets irrelevant step state", () => {
  assert.deepEqual(nextSelectionState("appointment", "inquiry"), { shouldClearAppointmentFields: true, step: 0 });
  assert.deepEqual(nextSelectionState("inquiry", "appointment"), { shouldClearAppointmentFields: false, step: 0 });
});

test("professional makeup requires date and time", () => {
  assert.equal(validateBookingRequestShape({ serviceId: "professional-makeup" }), "Izabrani datum ili vreme nisu ispravni.");
  assert.equal(validateBookingRequestShape({ serviceId: "professional-makeup", date: monday, startTime: "10:00" }), "");
});

test("education inquiry does not require date or time", () => {
  assert.equal(validateBookingRequestShape({ serviceId: "basic-course" }), "");
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

test("customer validation rejects oversized optional fields", () => {
  const errors = validateCustomerDetails({
    fullName: "Ana Markovic",
    phone: "+38160111222",
    email: `${"a".repeat(170)}@example.com`,
    instagram: "a".repeat(81),
    note: "x".repeat(801),
  });
  assert.equal(Boolean(errors.email), true);
  assert.equal(Boolean(errors.instagram), true);
  assert.equal(Boolean(errors.note), true);
});

test("customer validation requires email and keeps phone optional", () => {
  const missingEmailErrors = validateCustomerDetails({
    fullName: "Ana Markovic",
    phone: "",
    email: "",
  });
  assert.equal(Boolean(missingEmailErrors.email), true);

  const errors = validateCustomerDetails({
    fullName: "Ana Markovic",
    phone: "",
    email: "ana@example.com",
  });
  assert.equal(Object.values(errors).some(Boolean), false);
});
