begin;

alter table public.vehicles
  add column if not exists body_type text,
  add column if not exists overview text,
  add column if not exists best_for text,
  add column if not exists thumbnail_url text;

commit;
