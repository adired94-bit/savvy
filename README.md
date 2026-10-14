# SAVVY · Autonomous AI Financial Advocate

Premium FinTech web app (Hebrew RTL first) that finds overcharges in a household's bills and negotiates or files claims to get the money back.

**Status:** Modules 1 (design system + dashboard), 2 (smart inbox), 3 (claims engine) and 4 (vault, power of attorney, settings), all on mock data.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · Zustand · TanStack Query.
Planned: Supabase (Auth, Postgres, RLS, Storage) and the Claude API (current Sonnet model) for parsing, anomaly detection and letter drafting.

## Design system

All tokens live in `src/app/globals.css` inside `@theme` (Tailwind v4's config). Each token becomes a utility:
`bg-obsidian`, `bg-card`, `text-money`, `text-ink-muted`, `border-line`, `shadow-glow`, `rounded-card`, plus custom utilities `glass`, `text-money-gradient`, `num`.

RTL rules:
- `<html dir>` and `lang` come from `src/config/market.ts` (Israel now; US/EU are pre-defined).
- Use logical utilities only: `ms-/me-/ps-/pe-/start-/end-/border-s/text-start`. Never `ml-/mr-/left-/right-`.
- Wrap numbers, currency and Latin brand names in `.num` so they stay LTR inside Hebrew text.
- Directional icons flip with `ltr:rotate-180` (or `rtl:` the other way).
- Currency, dates and relative time use `Intl` with the market locale (`src/lib/format.ts`).

## Folder structure

```
savvy/
├─ src/
│  ├─ app/                         # Next.js App Router
│  │  ├─ layout.tsx                # <html dir/lang>, fonts, providers, AppShell
│  │  ├─ globals.css               # Design system tokens (@theme) + utilities
│  │  ├─ page.tsx                  # Dashboard (Module 1)
│  │  ├─ inbox/                    # Module 2 · Smart Inbox and OCR (built, mock extraction)
│  │  ├─ claims/                   # Module 3 · Negotiation and Claims (built, mock)
│  │  ├─ vault/                    # Module 4 · Vault and power of attorney (built, mock)
│  │  ├─ settings/                 # Profile, connections, notifications (built, mock)
│  │  └─ api/                      # Route handlers: AI, webhooks, Gmail/Outlook OAuth (planned)
│  ├─ components/
│  │  ├─ ui/                       # Primitives: GlassCard, Button, Badge, ProgressBar, AnimatedCounter
│  │  ├─ layout/                   # AppShell, Sidebar, MobileNav, TopBar, Logo
│  │  ├─ dashboard/                # Hero, category donut, trend, negotiations, anomaly card, activity
│  │  └─ providers/                # React Query provider
│  ├─ config/                      # market (locale/currency/dir/law), categories, navigation
│  ├─ hooks/                       # React Query hooks (useDashboard)
│  ├─ lib/
│  │  ├─ api/                      # Data access boundary (mock now, Supabase later)
│  │  ├─ mock/                     # Placeholder data
│  │  ├─ format.ts                 # Intl currency / percent / relative time
│  │  └─ utils.ts                  # cn()
│  ├─ store/                       # Zustand UI state
│  ├─ types/                       # Domain types (finance.ts)
│  └─ server/                      # (planned) server-only code
│     ├─ ai/                       #   Claude prompts: bill parsing, anomaly detection, letters
│     ├─ legal/                    #   Consumer-protection rule packs per market (IL first)
│     ├─ providers/                #   Provider adapters: telecom, insurance, banks, cards
│     └─ crypto/                   #   Client-side encryption helpers for the vault
├─ supabase/                       # (planned) migrations, RLS policies, seed
└─ docs/screenshots/
```

## Product voice

Short, plain Hebrew at eye level: "חסכנו לך ₪120 השבוע", not "זוהתה אנומליה". No sparkle icons, no decorative gradients. Money figures are the boldest element on screen (Inter, tabular, LTR-isolated via `.num`).

## Module 2 notes

Extraction is mocked in `src/lib/api/inbox.ts` (`extractDocument`). The real version posts the file to a server route that sends it to the Claude API (vision) and returns line items. Gmail/Outlook "connect" buttons are placeholders for OAuth.

## Module 3 notes (claims engine)

- `src/lib/legal/il.ts`: the library of Israeli consumer-law grounds the engine may cite. Letters only ever cite grounds from this file.
- `src/lib/claims/letter.ts`: `draftLetter(case)`, currently a deterministic template. Production keeps the signature and has Claude phrase the letter from the case facts and the allowed grounds.
- `src/hooks/use-claims.ts`: one-tap approval (`useApproveClaim`) sends the letter (mock) and moves the case through the timeline: sent, in progress, credited.
- Letters are always previewable before approval, and nothing is sent without the user's tap.

**Legal review required:** the grounds and letter text are a product draft, not legal advice. Section numbers are filled in only where well established. An Israeli consumer-law attorney must review the library and templates before any real letter is sent.

## Module 4 notes (vault, power of attorney, settings)

- `/vault`: sign a limited digital power of attorney in three steps (what you allow, SMS verification, drawn signature), manage what the agent may do, revoke with one tap, see the audit log.
- Hard limits are fixed and not toggleable (`NEVER_DO` in `src/lib/vault/poa.ts`): no moving money, no bank passwords, no new contracts, no waiving rights, no court filings.
- `/settings`: profile, connected accounts (read-only), notification preferences, data export and deletion.
- State lives in `src/store/vault-store.ts` (Zustand, in memory for now).
- **Not real yet:** the encryption panel is a UI explainer; SMS verification accepts any 6-digit code; the signature stays in memory. Real client-side encryption, identity verification and signature storage arrive with Supabase.
- **Legal review required:** the power of attorney wording, the validity of a drawn digital signature and the identity checks must be reviewed by an Israeli attorney before launch.
