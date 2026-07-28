# Data Model

Where every piece of state lives. **`localStorage` is the source of truth; Supabase mirrors it** (see [[Principles]]). All keys are namespaced `babyclerk:`.

## localStorage keys
| Key pattern | Contents | Synced? |
|---|---|---|
| `babyclerk:apiKey` | Anthropic API key | ❌ **never** |
| `babyclerk:model` | selected Claude model (device pref) | ✅ (keep-local on conflict) |
| `babyclerk:newLimit` | daily new-card budget (device pref) | ✅ (keep-local on conflict) |
| `babyclerk:srs:<deckOrScope>` | SM-2 state per card `{ id: {due, interval, ease, reps, …} }` | ✅ merge |
| `babyclerk:custom:<scope>` | imported/AI/IO/miss cards `{flashcards, viva, mcqs}` | ✅ union merge |
| `babyclerk:quizbest:<id>` | best quiz score | ✅ max |
| `babyclerk:checklist:<id>` | rotation checklist ticks `{idx: bool}` | ✅ OR merge |
| `babyclerk:newlog:<scope>` | daily new-card intro log `{date, count}` | ✅ latest/max |

> Values are stored as raw strings (some JSON, some plain). Sync treats them as opaque strings except where a typed merge is defined — see [[Sync-and-Accounts]].

## Card types
- **Plain flashcard** — front/back.
- **Viva** — prompt + model answer (oral-exam style).
- **MCQ** — stem, options, answer, explanation.
- **Cloze** — `{{c1::hidden}}` deletions (import-supported; first-class engine support planned, see [[Roadmap]] Phase 2).
- **Image occlusion (IO)** — base image + masked regions; each region ~a card. Images are data-URIs today (watch payload — see [[Architecture]]).
- **Miss-derived** — auto-created from wrong answers.

## SRS state (SM-2)
Per card: `due` (date), `interval` (days), `ease` (factor), `reps` (successful reps), plus lapse tracking. New cards are gated by the **daily new-card budget** (`newLimit` + `newlog`) so the queue never explodes (see [[Principles]] "trust the schedule"). Cross-rotation due items feed the "Study Due" queue.

## Supabase: `progress` table
```
progress(
  user_id    uuid primary key references auth.users on delete cascade,
  data       jsonb not null default '{}',   -- the synced blob (map of stripped key -> raw value)
  updated_at timestamptz not null default now()
)
```
- **RLS enabled**; policies restrict select/insert/update to `auth.uid() = user_id`. A user can only ever see their own row.
- The blob = all `babyclerk:*` keys **except `apiKey`**, keyed without the prefix.
- This project also hosts unrelated tables from another app (`profiles`, `searches`, …). **BabyClerk only owns `progress`.** Do not touch the others. A signup trigger (`handle_new_user`) copies id+email into `profiles` harmlessly.

## Planned: attempt log (Phase 4 — see [[Roadmap]])
To power [[AI-Personalization-Engine]] we'll add a **per-answer event log** (not just aggregate SRS state):
```
attempt { id, card_id, topic, kind, correct, latency_ms, ts, rotation }
```
Design goals: append-only, local-first, synced, user-exportable/deletable. Plus a **topic ontology** tagging all content so accuracy can roll up per topic/system. This is the substrate for weak-area targeting.

Related: [[Sync-and-Accounts]] · [[Architecture]] · [[AI-Personalization-Engine]]
