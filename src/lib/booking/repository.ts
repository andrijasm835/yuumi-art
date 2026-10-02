import { bookingServices } from "@/lib/booking/services";
import type { AvailabilityException, BookingRecord, WeeklyAvailability } from "@/lib/booking/types";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getWeeklyAvailability() {
  return supabaseAdmin.select<WeeklyAvailability>("weekly_availability", { select: "*", order: "weekday.asc,start_time.asc" });
}

export async function getExceptionsForDate(date: string) {
  return supabaseAdmin.select<AvailabilityException>("availability_exceptions", { select: "*", date: `eq.${date}` });
}

export async function getBookingsForDate(date: string) {
  return supabaseAdmin.select<BookingRecord>("bookings", { select: "*", booking_date: `eq.${date}` });
}

export async function getAllBookings(query: { status?: string; serviceId?: string; date?: string } = {}) {
  return supabaseAdmin.select<BookingRecord>("bookings", {
    select: "*",
    order: "booking_date.asc,start_time.asc",
    ...(query.status ? { status: `eq.${query.status}` } : {}),
    ...(query.serviceId ? { service_id: `eq.${query.serviceId}` } : {}),
    ...(query.date ? { booking_date: `eq.${query.date}` } : {}),
  });
}

export async function syncServicesToSupabase() {
  return supabaseAdmin.insert("booking_services", bookingServices);
}
