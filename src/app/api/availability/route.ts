import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking/server";
import { SupabaseConfigError } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serviceId = url.searchParams.get("serviceId");
  const date = url.searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json({ error: "Nedostaje usluga ili datum." }, { status: 400 });
  }

  try {
    const slots = await getAvailability(serviceId, date);
    return NextResponse.json({ slots });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: "Dostupnost nije mogla da se učita." }, { status: 500 });
  }
}
