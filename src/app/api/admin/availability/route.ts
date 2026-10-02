import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import { getWeeklyAvailability } from "@/lib/booking/repository";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const weekly = await getWeeklyAvailability();
  const exceptions = await supabaseAdmin.select("availability_exceptions", { select: "*", order: "date.asc,start_time.asc" });
  return NextResponse.json({ weekly, exceptions });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  if (body.kind === "weekly") {
    const result = await supabaseAdmin.insert("weekly_availability", {
      weekday: Number(body.weekday),
      start_time: String(body.startTime),
      end_time: String(body.endTime),
      active: Boolean(body.active ?? true),
    });
    return NextResponse.json({ result }, { status: 201 });
  }

  const result = await supabaseAdmin.insert("availability_exceptions", {
    date: String(body.date),
    start_time: body.type === "blocked_day" ? null : String(body.startTime),
    end_time: body.type === "blocked_day" ? null : String(body.endTime),
    type: String(body.type),
    reason: body.reason ? String(body.reason) : null,
  });
  return NextResponse.json({ result }, { status: 201 });
}
