import { bookingServices } from "@/lib/booking/services";
import type { AdminBookingItem, AvailabilityException, BookingInquiryRecord, BookingRecord, WeeklyAvailability } from "@/lib/booking/types";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getWeeklyAvailability() {
  return supabaseAdmin.select<WeeklyAvailability>("weekly_availability", { select: "*", order: "weekday.asc,start_time.asc" });
}

export async function getExceptionsForDate(date: string) {
  return supabaseAdmin.select<AvailabilityException>("availability_exceptions", { select: "*", date: `eq.${date}` });
}

export async function getExceptionsForDates(dates: string[]) {
  if (dates.length === 0) return [];
  return supabaseAdmin.select<AvailabilityException>("availability_exceptions", { select: "*", date: `in.(${dates.join(",")})` });
}

export async function getBookingsForDate(date: string) {
  const bookings = await supabaseAdmin.select<BookingRecord>("bookings", { select: "*", booking_date: `eq.${date}` });
  return bookings.map((booking) => ({ ...booking, recordType: "appointment" as const }));
}

export async function getBookingsForDates(dates: string[]) {
  if (dates.length === 0) return [];
  const bookings = await supabaseAdmin.select<BookingRecord>("bookings", { select: "*", booking_date: `in.(${dates.join(",")})` });
  return bookings.map((booking) => ({ ...booking, recordType: "appointment" as const }));
}

export async function getAllBookings(query: { status?: string; serviceId?: string; date?: string } = {}) {
  const bookings = await supabaseAdmin.select<BookingRecord>("bookings", {
    select: "*",
    order: "booking_date.asc,start_time.asc",
    ...(query.status ? { status: `eq.${query.status}` } : {}),
    ...(query.serviceId ? { service_id: `eq.${query.serviceId}` } : {}),
    ...(query.date ? { booking_date: `eq.${query.date}` } : {}),
  });
  return bookings.map((booking) => ({ ...booking, recordType: "appointment" as const }));
}

export async function getAllInquiries(query: { status?: string; serviceId?: string } = {}) {
  const inquiries = await supabaseAdmin.select<BookingInquiryRecord>("booking_inquiries", {
    select: "*",
    order: "created_at.desc",
    ...(query.status ? { status: `eq.${query.status}` } : {}),
    ...(query.serviceId ? { service_id: `eq.${query.serviceId}` } : {}),
  });
  return inquiries.map((inquiry) => ({ ...inquiry, recordType: "inquiry" as const }));
}

export async function getAdminBookingItems(query: { status?: string; serviceId?: string; date?: string } = {}) {
  const [bookings, inquiries] = await Promise.all([
    getAllBookings(query),
    query.date ? Promise.resolve([]) : getAllInquiries(query),
  ]);
  return [...bookings, ...inquiries].sort((a: AdminBookingItem, b: AdminBookingItem) => {
    const first = a.recordType === "appointment" ? `${a.booking_date} ${a.start_time}` : a.created_at ?? "";
    const second = b.recordType === "appointment" ? `${b.booking_date} ${b.start_time}` : b.created_at ?? "";
    return first.localeCompare(second);
  });
}

export async function syncServicesToSupabase() {
  return supabaseAdmin.insert("booking_services", bookingServices.map((service) => ({
    id: service.id,
    name: service.name,
    duration_minutes: service.durationMinutes,
    active: service.active,
    description: service.description,
  })));
}
