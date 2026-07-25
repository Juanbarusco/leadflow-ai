-- LeadFlow AI · Release 0.12
-- CRM foundation, interaction history, tasks and AI-assisted next actions.

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete set null,
  stage text not null default 'new' check (stage in ('new', 'contacted', 'follow_up', 'meeting', 'proposal', 'negotiation', 'won', 'lost')),
  estimated_value numeric(12,2) not null default 0 check (estimated_value >= 0),
  probability integer not null default 15 check (probability between 0 and 100),
  next_action text,
  next_action_at timestamptz,
  ai_summary text,
  loss_reason text,
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, company_id)
);

create table if not exists public.crm_interactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  deal_id uuid not null references public.crm_deals(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  channel text not null check (channel in ('call', 'whatsapp', 'email', 'meeting', 'note')),
  outcome text not null check (outcome in ('completed', 'no_answer', 'busy', 'asked_return', 'meeting_booked', 'proposal_requested', 'not_interested', 'won', 'lost')),
  notes text not null check (char_length(notes) between 1 and 5000),
  message_used text,
  ai_objection text,
  ai_recommendation text,
  stage_before text not null check (stage_before in ('new', 'contacted', 'follow_up', 'meeting', 'proposal', 'negotiation', 'won', 'lost')),
  stage_after text not null check (stage_after in ('new', 'contacted', 'follow_up', 'meeting', 'proposal', 'negotiation', 'won', 'lost')),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  deal_id uuid not null references public.crm_deals(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  description text,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'done', 'cancelled')),
  source text not null default 'manual' check (source in ('manual', 'ai')),
  interaction_id uuid references public.crm_interactions(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_deals_org_stage_idx on public.crm_deals(organization_id, stage, updated_at desc);
create index if not exists crm_deals_owner_idx on public.crm_deals(owner_id, updated_at desc);
create index if not exists crm_interactions_deal_date_idx on public.crm_interactions(deal_id, occurred_at desc);
create index if not exists crm_interactions_org_date_idx on public.crm_interactions(organization_id, occurred_at desc);
create index if not exists crm_tasks_org_status_due_idx on public.crm_tasks(organization_id, status, due_at);
create index if not exists crm_tasks_deal_status_idx on public.crm_tasks(deal_id, status, due_at);

create or replace trigger crm_deals_set_updated_at
before update on public.crm_deals
for each row execute function public.set_updated_at();

create or replace trigger crm_tasks_set_updated_at
before update on public.crm_tasks
for each row execute function public.set_updated_at();

alter table public.crm_deals enable row level security;
alter table public.crm_interactions enable row level security;
alter table public.crm_tasks enable row level security;

drop policy if exists "members can view crm deals" on public.crm_deals;
create policy "members can view crm deals"
on public.crm_deals for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can create crm deals" on public.crm_deals;
create policy "members can create crm deals"
on public.crm_deals for insert to authenticated
with check (
  public.is_organization_member(organization_id)
  and (owner_id is null or owner_id = (select auth.uid()))
);

drop policy if exists "members can update crm deals" on public.crm_deals;
create policy "members can update crm deals"
on public.crm_deals for update to authenticated
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "admins can delete crm deals" on public.crm_deals;
create policy "admins can delete crm deals"
on public.crm_deals for delete to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin']));

drop policy if exists "members can view crm interactions" on public.crm_interactions;
create policy "members can view crm interactions"
on public.crm_interactions for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can create crm interactions" on public.crm_interactions;
create policy "members can create crm interactions"
on public.crm_interactions for insert to authenticated
with check (
  public.is_organization_member(organization_id)
  and created_by = (select auth.uid())
);

drop policy if exists "members can view crm tasks" on public.crm_tasks;
create policy "members can view crm tasks"
on public.crm_tasks for select to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists "members can create crm tasks" on public.crm_tasks;
create policy "members can create crm tasks"
on public.crm_tasks for insert to authenticated
with check (
  public.is_organization_member(organization_id)
  and (assigned_to is null or assigned_to = (select auth.uid()))
);

drop policy if exists "members can update crm tasks" on public.crm_tasks;
create policy "members can update crm tasks"
on public.crm_tasks for update to authenticated
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "admins can delete crm tasks" on public.crm_tasks;
create policy "admins can delete crm tasks"
on public.crm_tasks for delete to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin']));

grant select, insert, update, delete on public.crm_deals to authenticated;
grant select, insert on public.crm_interactions to authenticated;
grant select, insert, update, delete on public.crm_tasks to authenticated;
