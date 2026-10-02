import { availableTimeSlots, blockingIntervals, intervalIsAvailable, workingIntervalsForDate } from "@/lib/booking/availability";
import { getBookingService } from "@/lib/booking/services";
import type { BookingRecord, CustomerDetails } from "@/lib/booking/types";
import { addMinutes } from "@/lib/booking/time";
import { validateCustomerDetails, hasValidationErrors } from "@/lib/booking/validation";
import { getBookingsForDate, getExceptionsForDate, getWeeklyAvailability } from "@/lib/booking/repository";
import { notifyNewBookingRequest } from "@/lib/booking/notifications";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getAvailability(serviceId: string, date: string) {
  const [weeklyAvailability, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDate(date),
    getBookingsForDate(date),
  ]);

  return availableTimeSlots({ serviceId, date, weeklyAvailability, exceptions, bookings });
}

export async function createBookingRequest(input: {
  serviceId: string;
  date: string;
  startTime: string;
  customer: CustomerDetails;
  status?: "pending" | "confirmed";
}) {
  const service = getBookingService(input.serviceId);
  if (!service) throw new Error("Izabrana usluga nije dostupna.");

  const errors = validateCustomerDetails(input.customer);
  if (hasValidationErrors(errors)) {
    const error = new Error("Podaci nisu ispravni.");
    error.cause = errors;
    throw error;
  }

  const endTime = addMinutes(input.startTime, service.durationMinutes);
  const [weeklyAvailability, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDate(input.date),
    getBookingsForDate(input.date),
  ]);

  const working = workingIntervalsForDate(input.date, weeklyAvailability, exceptions);
  const blocked = blockingIntervals(bookings, exceptions);
  const requested = { start: input.startTime, end: endTime };

  if (!intervalIsAvailable(requested, working, blocked)) {
    throw new Error("Izabrani termin je u međuvremenu zauzet. Izaberi drugi termin.");
  }

  const payload = {
    service_id: service.id,
    customer_name: input.customer.fullName.trim(),
    phone: input.customer.phone.trim(),
    email: input.customer.email?.trim() || null,
    instagram: input.customer.instagram?.trim() || null,
    note: input.customer.note?.trim() || null,
    booking_date: input.date,
    start_time: input.startTime,
    end_time: endTime,
    status: input.status ?? "pending",
  };

  const [booking] = await supabaseAdmin.insert<BookingRecord>("bookings", payload);
  await notifyNewBookingRequest(booking);
  return booking;
}
