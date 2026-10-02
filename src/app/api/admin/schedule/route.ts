import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import { addDays, belgradeDate } from "@/lib/booking/time";
import { getBookingsForDates, getExceptionsForDates, getWeeklyAvailability } from "@/lib/booking/repository";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const start = url.searchParams.get("start") || belgradeDate();
  const dates = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const [weekly, exceptions, bookings] = await Promise.all([
    getWeeklyAvailability(),
    getExceptionsForDates(dates),
    getBookingsForDates(dates),
  ]);

  return NextResponse.json({
    start,
    days: dates.map((date) => ({
      date,
      weekday: new Date(`${date}T12:00:00+01:00`).getDay(),
      weekly: weekly.filter((item) => item.weekday === new Date(`${date}T12:00:00+01:00`).getDay() && item.active),
      exceptions: exceptions.filter((item) => item.date === date),
      bookings: bookings.filter((item) => item.booking_date === date && (item.status === "pending" || item.status === "confirmed")),
    })),
  });
}
