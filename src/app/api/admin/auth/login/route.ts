import { setAdminSession } from "@/app/api/admin/_auth";
import { NextResponse } from "next/server";
import { signInWithPassword, SupabaseConfigError, verifyAdminToken } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await signInWithPassword(String(body.email ?? ""), String(body.password ?? ""));
    const admin = await verifyAdminToken(session.access_token);
    if (!admin) return NextResponse.json({ error: "Nalog nema admin pristup." }, { status: 403 });
    await setAdminSession(session);
    return NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json({ error: "Supabase nije konfigurisan." }, { status: 503 });
    }
    return NextResponse.json({ error: "Neuspešna prijava." }, { status: 401 });
  }
}
