begin;

alter table public.vehicle_grades
  add column if not exists positioning_summary text,
  add column if not exists best_for text;

commit;
