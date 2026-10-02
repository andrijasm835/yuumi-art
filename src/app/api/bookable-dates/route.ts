import { NextResponse } from "next/server";
import { getBookableDates } from "@/lib/booking/server";
import { SupabaseConfigError } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serviceId = url.searchParams.get("serviceId");
  if (!serviceId) return NextResponse.json({ error: "Nedostaje usluga." }, { status: 400 });

  try {
    const dates = await getBookableDates(serviceId);
    return NextResponse.json({ dates });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: "Datumi nisu dostupni." }, { status: 500 });
  }
}
