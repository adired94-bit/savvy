-- Savvy: Smart Switch engine (provider catalog, affiliate offers, switch event log).
--
-- Business data (affiliate links, partner ids, expected commission) lives in `offers` and is NOT
-- readable by app users: only the service role (server routes) reads it. Users see `offers_public`.
-- Every impression, click and conversion is appended to `switch_events`, which can never be edited.

create type public.switch_mode  as enum ('digital', 'agent', 'both');
create type public.switch_event as enum (
  'impression',          -- the card was shown
  'dismissed',           -- the user closed it
  'click',               -- the user tapped "switch" (recorded by the redirect route)
  'agent_requested',     -- the user asked a representative to contact them (consent required)
  'converted',           -- the partner confirmed the switch (service role only)
  'reward_confirmed',    -- the network confirmed the commission (service role only)
  'failed'               -- the switch did not go through (service role only)
);

-- ------------------------------------------------------------------ providers (catalog, shared by all users)
create table public.providers (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name           text not null,
  topic          public.claim_topic not null,
  jurisdiction   public.jurisdiction not null default 'IL',
  website        text check (website is null or website ~ '^https://'),
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger providers_updated before update on public.providers for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------ offers (what we can recommend)
create table public.offers (
  id             uuid primary key default gen_random_uuid(),
  provider_id    uuid not null references public.providers (id) on delete cascade,
  topic          public.claim_topic not null,
  jurisdiction   public.jurisdiction not null default 'IL',
  title          text not null,
  plan_name      text,
  monthly_price  numeric(14,2) not null check (monthly_price >= 0),
  currency       char(3) not null default 'ILS' check (currency ~ '^[A-Z]{3}$'),
  min_term_months int check (min_term_months is null or min_term_months >= 0),
  switch_mode    public.switch_mode not null default 'both',
  highlights     text[] not null default '{}',
  terms_url      text check (terms_url is null or terms_url ~ '^https://'),
  -- Affiliate / partner fields (internal):
  affiliate_network text,                                          -- e.g. the network or "direct"
  affiliate_url  text not null check (affiliate_url ~ '^https://'),  -- destination; {click_id} is replaced at redirect time
  partner_id     text not null,                                    -- our id at the network, sent as the tracking parameter
  cpa_reward     numeric(14,2) not null default 0 check (cpa_reward >= 0),  -- predicted commission per confirmed switch
  cpa_currency   char(3) not null default 'ILS' check (cpa_currency ~ '^[A-Z]{3}$'),
  valid_from     timestamptz not null default now(),
  valid_until    timestamptz,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from)
);
create index offers_lookup_idx on public.offers (topic, jurisdiction) where active;
create trigger offers_updated before update on public.offers for each row execute function public.set_updated_at();

alter table public.providers enable row level security;
alter table public.offers    enable row level security;

-- Providers are public catalog data. Offers have no policy at all: app users cannot read them.
create policy providers_read on public.providers for select to authenticated using (active);

-- What the app may show: no affiliate url, partner id or commission.
create view public.offers_public as
  select o.id, o.provider_id, p.name as provider_name, p.website as provider_website,
         o.topic, o.jurisdiction, o.title, o.plan_name, o.monthly_price, o.currency,
         o.min_term_months, o.switch_mode, o.highlights, o.terms_url
  from public.offers o
  join public.providers p on p.id = o.provider_id
  where o.active and p.active
    and o.valid_from <= now()
    and (o.valid_until is null or o.valid_until > now());
revoke all on public.offers_public from public;
grant select on public.offers_public to authenticated;

-- ------------------------------------------------------------------ switch events (append-only log)
create table public.switch_events (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users (id) on delete cascade,
  offer_id       uuid not null references public.offers (id) on delete restrict,
  event_type     public.switch_event not null,
  click_id       uuid not null default gen_random_uuid(),   -- one per click, also sent to the partner to match conversions
  claim_id       uuid references public.claims (id) on delete set null,
  document_id    uuid references public.documents (id) on delete set null,
  channel        text check (channel in ('digital', 'agent')),
  current_price  numeric(14,2),             -- what the user pays today, per month
  offer_price    numeric(14,2),
  currency       char(3) check (currency ~ '^[A-Z]{3}$'),
  yearly_saving  numeric(14,2),
  expected_reward numeric(14,2),            -- snapshot of offers.cpa_reward when the event happened
  reward_currency char(3),
  consent        jsonb,                     -- exactly what the user agreed to share, and when
  meta           jsonb not null default '{}'::jsonb,
  at             timestamptz not null default now(),
  -- Sharing details with a representative needs recorded consent.
  check (event_type <> 'agent_requested' or (consent is not null and channel = 'agent'))
);
create index switch_events_user_idx  on public.switch_events (user_id, at desc);
create index switch_events_offer_idx on public.switch_events (offer_id, event_type);
create index switch_events_click_idx on public.switch_events (click_id);

-- Stamp every event with the offer's current commission, so reporting survives later price changes.
create or replace function public.switch_events_snapshot() returns trigger
language plpgsql security definer set search_path = public as $$
declare o public.offers;
begin
  select * into o from public.offers where id = new.offer_id;
  new.expected_reward = coalesce(new.expected_reward, o.cpa_reward);
  new.reward_currency = coalesce(new.reward_currency, o.cpa_currency);
  return new;
end $$;
create trigger switch_events_snapshot before insert on public.switch_events
  for each row execute function public.switch_events_snapshot();

-- Never edited; deleted only when the account itself is erased (same rule as audit_log).
create or replace function public.switch_events_immutable() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if tg_op = 'DELETE' and not exists (select 1 from auth.users where id = old.user_id) then
    return old;
  end if;
  raise exception 'switch_events is append-only';
end $$;
create trigger switch_events_no_update before update or delete on public.switch_events
  for each row execute function public.switch_events_immutable();

alter table public.switch_events enable row level security;
create policy switch_events_select on public.switch_events for select to authenticated using (auth.uid() = user_id);
-- Users can log only what they do themselves. Conversions and rewards come from the partner, via the service role.
create policy switch_events_insert on public.switch_events for insert to authenticated
  with check (auth.uid() = user_id and event_type in ('impression', 'dismissed', 'click', 'agent_requested'));
