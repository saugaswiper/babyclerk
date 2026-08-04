# Sync & Accounts

Optional cloud layer that lets progress follow a student across devices. **Never a gate** to studying (see [[Principles]] "guest-first").

## Auth
- **Supabase Auth**, email **magic link** (passwordless). Good fit for students; no password to manage.
- **PKCE flow** — the callback returns `?code=…` (query param), exchanged for a session. Chosen so it doesn't collide with **HashRouter** (see [[Architecture]]).
- `emailRedirectTo` must use `window.location.origin + import.meta.env.BASE_URL`.
- **Supabase dashboard setup required** (one-time, human task): add the deployed URL + localhost to **Auth → URL Configuration → Redirect URLs**, and ensure email signups are enabled. If magic links don't arrive/redirect, check this first.

## Sync model
- **Local-first, merge-not-clobber.** On sign-in: `pullMerge()` (fetch remote blob, merge into local card-by-card) → `pushLocal()` (upload merged result). See [[Data-Model]] for the blob shape.
- **Push triggers:** after initial sync, on a heartbeat, and on tab/app backgrounding (`visibilitychange`). A change-detection snapshot avoids redundant writes.
- **After a merge that changed local data**, the app reloads once so React reflects merged state (HashRouter preserves the route).

## Merge rules (per key type) — the heart of "never lose a session"
| Key | Rule |
|---|---|
| `srs:*` | per card, keep the entry reviewed more recently (more `reps`, then later `due`) |
| `custom:*` | union `flashcards`/`viva`/`mcqs` by card `id` |
| `checklist:*` | logical OR of ticks |
| `quizbest:*` | `max` |
| `newlog:*` | same date → max count; else latest date |
| `model`, `newLimit`, `adaptiveBudget` | keep this device's value (device pref) |
| default | keep local if present, else remote |

This guarantees studying offline on two devices then syncing loses nothing — it only ever *adds* progress. This is a [[Principles|core principle]]; don't weaken it for convenience.

## Security & privacy
- **RLS** isolates every user's row (`auth.uid() = user_id`). The shipped Supabase key is the **publishable/anon** key — safe by design because RLS does the enforcement.
- **API key and secrets never sync** — excluded from the blob at the source.
- Users own their data: export/delete is a [[Roadmap|Phase 6]] commitment (and a [[Principles|privacy]] requirement, especially once the Phase 4 attempt log exists).

## Watch-items
- **Blob size:** whole-object upsert. IO images (data-URIs) and the future attempt log will grow it — see [[Architecture]] and [[Data-Model]]. Plan: consider per-key sync or image offload if it gets heavy.
- **Conflict UX:** merge is automatic and safe today; if we ever surface conflicts, do it without blocking study.

Related: [[Data-Model]] · [[Architecture]] · [[Agent-Guide]]
