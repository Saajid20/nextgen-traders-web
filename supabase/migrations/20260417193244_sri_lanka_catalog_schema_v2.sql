begin;

create extension if not exists pgcrypto;

-- Shared updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1) New table: vehicle_chassis_groups
create table if not exists public.vehicle_chassis_groups (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  group_code text not null,
  display_name text not null,
  chassis_code text,
  fuel_type text,
  transmission text,
  drivetrain text,
  engine_cc_min integer,
  engine_cc_max integer,
  year_start integer,
  year_end integer,
  market_focus text not null default 'Sri Lanka imports',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_chassis_groups_vehicle_group_code_key unique (vehicle_id, group_code),
  constraint vehicle_chassis_groups_engine_range_check
    check (
      engine_cc_min is null
      or engine_cc_max is null
      or engine_cc_min <= engine_cc_max
    ),
  constraint vehicle_chassis_groups_year_range_check
    check (
      year_start is null
      or year_end is null
      or year_start <= year_end
    )
);

create index if not exists vehicle_chassis_groups_vehicle_id_idx
  on public.vehicle_chassis_groups(vehicle_id);

create index if not exists vehicle_chassis_groups_active_sort_idx
  on public.vehicle_chassis_groups(vehicle_id, is_active, sort_order);

drop trigger if exists set_vehicle_chassis_groups_updated_at on public.vehicle_chassis_groups;
create trigger set_vehicle_chassis_groups_updated_at
before update on public.vehicle_chassis_groups
for each row
execute function public.set_updated_at();

-- 2) New table: grade_features
create table if not exists public.grade_features (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.vehicle_grades(id) on delete cascade,
  feature_category text not null default 'general',
  feature_key text,
  feature_label text not null,
  feature_value text,
  sort_order integer not null default 0,
  is_highlight boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grade_features_grade_feature_label_key unique (grade_id, feature_label),
  constraint grade_features_label_not_blank check (btrim(feature_label) <> '')
);

create index if not exists grade_features_grade_id_idx
  on public.grade_features(grade_id);

create index if not exists grade_features_grade_category_sort_idx
  on public.grade_features(grade_id, feature_category, sort_order);

drop trigger if exists set_grade_features_updated_at on public.grade_features;
create trigger set_grade_features_updated_at
before update on public.grade_features
for each row
execute function public.set_updated_at();

-- 3) New table: vehicle_market_updates
create table if not exists public.vehicle_market_updates (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  chassis_group_id uuid references public.vehicle_chassis_groups(id) on delete set null,
  update_type text not null default 'market_note',
  title text not null,
  summary text not null,
  impact_level text not null default 'info',
  source_name text,
  source_url text,
  effective_date date,
  published_at timestamptz not null default now(),
  is_active boolean not null default true,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_market_updates_target_check
    check (vehicle_id is not null or chassis_group_id is not null),
  constraint vehicle_market_updates_title_not_blank check (btrim(title) <> ''),
  constraint vehicle_market_updates_summary_not_blank check (btrim(summary) <> '')
);

create index if not exists vehicle_market_updates_vehicle_id_idx
  on public.vehicle_market_updates(vehicle_id);

create index if not exists vehicle_market_updates_chassis_group_id_idx
  on public.vehicle_market_updates(chassis_group_id);

create index if not exists vehicle_market_updates_published_at_idx
  on public.vehicle_market_updates(vehicle_id, published_at desc);

drop trigger if exists set_vehicle_market_updates_updated_at on public.vehicle_market_updates;
create trigger set_vehicle_market_updates_updated_at
before update on public.vehicle_market_updates
for each row
execute function public.set_updated_at();

-- 4) Update vehicle_grades to belong to chassis groups instead of vehicles
alter table public.vehicle_grades
  add column if not exists chassis_group_id uuid,
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Create one default chassis group per existing vehicle so current grade data can be migrated safely.
insert into public.vehicle_chassis_groups (
  vehicle_id,
  group_code,
  display_name,
  chassis_code,
  fuel_type,
  engine_cc_min,
  engine_cc_max,
  sort_order,
  is_active,
  notes
)
select
  v.id,
  coalesce(nullif(v.chassis, ''), v.slug),
  coalesce(
    nullif(concat_ws(' ', v.make, v.model, nullif(v.chassis, '')), ''),
    v.slug
  ),
  nullif(v.chassis, ''),
  v.fuel_type,
  v.engine_cc,
  v.engine_cc,
  0,
  true,
  'Auto-created during chassis-group migration'
from public.vehicles v
where not exists (
  select 1
  from public.vehicle_chassis_groups vcg
  where vcg.vehicle_id = v.id
    and vcg.group_code = coalesce(nullif(v.chassis, ''), v.slug)
);

-- Backfill vehicle_grades.chassis_group_id from old vehicle_id relationship.
update public.vehicle_grades vg
set chassis_group_id = vcg.id
from public.vehicles v
join public.vehicle_chassis_groups vcg
  on vcg.vehicle_id = v.id
 and vcg.group_code = coalesce(nullif(v.chassis, ''), v.slug)
where vg.vehicle_id = v.id
  and vg.chassis_group_id is null;

-- Move legacy array features into normalized grade_features rows if vehicle_grades.features exists.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vehicle_grades'
      and column_name = 'features'
  ) then
    insert into public.grade_features (
      grade_id,
      feature_category,
      feature_key,
      feature_label,
      sort_order,
      is_highlight
    )
    select
      vg.id,
      'general',
      md5(lower(trim(f.feature))),
      trim(f.feature),
      greatest(f.ordinality - 1, 0),
      true
    from public.vehicle_grades vg
    cross join lateral unnest(coalesce(vg.features, '{}'::text[])) with ordinality as f(feature, ordinality)
    where trim(f.feature) <> ''
      and not exists (
        select 1
        from public.grade_features gf
        where gf.grade_id = vg.id
          and gf.feature_label = trim(f.feature)
      );
  end if;
end $$;

-- Safety check before enforcing NOT NULL
do $$
begin
  if exists (
    select 1
    from public.vehicle_grades
    where chassis_group_id is null
  ) then
    raise exception 'Backfill failed: some vehicle_grades rows are missing chassis_group_id';
  end if;
end $$;

alter table public.vehicle_grades
  alter column chassis_group_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'vehicle_grades_chassis_group_id_fkey'
      and conrelid = 'public.vehicle_grades'::regclass
  ) then
    alter table public.vehicle_grades
      add constraint vehicle_grades_chassis_group_id_fkey
      foreign key (chassis_group_id)
      references public.vehicle_chassis_groups(id)
      on delete cascade;
  end if;
end $$;

create index if not exists vehicle_grades_chassis_group_id_idx
  on public.vehicle_grades(chassis_group_id);

create index if not exists vehicle_grades_active_sort_idx
  on public.vehicle_grades(chassis_group_id, is_active, sort_order);

drop trigger if exists set_vehicle_grades_updated_at on public.vehicle_grades;
create trigger set_vehicle_grades_updated_at
before update on public.vehicle_grades
for each row
execute function public.set_updated_at();

-- Remove old direct FK dependency on vehicles once backfill is complete,
-- but keep vehicle_id column for now so app code does not break immediately.
do $$
declare
  constraint_name text;
begin
  select c.conname
  into constraint_name
  from pg_constraint c
  where c.conrelid = 'public.vehicle_grades'::regclass
    and c.contype = 'f'
    and c.confrelid = 'public.vehicles'::regclass
  limit 1;

  if constraint_name is not null then
    execute format(
      'alter table public.vehicle_grades drop constraint %I',
      constraint_name
    );
  end if;
end $$;

-- Keep these legacy columns temporarily during app migration:
-- vehicle_id
-- features

commit;