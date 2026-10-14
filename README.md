# SAVVY · Autonomous AI Financial Advocate

Premium FinTech web app (Hebrew RTL first) that finds overcharges in a household's bills and negotiates or files claims to get the money back.

**Status:** Modules 1 (design system + dashboard) and 2 (smart inbox, upload, camera scan, extracted data view), both on mock data.

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
│  │  ├─ claims/                   # Module 3 · Negotiation & Claims        (planned)
│  │  ├─ vault/                    # Module 4 · Security vault & PoA        (planned)
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
