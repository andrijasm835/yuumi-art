revoke execute on function public.replace_weekly_availability(integer, jsonb) from public;
revoke execute on function public.replace_weekly_availability(integer, jsonb) from anon;
revoke execute on function public.replace_weekly_availability(integer, jsonb) from authenticated;
grant execute on function public.replace_weekly_availability(integer, jsonb) to service_role;
