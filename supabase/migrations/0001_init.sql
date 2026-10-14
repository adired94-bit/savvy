-- Savvy: initial schema.
-- Every table is owned by one user and protected by row level security (auth.uid() = user_id).
-- Money is stored as numeric(14,2) in the document's own currency (ISO 4217), never converted.
-- Review with an attorney before launch: grant text, retention periods and audit rules.

-- ------------------------------------------------------------------ enums
create type public.jurisdiction      as enum ('IL', 'US', 'EU', 'UK', 'OTHER');
create type public.claim_topic       as enum ('telecom', 'insurance', 'banking', 'flight', 'product', 'subscription', 'other');
create type public.document_source   as enum ('gmail', 'outlook', 'upload', 'camera');
create type public.document_status   as enum ('processing', 'ready', 'needs_review', 'failed');
create type public.document_type     as enum ('invoice', 'receipt', 'statement', 'renewal_notice', 'other');
create type public.recurrence_kind   as enum ('recurring', 'one_time');
create type public.claim_status      as enum ('awaiting_approval', 'sent', 'in_progress', 'resolved', 'rejected');
create type public.claim_outcome     as enum ('refund', 'price_reduction', 'none');

-- ------------------------------------------------------------------ helpers
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ------------------------------------------------------------------ profiles (one row per auth user)
create table public.profiles (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  full_name      text not null default '',
  email          text,
  phone          text,
  national_id_last4 text check (national_id_last4 ~ '^[0-9]{4}$'),   -- only the last digits, never the full number
  address        jsonb not null default '{}'::jsonb,
  country        text not null default 'IL' check (char_length(country) = 2),
  locale         text not null default 'he-IL',
  default_currency text not null default 'ILS' check (char_length(default_currency) = 3),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

-- A profile row appears automatically on sign-up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (user_id) do nothing;
  insert into public.notification_prefs (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end $$;

-- ------------------------------------------------------------------ notification preferences
create table public.notification_prefs (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  email_updates    boolean not null default true,
  push_updates     boolean not null default true,
  weekly_summary   boolean not null default true,
  approval_reminders boolean not null default true,
  updated_at       timestamptz not null default now()
);
create trigger notification_prefs_updated before update on public.notification_prefs for each row execute function public.set_updated_at();

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------ connected accounts (mail, banks)
-- Tokens are NOT stored here. Only a reference to the secret kept in Supabase Vault / the provider.
create table public.connected_accounts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  provider       text not null check (provider in ('gmail', 'outlook', 'bank', 'card')),
  account_label  text not null,
  secret_ref     text,
  last_synced_at timestamptz,
  revoked_at     timestamptz,
  created_at     timestamptz not null default now(),
  unique (user_id, provider, account_label)
);
create index connected_accounts_user_idx on public.connected_accounts (user_id);

-- ------------------------------------------------------------------ documents (invoices, receipts, statements)
create table public.documents (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  source         public.document_source not null,
  status         public.document_status not null default 'processing',
  doc_type       public.document_type not null default 'other',
  provider       text not null default '',
  label          text not null default '',
  topic          public.claim_topic not null default 'other',
  jurisdiction   public.jurisdiction not null default 'IL',
  currency       char(3) not null default 'ILS' check (currency ~ '^[A-Z]{3}$'),
  total          numeric(14,2) not null default 0,
  issued_on      date,
  language       text,
  finding        text,
  potential_saving numeric(14,2) not null default 0 check (potential_saving >= 0),
  storage_path   text,                     -- object in the private "documents" bucket: <user_id>/<file>
  extraction     jsonb,                    -- raw structured result from the model, for audit and re-runs
  model          text,
  received_at    timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index documents_user_received_idx on public.documents (user_id, received_at desc);
create trigger documents_updated before update on public.documents for each row execute function public.set_updated_at();

create table public.line_items (
  id             uuid primary key default gen_random_uuid(),
  document_id    uuid not null references public.documents (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  name           text not null,
  charged_on     date,
  amount         numeric(14,2) not null,   -- credits are negative
  recurrence     public.recurrence_kind not null default 'one_time',
  flag           text,
  position       int not null default 0
);
create index line_items_document_idx on public.line_items (document_id, position);
create index line_items_user_idx on public.line_items (user_id);

-- ------------------------------------------------------------------ power of attorney grants (the vault)
create table public.poa_grants (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  topics         public.claim_topic[] not null check (cardinality(topics) > 0),
  jurisdictions  public.jurisdiction[] not null default '{IL}',
  max_amount     numeric(14,2),            -- null = no per-claim cap
  currency       char(3) not null default 'ILS' check (currency ~ '^[A-Z]{3}$'),
  can_send_letters boolean not null default true,
  can_accept_settlements boolean not null default false,
  granted_at     timestamptz not null default now(),
  expires_at     timestamptz not null default (now() + interval '12 months'),
  revoked_at     timestamptz,
  signature_hash text,                     -- hash of the signed grant document, not the signature image
  document_text  text not null,            -- the exact wording the user agreed to
  check (expires_at > granted_at)
);
create index poa_grants_user_idx on public.poa_grants (user_id, granted_at desc);

-- ------------------------------------------------------------------ claims and negotiations
create table public.claims (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  document_id    uuid references public.documents (id) on delete set null,
  poa_grant_id   uuid references public.poa_grants (id) on delete set null,
  provider       text not null,
  topic          public.claim_topic not null,
  jurisdiction   public.jurisdiction not null default 'IL',
  currency       char(3) not null default 'ILS' check (currency ~ '^[A-Z]{3}$'),
  title          text not null,
  finding        text not null default '',
  status         public.claim_status not null default 'awaiting_approval',
  outcome        public.claim_outcome,
  estimated_saving numeric(14,2) not null default 0 check (estimated_saving >= 0),
  actual_saving  numeric(14,2) check (actual_saving >= 0),
  ground_ids     text[] not null default '{}',   -- ids from src/lib/legal; only grounds the engine offered
  facts          jsonb not null default '{}'::jsonb,
  letter_language text check (letter_language in ('he', 'en')),
  letter_subject text,
  letter_body    text,
  letter_is_template boolean not null default false,
  approved_at    timestamptz,
  sent_at        timestamptz,
  resolved_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index claims_user_status_idx on public.claims (user_id, status, created_at desc);
create trigger claims_updated before update on public.claims for each row execute function public.set_updated_at();

create table public.claim_events (
  id             uuid primary key default gen_random_uuid(),
  claim_id       uuid not null references public.claims (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  status         public.claim_status not null,
  title          text not null,
  detail         text,
  at             timestamptz not null default now()
);
create index claim_events_claim_idx on public.claim_events (claim_id, at);

-- A claim may be sent only under an active, unexpired grant that covers its topic and jurisdiction,
-- is allowed to send letters, and whose cap covers the amount (same currency only).
create or replace function public.enforce_poa_before_send() returns trigger
language plpgsql as $$
declare g public.poa_grants;
begin
  if new.status in ('sent', 'in_progress', 'resolved') and (tg_op = 'INSERT' or old.status = 'awaiting_approval') then
    select * into g from public.poa_grants where id = new.poa_grant_id and user_id = new.user_id;
    if g.id is null
       or g.revoked_at is not null
       or g.expires_at <= now()
       or not g.can_send_letters
       or not (new.topic = any (g.topics))
       or not (new.jurisdiction = any (g.jurisdictions))
       or (g.max_amount is not null and g.currency = new.currency and new.estimated_saving > g.max_amount)
    then
      raise exception 'No active power of attorney covers this claim' using errcode = 'check_violation';
    end if;
    new.sent_at = coalesce(new.sent_at, now());
  end if;
  return new;
end $$;
create trigger claims_require_poa before insert or update of status on public.claims
  for each row execute function public.enforce_poa_before_send();

-- ------------------------------------------------------------------ audit log (append only)
create table public.audit_log (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users (id) on delete cascade,
  action         text not null,            -- e.g. 'poa.granted', 'poa.revoked', 'claim.sent', 'document.deleted'
  subject_type   text,
  subject_id     uuid,
  meta           jsonb not null default '{}'::jsonb,
  at             timestamptz not null default now()
);
create index audit_log_user_idx on public.audit_log (user_id, at desc);

-- Rows can never be edited. They can be deleted only when the account itself is erased
-- (the cascade runs after the auth user is gone), so account deletion and GDPR erasure still work.
create or replace function public.audit_log_immutable() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if tg_op = 'DELETE' and not exists (select 1 from auth.users where id = old.user_id) then
    return old;
  end if;
  raise exception 'audit_log is append-only';
end $$;
create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

-- ------------------------------------------------------------------ row level security
alter table public.profiles            enable row level security;
alter table public.notification_prefs  enable row level security;
alter table public.connected_accounts  enable row level security;
alter table public.documents           enable row level security;
alter table public.line_items          enable row level security;
alter table public.poa_grants          enable row level security;
alter table public.claims              enable row level security;
alter table public.claim_events        enable row level security;
alter table public.audit_log           enable row level security;

create policy profiles_own           on public.profiles           for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy notification_prefs_own on public.notification_prefs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy connected_accounts_own on public.connected_accounts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy documents_own          on public.documents          for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy line_items_own         on public.line_items         for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy claims_own             on public.claims             for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy claim_events_own       on public.claim_events       for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Grants: the user can create and read them, and can only revoke (set revoked_at). Terms are never edited.
create policy poa_grants_select on public.poa_grants for select to authenticated using (auth.uid() = user_id);
create policy poa_grants_insert on public.poa_grants for insert to authenticated with check (auth.uid() = user_id);
create policy poa_grants_revoke on public.poa_grants for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.poa_grants_only_revoke() returns trigger
language plpgsql as $$
begin
  if (to_jsonb(new) - 'revoked_at') is distinct from (to_jsonb(old) - 'revoked_at') then
    raise exception 'A power of attorney can only be revoked, not edited';
  end if;
  return new;
end $$;
create trigger poa_grants_revoke_only before update on public.poa_grants
  for each row execute function public.poa_grants_only_revoke();

-- Audit log: read and append your own rows. No update or delete policy exists.
create policy audit_log_select on public.audit_log for select to authenticated using (auth.uid() = user_id);
create policy audit_log_insert on public.audit_log for insert to authenticated with check (auth.uid() = user_id);

-- ------------------------------------------------------------------ private storage for scanned files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- Objects live under "<user_id>/…", so the first folder segment must be the caller's id.
create policy documents_objects_select on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_objects_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_objects_delete on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
