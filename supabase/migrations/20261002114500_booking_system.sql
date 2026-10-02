create extension if not exists btree_gist;

create table if not exists public.booking_services (
  id text primary key,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  description text,
  price integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_availability (
  id uuid primary key default gen_random_uuid(),
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  check (start_time < end_time)
);

create table if not exists public.availability_exceptions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time,
  end_time time,
  type text not null check (type in ('blocked_day', 'blocked_interval', 'custom_availability')),
  reason text,
  created_at timestamptz not null default now(),
  check (
    (type = 'blocked_day' and start_time is null and end_time is null)
    or (type <> 'blocked_day' and start_time is not null and end_time is not null and start_time < end_time)
  )
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.booking_services(id),
  customer_name text not null,
  phone text not null,
  email text,
  instagram text,
  note text,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_time < end_time)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'no_active_booking_overlap'
  ) then
    alter table public.bookings
      add constraint no_active_booking_overlap
      exclude using gist (
        booking_date with =,
        tsrange(
          booking_date + start_time,
          booking_date + end_time,
          '[)'
        ) with &&
      )
      where (status in ('pending', 'confirmed'));
  end if;
end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_services_touch_updated_at on public.booking_services;
create trigger booking_services_touch_updated_at
before update on public.booking_services
for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

insert into public.booking_services (id, name, duration_minutes, active, description)
values
  ('professional-makeup', 'Profesionalno šminkanje', 90, true, 'Šminka prilagođena licu, stilu i prilici.'),
  ('self-makeup-course', 'Našminkaj se sama', 120, true, 'Individualni kurs svakodnevnog šminkanja.'),
  ('basic-course', 'Bazni kurs za početnike', 180, true, 'Osnovne tehnike profesionalnog šminkanja.'),
  ('advanced-training', 'Usavršavanje za šminkere', 180, true, 'Napredniji rad za šminkere.')
on conflict (id) do update
set name = excluded.name,
    duration_minutes = excluded.duration_minutes,
    active = excluded.active,
    description = excluded.description;

insert into public.weekly_availability (weekday, start_time, end_time, active)
values
  (1, '10:00', '18:00', true),
  (2, '10:00', '18:00', true),
  (4, '12:00', '20:00', true),
  (5, '10:00', '18:00', true),
  (6, '09:00', '17:00', true)
on conflict do nothing;

alter table public.booking_services enable row level security;
alter table public.weekly_availability enable row level security;
alter table public.availability_exceptions enable row level security;
alter table public.bookings enable row level security;
