import { NextResponse } from "next/server";
import { signInWithPassword, SupabaseConfigError } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await signInWithPassword(String(body.email ?? ""), String(body.password ?? ""));
    return NextResponse.json({ session });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: "Neuspešna prijava." }, { status: 401 });
  }
}
