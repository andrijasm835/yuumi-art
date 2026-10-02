import { verifyAdminToken } from "@/lib/supabase/server";

export function adminForbiddenResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  return verifyAdminToken(token);
}
