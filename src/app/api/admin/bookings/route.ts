import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import { createBookingRequest } from "@/lib/booking/server";
import { getAllBookings } from "@/lib/booking/repository";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const bookings = await getAllBookings({
    status: url.searchParams.get("status") || undefined,
    serviceId: url.searchParams.get("serviceId") || undefined,
    date: url.searchParams.get("date") || undefined,
  });
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const booking = await createBookingRequest({
      serviceId: String(body.serviceId ?? ""),
      date: String(body.date ?? ""),
      startTime: String(body.startTime ?? ""),
      status: "confirmed",
      customer: {
        fullName: String(body.fullName ?? "Manual booking"),
        phone: String(body.phone ?? "-"),
        email: body.email ? String(body.email) : "",
        instagram: body.instagram ? String(body.instagram) : "",
        note: body.note ? String(body.note) : "",
      },
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Manual booking nije sačuvan." }, { status: 409 });
  }
}
