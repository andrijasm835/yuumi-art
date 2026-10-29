import { clearAdminSession } from "@/app/api/admin/_auth";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  await clearAdminSession();
  return Response.json({ authenticated: false });
}
