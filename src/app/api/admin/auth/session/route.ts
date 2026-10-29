import { requireAdmin } from "@/app/api/admin/_auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  return Response.json({ authenticated: Boolean(admin) }, {
    status: admin ? 200 : 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}
