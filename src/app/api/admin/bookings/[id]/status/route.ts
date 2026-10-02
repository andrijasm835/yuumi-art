import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import type { BookingInquiryRecord, BookingRecord, BookingStatus } from "@/lib/booking/types";
import { notifyBookingStatusTransition, notifyInquiryStatusTransition } from "@/lib/booking/notifications";
import { supabaseAdmin } from "@/lib/supabase/server";

const allowed = new Set<BookingStatus>(["pending", "confirmed", "rejected", "cancelled"]);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(request: Request, context: RouteContext<"/api/admin/bookings/[id]/status">) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status) as BookingStatus;
  const recordType = body.recordType === "inquiry" ? "inquiry" : "appointment";
  if (!allowed.has(status)) return NextResponse.json({ error: "Status nije ispravan." }, { status: 400 });

  if (recordType === "inquiry") {
    const [previousInquiry] = await supabaseAdmin.select<BookingInquiryRecord>("booking_inquiries", { id: `eq.${id}`, limit: 1 });
    if (!previousInquiry) return NextResponse.json({ error: "Upit nije pronađen." }, { status: 404 });

    const [inquiry] = await supabaseAdmin.update<BookingInquiryRecord>("booking_inquiries", { status }, { id: `eq.${id}` });
    await notifyInquiryStatusTransition(previousInquiry.status, inquiry);
    return NextResponse.json({ booking: { ...inquiry, recordType: "inquiry" } });
  }

  const [previousBooking] = await supabaseAdmin.select<BookingRecord>("bookings", { id: `eq.${id}`, limit: 1 });
  if (!previousBooking) return NextResponse.json({ error: "Termin nije pronađen." }, { status: 404 });

  const [booking] = await supabaseAdmin.update<BookingRecord>("bookings", { status }, { id: `eq.${id}` });
  await notifyBookingStatusTransition(previousBooking.status, booking);

  return NextResponse.json({ booking: { ...booking, recordType: "appointment" } });
}
