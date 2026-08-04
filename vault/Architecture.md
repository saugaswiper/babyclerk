# Architecture

How BabyClerk is built and shipped. Reflects the current state; update in the same PR when it changes (see [[Principles]]).

## Stack
- **Frontend:** React + Vite (SPA). Routing via **HashRouter** (required for GitHub Pages — no server-side rewrites).
- **Styling:** hand-rolled CSS (`src/index.css` / component styles). Mobile-first.
- **State/persistence:** `localStorage` is the source of truth (see [[Data-Model]]). React state hydrates from it.
- **Offline/PWA:** `vite-plugin-pwa` (Workbox) — precache the app shell + assets, installable, works offline. This is load-bearing for ward use (see [[Principles]] "offline-first").
- **Backend (optional):** Supabase (Postgres + Auth) for sign-in and progress sync — see [[Sync-and-Accounts]].
- **AI:** Anthropic API called **client-side with the user's own key** (kept on device, never synced).

## Hosting & deploy
- **GitHub Pages**, served under a base path (`/babyclerk/`). Vite `base` is set accordingly; asset URLs and `emailRedirectTo` must respect `import.meta.env.BASE_URL`.
- Deploy = build (`npm run build`) → publish `dist/`. See [[Agent-Guide]] for the exact flow, branch, and Supabase project id.
- Repo: `saugaswiper/babyclerk`. Dev branch: `claude/clerkship-study-app-5ib66x`.

## Build / bundle
- `vite build` with **manualChunks** to keep chunks sane:
  - `montis` — the bundled flashcard deck (large, ~130 kB gz)
  - `anthropic` — the Anthropic SDK (~18 kB gz)
  - `vendor` — other `node_modules` (React, router, supabase-js, ~110 kB gz)
  - `index` — app code
- Deck content is **bundled into JS**, not `localStorage` — so it doesn't bloat the sync blob (only *progress* syncs). Important for [[Sync-and-Accounts]] payload size.

## App structure (high level)
- `src/pages/*` — route screens (Home, rotation views, StudyToday, Search, Settings, SignIn, IOCreate, …)
- `src/lib/*` — engine + services:
  - `settings.js` — API key, model, new-card limit, adaptive-pacing toggle (device prefs)
  - spaced-repetition engine (SM-2) + due-queue logic
  - `schedule.js` / `rotationPhase.js` — rotation blocks + exam dates, and the phase → daily new-card budget mapping every due count flows through (D12)
  - `supabaseClient.js`, `auth.jsx`, `sync.js`, `syncConfig.js` — accounts & sync
- Content lives in bundled data modules (decks, rotation notes, checklists).

## The content-merge model (important mental model)
There are **three layers** of content, merged at read time:
1. **Bundled** original/base content (ships in the JS).
2. **Imported** user content (in `localStorage`, private).
3. **Generated** AI/miss-derived cards (in `localStorage`).
The engine reads the union. Progress (SRS state, quiz bests, checklists) is keyed by card id across all layers. This is why sync only needs to carry *progress*, not content — see [[Data-Model]].

## Key constraints to respect
- **HashRouter + auth callback:** magic-link uses **PKCE** so the callback returns `?code=…` (query), not a `#hash` that would collide with HashRouter. Don't switch to implicit flow.
- **Base path:** anything constructing URLs must use `import.meta.env.BASE_URL`.
- **No secrets in the bundle** beyond the Supabase **publishable** (anon) key, which is safe by design (RLS enforces isolation).

## Tests
`npm test` (vitest, config in `vitest.config.js`) runs `src/**/*.test.js` in a node environment against the plain-JS engine modules — no react/PWA plugins involved. Covered today: `rotationPhase` (the phase ladder and its date boundaries) and `scheduler` (allowance → due counts → session ordering). The invariant these exist to protect: **new-card load may be scaled by the calendar, reviews never are.**

## Known scaling watch-items
- Image-occlusion cards embed data-URI images → can grow the sync blob. Watch payload size (see [[Sync-and-Accounts]]); may need to offload images to storage later.
- Progress blob is whole-object upsert today. Fine at current scale; revisit if it gets large (Phase 4 attempt log will add volume — see [[Roadmap]]).

Related: [[Data-Model]] · [[Sync-and-Accounts]] · [[Agent-Guide]]
