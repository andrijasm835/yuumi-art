import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import type { BookingStatus } from "@/lib/booking/types";
import { supabaseAdmin } from "@/lib/supabase/server";

const allowed = new Set<BookingStatus>(["pending", "confirmed", "rejected", "cancelled"]);

export async function PATCH(request: Request, context: RouteContext<"/api/admin/bookings/[id]/status">) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status) as BookingStatus;
  if (!allowed.has(status)) return NextResponse.json({ error: "Status nije ispravan." }, { status: 400 });

  const [booking] = await supabaseAdmin.update("bookings", { status }, { id: `eq.${id}` });
  return NextResponse.json({ booking });
}
