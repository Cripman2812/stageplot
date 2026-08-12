-- StageForge cloud schema. Run in Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  payload jsonb not null,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_user_id_idx on public.projects(user_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

drop policy if exists "profile own row" on public.profiles;
create policy "profile own row" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
drop policy if exists "project owner read" on public.projects;
create policy "project owner read" on public.projects for select using (auth.uid()=user_id);
drop policy if exists "project owner insert" on public.projects;
create policy "project owner insert" on public.projects for insert with check (auth.uid()=user_id);
drop policy if exists "project owner update" on public.projects;
create policy "project owner update" on public.projects for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "project owner delete" on public.projects;
create policy "project owner delete" on public.projects for delete using (auth.uid()=user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id) values(new.id) on conflict do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
