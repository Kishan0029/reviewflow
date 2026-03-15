-- =============================================
-- ReviewFlow V1 — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

-- 2. businesses table
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

-- 3. locations table
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  google_place_id text not null default '',
  qr_slug text unique not null,
  created_at timestamptz not null default now()
);

-- 4. feedback table
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  issues text[],
  customer_phone text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================
-- Row Level Security
-- =============================================

alter table profiles enable row level security;
alter table businesses enable row level security;
alter table locations enable row level security;
alter table feedback enable row level security;

-- profiles: users can only read/update their own profile
create policy "profiles: own row access"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- businesses: owner can do everything
create policy "businesses: owner access"
  on businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- locations: owner can do everything (via businesses join)
create policy "locations: owner access"
  on locations for all
  using (
    exists (
      select 1 from businesses b
      where b.id = locations.business_id
        and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from businesses b
      where b.id = locations.business_id
        and b.owner_id = auth.uid()
    )
  );

-- locations: public SELECT using qr_slug for the feedback page
create policy "locations: public read by slug"
  on locations for select
  using (true);

-- feedback: anyone can INSERT
create policy "feedback: public insert"
  on feedback for insert
  with check (true);

-- feedback: only owner can SELECT/UPDATE
create policy "feedback: owner select"
  on feedback for select
  using (
    exists (
      select 1 from locations l
      join businesses b on b.id = l.business_id
      where l.id = feedback.location_id
        and b.owner_id = auth.uid()
    )
  );

create policy "feedback: owner update"
  on feedback for update
  using (
    exists (
      select 1 from locations l
      join businesses b on b.id = l.business_id
      where l.id = feedback.location_id
        and b.owner_id = auth.uid()
    )
  );

-- =============================================
-- Trigger: auto-create profile on signup
-- =============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
