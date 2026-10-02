import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import type { BookingRecord, BookingStatus } from "@/lib/booking/types";
import { notifyBookingStatusTransition } from "@/lib/booking/notifications";
import { supabaseAdmin } from "@/lib/supabase/server";

const allowed = new Set<BookingStatus>(["pending", "confirmed", "rejected", "cancelled"]);

export async function PATCH(request: Request, context: RouteContext<"/api/admin/bookings/[id]/status">) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status) as BookingStatus;
  if (!allowed.has(status)) return NextResponse.json({ error: "Status nije ispravan." }, { status: 400 });

  const [previousBooking] = await supabaseAdmin.select<BookingRecord>("bookings", { id: `eq.${id}`, limit: 1 });
  if (!previousBooking) return NextResponse.json({ error: "Termin nije pronađen." }, { status: 404 });

  const [booking] = await supabaseAdmin.update<BookingRecord>("bookings", { status }, { id: `eq.${id}` });
  await notifyBookingStatusTransition(previousBooking.status, booking);

  return NextResponse.json({ booking });
}
