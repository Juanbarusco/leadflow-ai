-- LeadFlow AI · Release 0.11
-- Authentication, workspaces, persistence, credit ledger foundation and RLS.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  job_title text not null default 'Membro',
  phone text,
  avatar_url text,
  active_organization_id uuid references public.organizations(id) on delete set null,
  default_segment text,
  default_location jsonb not null default '{}'::jsonb,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.missions (
  id uuid primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  city text not null,
  niche text not null,
  status text not null check (status in ('waiting', 'running', 'completed', 'failed')),
  progress integer not null default 0 check (progress between 0 and 100),
  brief jsonb not null default '{}'::jsonb,
  data_source text not null check (data_source in ('google_places', 'demo')),
  data_notice text not null default '',
  search_query text not null default '',
  estimated_time integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  external_id text not null,
  place_id text,
  name text not null,
  city text not null default '',
  state text,
  address text not null default '',
  phone text,
  website text,
  maps_url text,
  rating numeric(3,2) not null default 0,
  reviews integer not null default 0,
  source text not null check (source in ('google_places', 'demo')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_id)
);

create table if not exists public.mission_companies (
  mission_id uuid not null references public.missions(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  ranking integer not null default 0,
  score integer not null default 0,
  priority text not null default 'low' check (priority in ('high', 'medium', 'low')),
  created_at timestamptz not null default now(),
  primary key (mission_id, company_id)
);

-- Foundation for Release 0.13. No payment provider is activated yet.
create table if not exists public.credit_wallets (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  amount integer not null,
  balance_after integer not null check (balance_after >= 0),
  entry_type text not null check (entry_type in ('grant', 'purchase', 'reservation', 'debit', 'refund', 'adjustment')),
  description text not null,
  reference_type text,
  reference_id text,
  idempotency_key text unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_members_user_idx on public.organization_members(user_id);
create index if not exists missions_org_created_idx on public.missions(organization_id, created_at desc);
create index if not exists companies_org_name_idx on public.companies(organization_id, name);
create index if not exists companies_org_external_idx on public.companies(organization_id, external_id);
create index if not exists mission_companies_mission_rank_idx on public.mission_companies(mission_id, ranking);
create index if not exists credit_ledger_org_created_idx on public.credit_ledger(organization_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create or replace trigger credit_wallets_set_updated_at
before update on public.credit_wallets
for each row execute function public.set_updated_at();

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function public.has_organization_role(target_organization_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.role = any(allowed_roles)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_organization_id uuid;
  requested_name text;
  requested_organization text;
begin
  requested_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, 'Usuário'), '@', 1));
  requested_organization := coalesce(nullif(new.raw_user_meta_data ->> 'organization_name', ''), requested_name || ' Workspace');

  insert into public.organizations (name, slug, created_by)
  values (
    requested_organization,
    lower(regexp_replace(requested_organization, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(new.id::text, 8),
    new.id
  )
  returning id into new_organization_id;

  insert into public.profiles (user_id, full_name, job_title, active_organization_id)
  values (new.id, requested_name, 'Founder', new_organization_id);

  insert into public.organization_members (organization_id, user_id, role)
  values (new_organization_id, new.id, 'owner');

  insert into public.credit_wallets (organization_id, balance)
  values (new_organization_id, 0);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.missions enable row level security;
alter table public.companies enable row level security;
alter table public.mission_companies enable row level security;
alter table public.credit_wallets enable row level security;
alter table public.credit_ledger enable row level security;

drop policy if exists "members can view organizations" on public.organizations;
create policy "members can view organizations"
on public.organizations for select to authenticated
using (public.is_organization_member(id));

drop policy if exists "owners and admins can update organizations" on public.organizations;
create policy "owners and admins can update organizations"
on public.organizations for update to authenticated
using (public.has_organization_role(id, array['owner', 'admin']))
with check (public.has_organization_role(id, array['owner', 'admin']));

drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "members can view memberships" on public.organization_members;
create policy "members can view memberships"
on public.organization_members for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "admins can manage memberships" on public.organization_members;
create policy "admins can manage memberships"
on public.organization_members for all to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin']))
with check (public.has_organization_role(organization_id, array['owner', 'admin']));

drop policy if exists "members can view missions" on public.missions;
create policy "members can view missions"
on public.missions for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can create missions" on public.missions;
create policy "members can create missions"
on public.missions for insert to authenticated
with check (public.is_organization_member(organization_id) and created_by = (select auth.uid()));

drop policy if exists "members can update missions" on public.missions;
create policy "members can update missions"
on public.missions for update to authenticated
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "members can view companies" on public.companies;
create policy "members can view companies"
on public.companies for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can create companies" on public.companies;
create policy "members can create companies"
on public.companies for insert to authenticated
with check (public.is_organization_member(organization_id));

drop policy if exists "members can update companies" on public.companies;
create policy "members can update companies"
on public.companies for update to authenticated
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "members can view mission companies" on public.mission_companies;
create policy "members can view mission companies"
on public.mission_companies for select to authenticated
using (
  exists (
    select 1 from public.missions mission
    where mission.id = mission_id
      and public.is_organization_member(mission.organization_id)
  )
);

drop policy if exists "members can create mission companies" on public.mission_companies;
create policy "members can create mission companies"
on public.mission_companies for insert to authenticated
with check (
  exists (
    select 1 from public.missions mission
    where mission.id = mission_id
      and public.is_organization_member(mission.organization_id)
  )
);

drop policy if exists "members can view wallets" on public.credit_wallets;
create policy "members can view wallets"
on public.credit_wallets for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can view ledger" on public.credit_ledger;
create policy "members can view ledger"
on public.credit_ledger for select to authenticated
using (public.is_organization_member(organization_id));

revoke all on public.credit_wallets from anon, authenticated;
revoke all on public.credit_ledger from anon, authenticated;
grant select on public.credit_wallets to authenticated;
grant select on public.credit_ledger to authenticated;

grant select, update on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert, update on public.missions to authenticated;
grant select, insert, update on public.companies to authenticated;
grant select, insert on public.mission_companies to authenticated;
