import { NextResponse } from "next/server";
import { createBookingRequest } from "@/lib/booking/server";
import { SupabaseConfigError } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimitExceeded(key: string) {
  const now = Date.now();
  for (const [bucketKey, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
  }

  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

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
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Zahtev nije ispravan." }, { status: 400 });
    }
    if (String(body.website ?? "").trim()) {
      return NextResponse.json({ ok: true });
    }
    if (rateLimitExceeded(clientKey(request))) {
      return NextResponse.json({ error: "Previše zahteva. Pokušaj ponovo malo kasnije." }, { status: 429 });
    }
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
