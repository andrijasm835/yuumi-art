import { NextResponse } from "next/server";
import { createBookingRequest } from "@/lib/booking/server";
import { SupabaseConfigError } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 10_000) {
      return NextResponse.json({ error: "Zahtev je prevelik." }, { status: 413 });
    }
    const rawBody = await request.text();
    if (rawBody.length > 10_000) {
      return NextResponse.json({ error: "Zahtev je prevelik." }, { status: 413 });
    }
    const body = JSON.parse(rawBody);
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
    const message = error instanceof Error && error.message && !error.message.includes("Supabase request failed")
      ? error.message
      : "Termin nije moguće rezervisati.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
