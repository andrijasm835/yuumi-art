import { NextResponse } from "next/server";
import { createBookingRequest } from "@/lib/booking/server";
import { SupabaseConfigError } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = await createBookingRequest({
      serviceId: String(body.serviceId ?? ""),
      date: String(body.date ?? ""),
      startTime: String(body.startTime ?? ""),
      customer: {
        fullName: String(body.fullName ?? ""),
        phone: String(body.phone ?? ""),
        email: body.email ? String(body.email) : "",
        instagram: body.instagram ? String(body.instagram) : "",
        note: body.note ? String(body.note) : "",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Termin nije moguće rezervisati." }, { status: 409 });
  }
}
