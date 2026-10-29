import { cookies } from "next/headers";
import { refreshAdminSession, verifyAdminToken, type AuthSession } from "@/lib/supabase/server";

const ACCESS_COOKIE = "yuumi-admin-access";
const REFRESH_COOKIE = "yuumi-admin-refresh";
const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/api/admin" };

export function adminForbiddenResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export async function setAdminSession(session: AuthSession) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, session.access_token, { ...options, maxAge: session.expires_in || 3600 });
  store.set(REFRESH_COOKIE, session.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearAdminSession() {
  const store = await cookies();
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) store.set(name, "", { ...options, maxAge: 0 });
}

export async function requireAdmin(request: Request) {
  // Cookie authentication must not permit cross-origin mutations.
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && request.method !== "HEAD" && origin && origin !== new URL(request.url).origin) return null;
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return verifyAdminToken(header.slice(7));
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (token) {
    const admin = await verifyAdminToken(token);
    if (admin) return admin;
  }
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  const session = await refreshAdminSession(refreshToken);
  const admin = session ? await verifyAdminToken(session.access_token) : null;
  if (!session || !admin) {
    await clearAdminSession();
    return null;
  }
  await setAdminSession(session);
  return admin;
}
