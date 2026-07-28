# Agent Guide

**Read this first.** How to work in this repo without breaking things or re-deriving context. Then steer by [[Roadmap]] / [[Backlog]] and respect [[Principles]].

## What this app is
BabyClerk — a clerkship study companion. Goal: make clerkship a breeze for any med student via great spaced-repetition + an AI that learns the student ([[Vision]]). Queen's-first, hybrid content, launchable-product ambition.

## Repo & deploy facts
- **Repo:** `saugaswiper/babyclerk`
- **Dev branch:** `claude/clerkship-study-app-5ib66x` (develop here; create if missing; never push elsewhere without permission).
- **Stack:** React + Vite SPA, **HashRouter**, PWA (Workbox), Supabase backend. See [[Architecture]].
- **Host:** GitHub Pages under base path `/babyclerk/`. Use `import.meta.env.BASE_URL` for any constructed URL.
- **Build:** `npm run build` — **must pass before deploy.** `npm run dev` for local.
- **Supabase project id:** `wyroabplbanturiersjm`. BabyClerk owns **only** the `progress` table — do not touch the other app's tables (`profiles`, `searches`, …). See [[Data-Model]].

## Workflow
1. Understand the task against [[Roadmap]] / [[Backlog]]. If it's a new decision, check [[Decisions]] first.
2. Make focused, reversible changes (see [[Principles]] "ship small, ship verified").
3. `npm run build` — green before you ship.
4. Commit with a clear message; push to the dev branch (`git push -u origin claude/clerkship-study-app-5ib66x`). Retry pushes with backoff on network errors.
5. **Update this vault in the same change** if you touched architecture, data model, features, or roadmap. The vault is code's memory — stale docs are worse than none.
6. Only open a PR if the user asks.

## Guardrails (do not violate)
- ⚠️ **Licensing:** never publicly host/bundle content we lack rights to. Import stays private. Read [[Licensing-and-Copyright]] before adding any deck. When unsure, ask.
- **Secrets:** the Anthropic API key and user secrets never sync, never hit our servers. Only the Supabase **publishable** key ships (RLS protects data). See [[Sync-and-Accounts]].
- **Merge, never clobber** sync data ([[Sync-and-Accounts]] D2).
- **Offline-first & guest-first:** never gate studying behind network or sign-in ([[Principles]]).
- **No school hardcoding** in engine code ([[Principles]], [[Personas]]).
- **Don't fake numbers** (mastery/readiness) — show real data + confidence ([[AI-Personalization-Engine]]).

## When to ask the user
- Any **open decision** (OD1–OD4 in [[Decisions]]) that blocks the task.
- Anything touching **licensing**, **spending money** (AI cost model), or **user data privacy**.
- Ambiguous product direction not resolved by [[Vision]]/[[Roadmap]].
Otherwise, act — don't stall on choices with an obvious default.

## Keeping the vault healthy
- One idea per note; link generously with `[[wikilinks]]`.
- [[Roadmap]] = phased plan; [[Features]] = detailed status; [[Backlog]] = next actions; [[Decisions]] = why. Keep them consistent.
- Start every non-trivial session by re-reading [[Home]] → [[Roadmap]] → [[Backlog]].

## Current frontier
Phase 3 (dates/schedule) → Phase 4 (attempt log) → Phase 5 (AI tutor). The unglamorous **attempt log is the highest-leverage next foundation**. See [[AI-Personalization-Engine]].

Related: [[Home]] · [[Roadmap]] · [[Backlog]] · [[Principles]]
