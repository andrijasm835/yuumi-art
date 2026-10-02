import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_auth";
import { getWeeklyAvailability } from "@/lib/booking/repository";
import { supabaseAdmin } from "@/lib/supabase/server";
import { intervalsOverlap, timeToMinutes } from "@/lib/booking/time";

const allowedExceptionTypes = new Set(["blocked_day", "blocked_interval", "custom_availability"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function intervalsAreValid(intervals: { startTime: string; endTime: string }[]) {
  const sorted = intervals
    .filter((interval) => interval.startTime && interval.endTime)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  if (sorted.length !== intervals.length) return false;
  if (sorted.some((interval) => !validTime(interval.startTime) || !validTime(interval.endTime))) return false;
  if (sorted.some((interval) => timeToMinutes(interval.startTime) >= timeToMinutes(interval.endTime))) return false;
  return sorted.every((interval, index) => index === 0 || !intervalsOverlap(
    { start: sorted[index - 1].startTime, end: sorted[index - 1].endTime },
    { start: interval.startTime, end: interval.endTime },
  ));
}

function validateExceptionInput(body: Record<string, unknown>) {
  const type = String(body.type ?? "");
  const date = String(body.date ?? "");
  const startTime = String(body.startTime ?? "");
  const endTime = String(body.endTime ?? "");
  const reason = body.reason ? String(body.reason) : "";

  if (!validDate(date)) return "Datum nije ispravan.";
  if (!allowedExceptionTypes.has(type)) return "Tip dostupnosti nije ispravan.";
  if (reason.length > 200) return "Razlog može imati najviše 200 karaktera.";
  if (type !== "blocked_day") {
    if (!validTime(startTime) || !validTime(endTime)) return "Vreme nije ispravno.";
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) return "Početak mora biti pre kraja.";
  }
  return "";
}

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
  try {
    const body = await request.json() as Record<string, unknown>;

    if (body.kind === "weekly") {
      const weekday = Number(body.weekday);
      const interval = { startTime: String(body.startTime ?? ""), endTime: String(body.endTime ?? "") };
      if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !intervalsAreValid([interval])) {
        return NextResponse.json({ error: "Interval nije ispravan." }, { status: 400 });
      }
      const result = await supabaseAdmin.insert("weekly_availability", {
        weekday,
        start_time: interval.startTime,
        end_time: interval.endTime,
        active: Boolean(body.active ?? true),
      });
      return NextResponse.json({ result }, { status: 201 });
    }

    const validationError = validateExceptionInput(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const type = String(body.type);
    const result = await supabaseAdmin.insert("availability_exceptions", {
      date: String(body.date),
      start_time: type === "blocked_day" ? null : String(body.startTime),
      end_time: type === "blocked_day" ? null : String(body.endTime),
      type,
      reason: body.reason ? String(body.reason) : null,
    });
    return NextResponse.json({ result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dostupnost nije sačuvana." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();

    const weekday = Number(body.weekday);
    const intervals = Array.isArray(body.intervals) ? body.intervals : [];
    const active = Boolean(body.active);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !intervalsAreValid(intervals)) {
      return NextResponse.json({ error: "Intervali nisu ispravni." }, { status: 400 });
    }

    const result = await supabaseAdmin.rpc("replace_weekly_availability", {
      p_weekday: weekday,
      p_intervals: active ? intervals : [],
    });
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Radno vreme nije sačuvano." }, { status: 400 });
  }
}
