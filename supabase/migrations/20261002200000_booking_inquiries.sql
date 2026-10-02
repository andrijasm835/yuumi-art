create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.booking_services(id),
  customer_name text not null,
  phone text not null,
  email text,
  instagram text,
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists booking_inquiries_touch_updated_at on public.booking_inquiries;
create trigger booking_inquiries_touch_updated_at
before update on public.booking_inquiries
for each row execute function public.touch_updated_at();

alter table public.booking_inquiries enable row level security;

insert into public.booking_services (id, name, duration_minutes, active, description)
values
  ('professional-makeup', 'Profesionalno šminkanje', 60, true, 'Šminka prilagođena licu, stilu i prilici, sa fokusom na dugotrajnost i osećaj da i dalje izgledaš kao ti.'),
  ('self-makeup-course', 'Našminkaj se sama', 180, true, 'Individualni kurs za sve koji žele da nauče kako da pravilno našminkaju sebe i steknu sigurnost u svakodnevnom šminkanju.'),
  ('basic-course', 'Bazni kurs za početnike', 420, true, 'Kurs za početnike koji žele da naprave prve ozbiljne korake u svetu profesionalnog šminkanja.'),
  ('advanced-training', 'Usavršavanje za šminkere', 180, true, 'Napredniji rad namenjen šminkerima koji već imaju osnovu i žele da unaprede tehniku, preciznost i pristup profesionalnom radu.')
on conflict (id) do update set
  name = excluded.name,
  duration_minutes = excluded.duration_minutes,
  active = excluded.active,
  description = excluded.description;
