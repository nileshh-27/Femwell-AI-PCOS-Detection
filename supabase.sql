-- Run this in your Supabase project's SQL Editor.

-- Enables gen_random_uuid()
create extension if not exists "pgcrypto";

-- === PROFILES ===
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (user_id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles
  for delete
  using (user_id = auth.uid());

-- === ASSESSMENTS ===
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  age int not null,
  height int not null,
  weight int not null,
  cycle_regularity text not null check (cycle_regularity in ('regular', 'irregular', 'absent')),
  symptoms text[] not null default '{}',
  family_history boolean not null,
  exercise_frequency text not null check (exercise_frequency in ('sedentary', 'moderate', 'active')),
  sleep_quality text not null check (sleep_quality in ('good', 'fair', 'poor')),

  risk_score text not null check (risk_score in ('low', 'medium', 'high')),
  confidence int not null,
  contributing_factors text[] not null default '{}',
  recommendations text[] not null default '{}',

  created_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

drop policy if exists "assessments_select_own" on public.assessments;
create policy "assessments_select_own"
  on public.assessments
  for select
  using (user_id = auth.uid());

drop policy if exists "assessments_insert_own" on public.assessments;
create policy "assessments_insert_own"
  on public.assessments
  for insert
  with check (user_id = auth.uid());

drop policy if exists "assessments_update_own" on public.assessments;
create policy "assessments_update_own"
  on public.assessments
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "assessments_delete_own" on public.assessments;
create policy "assessments_delete_own"
  on public.assessments
  for delete
  using (user_id = auth.uid());
