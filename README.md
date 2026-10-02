# Yummi Art

Premium one-page website with Supabase-backed booking.

## Supabase env

Create `.env.local` and keep secrets out of git:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ADMIN_EMAIL_ALLOWLIST=adriana@example.com
```

Legacy fallback names still work during migration:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SECRET_KEY` is server-only. Never expose it to browser code or prefix it with `NEXT_PUBLIC_`.

Run the SQL migration in `supabase/migrations/20261002114500_booking_system.sql`.

Create Adriana's admin user in Supabase Auth. Mark the account as admin in Supabase Auth user metadata:

```json
{
  "app_metadata": {
    "role": "admin"
  }
}
```

Alternatively set `ADMIN_EMAIL_ALLOWLIST` as a comma-separated fallback. A valid Supabase login is not enough for admin access.

## Booking

Public booking flow:

1. Usluga
2. Datum
3. Vreme
4. Podaci
5. Potvrda

Pending and confirmed bookings reserve their interval. Rejected and cancelled bookings release it. Server routes recompute duration and availability before insert; PostgreSQL exclusion constraint prevents overlapping active bookings.

Notification hooks are prepared in `src/lib/booking/notifications.ts`; configure an email/SMS provider later before claiming delivery.
