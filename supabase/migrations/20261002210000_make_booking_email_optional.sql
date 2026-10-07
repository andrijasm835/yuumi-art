alter table public.bookings
  drop constraint if exists bookings_email_required;

alter table public.booking_inquiries
  drop constraint if exists booking_inquiries_email_required;
