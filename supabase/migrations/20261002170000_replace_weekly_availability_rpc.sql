create or replace function public.replace_weekly_availability(
  p_weekday integer,
  p_intervals jsonb
)
returns setof public.weekly_availability
language plpgsql
set search_path = public
as $$
declare
  interval_item jsonb;
  start_value time;
  end_value time;
begin
  if p_weekday is null or p_weekday < 0 or p_weekday > 6 then
    raise exception 'Invalid weekday';
  end if;

  if p_intervals is null then
    p_intervals := '[]'::jsonb;
  end if;

  if jsonb_typeof(p_intervals) <> 'array' then
    raise exception 'Intervals must be an array';
  end if;

  create temporary table if not exists pg_temp.weekly_availability_replacement (
    start_time time not null,
    end_time time not null
  ) on commit drop;

  truncate table pg_temp.weekly_availability_replacement;

  for interval_item in select * from jsonb_array_elements(p_intervals)
  loop
    start_value := (interval_item ->> 'startTime')::time;
    end_value := (interval_item ->> 'endTime')::time;

    if start_value >= end_value then
      raise exception 'Invalid interval';
    end if;

    if exists (
      select 1
      from pg_temp.weekly_availability_replacement existing
      where existing.start_time < end_value
        and start_value < existing.end_time
    ) then
      raise exception 'Overlapping intervals';
    end if;

    insert into pg_temp.weekly_availability_replacement (start_time, end_time)
    values (start_value, end_value);
  end loop;

  delete from public.weekly_availability
  where weekday = p_weekday;

  insert into public.weekly_availability (weekday, start_time, end_time, active)
  select p_weekday, start_time, end_time, true
  from pg_temp.weekly_availability_replacement
  order by start_time;

  return query
  select *
  from public.weekly_availability
  where weekday = p_weekday
  order by start_time;
end;
$$;
