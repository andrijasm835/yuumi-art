alter table public.bookings
  alter column phone drop not null;

alter table public.booking_inquiries
  alter column phone drop not null;

alter table public.bookings
  add constraint bookings_email_required
  check (email is not null and btrim(email) <> '')
  not valid;

alter table public.booking_inquiries
  add constraint booking_inquiries_email_required
  check (email is not null and btrim(email) <> '')
  not valid;
