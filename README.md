# ONCampus

An AI-powered companion for college freshers — personalized roadmaps, mentor
matching, and a smart expense tracker, in one dashboard.

This is a **frontend skeleton**: every page is wired up with real routing,
components, and mock data so the whole product flow can be clicked through
end to end. The two integration points that need real credentials —
Supabase and the Claude API — are isolated behind small, clearly marked
modules so you can wire them up without touching the UI.

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Auth / DB:** Supabase (stubbed — see below)
- **AI:** Claude API via `@anthropic-ai/sdk` (stubbed — see below)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in real keys
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  page.tsx                 Landing page
  (auth)/login, signup      Auth screens (Supabase not yet wired)
  onboarding/               6-step AI onboarding flow
  dashboard/
    layout.tsx              Sidebar + bottom nav shell
    page.tsx                Main dashboard
    assistant/               AI chat, calls /api/chat
    mentors/                 Mentor & Alumni Connect
    roadmap/                 Full roadmap timeline
    expenses/                AI Expense Tracker (12 sections)
    profile/                 Student profile
  api/chat/route.ts         Server route that calls Claude via lib/claude.ts

components/
  ui/                       Button, Card, Badge, ProgressBar, ProgressRing…
  landing/                  Landing page sections
  dashboard/                Sidebar, TopBar, BottomNav
  expenses/                 Expense tracker sections

lib/
  supabase/client.ts         Browser Supabase client
  supabase/server.ts         Server Supabase client
  claude.ts                  Claude API wrapper, grounded in student profile
  mock-data.ts                Demo data powering every screen right now
  utils.ts

types/index.ts               Shared TypeScript types
```

## Wiring up real data

1. **Supabase** — create a project, add the URL/anon key to `.env.local`,
   then replace the `console.log` calls in `app/(auth)/login/page.tsx` and
   `app/(auth)/signup/page.tsx` with real `supabase.auth` calls. Swap
   `lib/mock-data.ts` reads for Supabase table queries as you build out the
   schema (suggested tables: `profiles`, `roadmap_items`, `mentors`,
   `transactions`, `sms_transactions`).
2. **Claude API** — add `ANTHROPIC_API_KEY` to `.env.local`. The
   `/api/chat` route and `lib/claude.ts` are already wired to answer using
   the student's profile instead of generic responses — extend
   `buildSystemPrompt` as you add real roadmap/quiz generation.
3. **SMS parsing (mobile, future)** — the Auto SMS Detection section reads
   from `smsDetected` in `lib/mock-data.ts`. Swap this for parsed SMS data
   once the mobile app exists; the accept/edit/ignore UI already works
   against arbitrary transaction data.

## Design system

Light, blue-to-cyan gradient, glassmorphism cards, 16–22px radii — tokens
live in `tailwind.config.ts` (colors, gradients, shadows) and
`app/globals.css` (base styles, `.glass-card`, `.btn-gradient`). Dark mode
is scaffolded via the `.dark` class but not yet wired to a toggle.
