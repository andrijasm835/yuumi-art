# Yummi Art

Premium one-page website with Supabase-backed booking.

## Supabase env

Create `.env.local` and keep secrets out of git:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Run the SQL migration in `supabase/migrations/20261002114500_booking_system.sql`.

Create Adriana's admin user in Supabase Auth. `/admin` uses Supabase email/password login and all admin mutations call server routes with the returned access token.

## Booking

Public booking flow:

1. Usluga
2. Datum
3. Vreme
4. Podaci
5. Potvrda

Pending and confirmed bookings reserve their interval. Rejected and cancelled bookings release it. Server routes recompute duration and availability before insert; PostgreSQL exclusion constraint prevents overlapping active bookings.

Notification hooks are prepared in `src/lib/booking/notifications.ts`; configure an email/SMS provider later before claiming delivery.
