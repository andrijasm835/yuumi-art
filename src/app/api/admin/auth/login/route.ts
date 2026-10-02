import { NextResponse } from "next/server";
import { signInWithPassword, SupabaseConfigError, verifyAdminToken } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await signInWithPassword(String(body.email ?? ""), String(body.password ?? ""));
    const admin = await verifyAdminToken(session.access_token);
    if (!admin) return NextResponse.json({ error: "Nalog nema admin pristup." }, { status: 403 });
    return NextResponse.json({ session });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: "Neuspešna prijava." }, { status: 401 });
  }
}
