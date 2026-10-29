import assert from "node:assert/strict";
import { test } from "node:test";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://auth.example.test";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-public-key";
process.env.ADMIN_EMAIL_ALLOWLIST = "admin@example.test";

const auth = import("./server");

test("expired admin sessions exchange the refresh token and validate admin access", async (t) => {
  const { refreshAdminSession, verifyAdminToken } = await auth;
  const requests: { url: string; init?: RequestInit }[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init?: RequestInit) => {
    requests.push({ url, init });
    return Response.json(url.includes("/token?")
      ? { access_token: "new-access", refresh_token: "new-refresh", expires_in: 3600 }
      : { id: "admin-id", email: "admin@example.test" });
  });
  const session = await refreshAdminSession("old-refresh");
  assert.equal(session?.refresh_token, "new-refresh");
  assert.equal(requests[0].url, "https://auth.example.test/auth/v1/token?grant_type=refresh_token");
  assert.deepEqual(JSON.parse(requests[0].init?.body as string), { refresh_token: "old-refresh" });
  assert.equal((await verifyAdminToken(session!.access_token))?.id, "admin-id");
  assert.equal((requests[1].init?.headers as Record<string, string>).Authorization, "Bearer new-access");
});

test("revoked refresh tokens and accounts without admin access are rejected", async (t) => {
  const { refreshAdminSession, verifyAdminToken } = await auth;
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: "invalid_grant" }, { status: 400 }));
  assert.equal(await refreshAdminSession("revoked"), null);
  t.mock.method(globalThis, "fetch", async () => Response.json({ id: "user-id", email: "other@example.test", user_metadata: { role: "admin" } }));
  assert.equal(await verifyAdminToken("non-admin"), null);
});
