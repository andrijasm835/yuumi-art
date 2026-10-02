import { availableTimeSlots, blockingIntervals, intervalIsAvailable, workingIntervalsForDate } from "@/lib/booking/availability";
import { getBookingService } from "@/lib/booking/services";
import type { BookingInquiryRecord, BookingRecord, CustomerDetails } from "@/lib/booking/types";
import { addMinutes } from "@/lib/booking/time";
import { validateCustomerDetails, hasValidationErrors } from "@/lib/booking/validation";
import { getBookingsForDate, getBookingsForDates, getExceptionsForDate, getExceptionsForDates, getWeeklyAvailability } from "@/lib/booking/repository";
import { notifyNewBookingRequest, notifyNewInquiryRequest } from "@/lib/booking/notifications";
import { supabaseAdmin } from "@/lib/supabase/server";
import { addDays, belgradeDate } from "@/lib/booking/time";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export function validateBookingRequestShape(input: { serviceId: string; date?: string; startTime?: string }) {
  const service = getBookingService(input.serviceId);
  if (!service) return "Izabrana usluga nije dostupna.";
  if (service.schedulingMode === "appointment" && (!input.date || !input.startTime || !validDate(input.date) || !validTime(input.startTime))) {
    return "Izabrani datum ili vreme nisu ispravni.";
  }
  return "";
}

function validDate(value: string) {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validTime(value: string) {
  if (!timePattern.test(value)) return false;
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export async function getAvailability(serviceId: string, date: string) {
  const service = getBookingService(serviceId);
  if (!service || service.schedulingMode !== "appointment") return [];
  const [weeklyAvailability, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDate(date),
    getBookingsForDate(date),
  ]);

  return availableTimeSlots({ serviceId, date, weeklyAvailability, exceptions, bookings });
}

export function isDatabaseOverlapError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("no_active_booking_overlap") || message.includes("conflicting key value") || message.includes("23P01");
}

export async function getBookableDates(serviceId: string, count = 45) {
  const service = getBookingService(serviceId);
  if (!service || service.schedulingMode !== "appointment") return [];
  const start = belgradeDate();
  const dates = Array.from({ length: count }, (_, index) => addDays(start, index));
  const [weeklyAvailability, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDates(dates),
    getBookingsForDates(dates),
  ]);

  return dates.map((date) => ({
    date,
    available:
      availableTimeSlots({
        serviceId,
        date,
        weeklyAvailability,
        exceptions: exceptions.filter((exception) => exception.date === date),
        bookings: bookings.filter((booking) => booking.booking_date === date),
      }).length > 0,
  }));
}

export async function createBookingRequest(input: {
  serviceId: string;
  date?: string;
  startTime?: string;
  customer: CustomerDetails;
  status?: "pending" | "confirmed";
}) {
  const service = getBookingService(input.serviceId);
  if (!service) throw new Error("Izabrana usluga nije dostupna.");
  const shapeError = validateBookingRequestShape(input);
  if (shapeError) throw new Error(shapeError);

  const errors = validateCustomerDetails(input.customer);
  if (hasValidationErrors(errors)) {
    const error = new Error("Podaci nisu ispravni.");
    error.cause = errors;
    throw error;
  }

  if (service.schedulingMode === "inquiry") {
    const payload = {
      service_id: service.id,
      customer_name: input.customer.fullName.trim(),
      phone: input.customer.phone.trim(),
      email: input.customer.email?.trim() || null,
      instagram: input.customer.instagram?.trim() || null,
      note: input.customer.note?.trim() || null,
      status: input.status ?? "pending",
    };
    const [inquiry] = await supabaseAdmin.insert<BookingInquiryRecord>("booking_inquiries", payload);
    if (inquiry.status === "pending") {
      await notifyNewInquiryRequest(inquiry);
    }
    return { ...inquiry, recordType: "inquiry" as const };
  }

  const endTime = addMinutes(input.startTime as string, service.durationMinutes);
  const [weeklyAvailability, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDate(input.date as string),
    getBookingsForDate(input.date as string),
  ]);

  const working = workingIntervalsForDate(input.date as string, weeklyAvailability, exceptions);
  const blocked = blockingIntervals(bookings, exceptions);
  const requested = { start: input.startTime as string, end: endTime };

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
    booking_date: input.date as string,
    start_time: input.startTime as string,
    end_time: endTime,
    status: input.status ?? "pending",
  };

  let booking: BookingRecord;
  try {
    [booking] = await supabaseAdmin.insert<BookingRecord>("bookings", payload);
  } catch (error) {
    if (isDatabaseOverlapError(error)) {
      throw new Error("Izabrani termin je u međuvremenu zauzet. Izaberi drugi termin.");
    }
    throw error;
  }
  if (booking.status === "pending") {
    await notifyNewBookingRequest(booking);
  }
  return { ...booking, recordType: "appointment" as const };
}
