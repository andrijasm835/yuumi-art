type QueryValue = string | number | boolean | null | undefined;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY);
}

export class SupabaseConfigError extends Error {
  constructor() {
    super("Supabase environment variables are not configured.");
  }
}

function assertConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new SupabaseConfigError();
  }
}

function queryString(query?: Record<string, QueryValue>) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });
  const value = params.toString();
  return value ? `?${value}` : "";
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}, query?: Record<string, QueryValue>) {
  assertConfig();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}${queryString(query)}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY as string,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return (await response.json()) as T;
}

export const supabaseAdmin = {
  select<T>(table: string, query?: Record<string, QueryValue>) {
    return supabaseFetch<T[]>(table, { method: "GET" }, query);
  },
  insert<T>(table: string, payload: unknown) {
    return supabaseFetch<T[]>(table, { method: "POST", body: JSON.stringify(payload) });
  },
  update<T>(table: string, payload: unknown, query: Record<string, QueryValue>) {
    return supabaseFetch<T[]>(table, { method: "PATCH", body: JSON.stringify(payload) }, query);
  },
  delete<T>(table: string, query: Record<string, QueryValue>) {
    return supabaseFetch<T[]>(table, { method: "DELETE" }, query);
  },
  rpc<T>(name: string, payload: unknown) {
    return supabaseFetch<T>(`rpc/${name}`, { method: "POST", body: JSON.stringify(payload) });
  },
};

export async function verifyAdminToken(token: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  return (await response.json()) as { id: string; email?: string; role?: string };
}

export async function signInWithPassword(email: string, password: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new SupabaseConfigError();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Neuspešna prijava.");
  return (await response.json()) as { access_token: string; refresh_token: string; user: { id: string; email?: string } };
}
