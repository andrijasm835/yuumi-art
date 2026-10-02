# Yuumi Art

Premium one-page website with Supabase-backed booking.

## Supabase env

Create `.env.local` and keep secrets out of git:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ADMIN_EMAIL_ALLOWLIST=adriana@example.com
RESEND_API_KEY=...
BOOKING_ADMIN_EMAIL=adriana@example.com
BOOKING_FROM_EMAIL=Yuumi Art <booking@yourdomain.com>
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Legacy fallback names still work during migration:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SECRET_KEY` is server-only. Never expose it to browser code or prefix it with `NEXT_PUBLIC_`.

Run all SQL migrations in `supabase/migrations/`, including the booking schema and `replace_weekly_availability` RPC migration.

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

Booking email notifications are sent server-side with Resend. `RESEND_API_KEY`, `BOOKING_ADMIN_EMAIL` and `BOOKING_FROM_EMAIL` must stay server-only and must not use the `NEXT_PUBLIC_` prefix.

Transactional emails:

- new pending request to Adriana
- optional request-received email to the customer when email is provided
- confirmation email for `pending -> confirmed`
- rejection email for `pending -> rejected`
- cancellation email for `confirmed -> cancelled`

Email failures are logged server-side and do not roll back booking persistence or admin status updates.

For production, `BOOKING_FROM_EMAIL` should use a Resend-verified sending domain. `NEXT_PUBLIC_SITE_URL` is used for canonical metadata, sitemap, robots and admin links inside emails, so it must be the final HTTPS domain.

## Production checklist

1. Configure production env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `ADMIN_EMAIL_ALLOWLIST`
   - `RESEND_API_KEY`
   - `BOOKING_ADMIN_EMAIL`
   - `BOOKING_FROM_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
2. Keep `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` server-only. Never prefix them with `NEXT_PUBLIC_`.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.
4. Confirm the Supabase production project is active.
5. Apply the latest migrations.
6. Configure Adriana's admin account via `app_metadata.role = "admin"` or `ADMIN_EMAIL_ALLOWLIST`.
7. Verify the Resend sending domain.
8. Ensure `BOOKING_FROM_EMAIL` uses that verified domain.
9. Confirm `BOOKING_ADMIN_EMAIL` is correct.
10. Configure DNS/domain and HTTPS.
11. Perform one real test booking.
12. Test admin confirm/reject/cancel.
13. Confirm customer email delivery.
14. Confirm blocked, pending and confirmed slots disappear from public availability.
15. Verify `/robots.txt` and `/sitemap.xml`.
16. Verify `/admin` is noindex.

Recommended production abuse protection: add an edge/CDN rate limit or Turnstile in front of `/api/booking` if traffic increases. The server currently rejects oversized requests, validates all booking fields, and keeps Supabase as the source of truth, but it does not claim production-grade IP rate limiting without an external service.
