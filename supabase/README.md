# Supabase setup

Run the two migrations **in this order** in the Supabase dashboard. Both are plain SQL and safe to paste whole.

| Order | File | What it creates |
|---|---|---|
| 1 | `migrations/0001_init.sql` | profiles, notification preferences, connected accounts, documents, line items, power of attorney grants, claims, claim events, audit log, private `documents` bucket, row level security |
| 2 | `migrations/0002_smart_switch.sql` | providers, offers (affiliate fields, private), `offers_public` view, append-only `switch_events` |

## Steps

1. Create a project at supabase.com. Pick a region close to your users (Frankfurt or London for Israel and Europe).
2. **Project settings > API**: copy the Project URL, the `anon` key and the `service_role` key.
3. In the repo: `cp .env.example .env.local`, then paste the values into `.env.local` yourself (it is gitignored). Never put the `service_role` key in a `NEXT_PUBLIC_` variable, in client code, in chat or in a commit.
4. **SQL Editor > New query**: paste all of `0001_init.sql`, press Run. Wait for "Success". Then do the same with `0002_smart_switch.sql`. Run them once each and not out of order: 0002 refers to tables from 0001.
5. Check **Table editor**: you should see 12 tables in `public` plus the `offers_public` view, and **Storage** should list a private bucket named `documents`.
6. **Authentication > Providers**: enable Email (and Google if wanted). A `profiles` row and notification preferences are created automatically at sign-up.
7. `npm run check:env` tells you which variables are still empty (names only, no values).

Using the Supabase CLI instead: `supabase link --project-ref <ref>` then `supabase db push` runs the files in `migrations/` in order.

## Notes

- Re-running a migration on a project where it already ran fails with "already exists". That is expected; use a fresh project or `supabase db reset` for a clean start.
- `offers` has no read policy for app users on purpose (affiliate link, partner id and commission are private). Add and edit offers from the dashboard or with the service role.
- Everything is tested in memory with `npm run test:db` (35 checks) before you run it for real.
- Legal and privacy settings (data region, retention, who can read the audit log) need review before real user data goes in.
