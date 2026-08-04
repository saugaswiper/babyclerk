# Data Model

Where every piece of state lives. **`localStorage` is the source of truth; Supabase mirrors it** (see [[Principles]]). All keys are namespaced `babyclerk:`.

## localStorage keys
| Key pattern | Contents | Synced? |
|---|---|---|
| `babyclerk:apiKey` | Anthropic API key | ❌ **never** |
| `babyclerk:model` | selected Claude model (device pref) | ✅ (keep-local on conflict) |
| `babyclerk:newLimit` | daily new-card budget, per rotation at full pace (device pref) | ✅ (keep-local on conflict) |
| `babyclerk:adaptiveBudget` | `'1'`/`'0'` — scale that budget by rotation phase (device pref, default on) | ✅ (keep-local on conflict) |
| `babyclerk:srs:<deckOrScope>` | SM-2 state per card `{ id: {due, interval, ease, reps, …} }` | ✅ merge |
| `babyclerk:custom:<scope>` | imported/AI/IO/miss cards `{flashcards, viva, mcqs}` | ✅ union merge |
| `babyclerk:quizbest:<id>` | best quiz score | ✅ max |
| `babyclerk:checklist:<id>` | rotation checklist ticks `{idx: bool}` | ✅ OR merge |
| `babyclerk:newlog:<scope>` | daily new-card intro log `{date, count}` | ✅ latest/max |
| `babyclerk:schedule` | rotation blocks + exam dates `{updatedAt, mccqe, rotations:{[id]:{start,end,exam}}}` | ✅ latest-edit-wins |
| `babyclerk:attempts` | per-answer log `[{id, ts, rotation, kind, cardId, topic, correct, grade, latencyMs}]` (capped 4000) | ✅ union by id, capped |

> Values are stored as raw strings (some JSON, some plain). Sync treats them as opaque strings except where a typed merge is defined — see [[Sync-and-Accounts]].

## Card types
- **Plain flashcard** — front/back.
- **Viva** — prompt + model answer (oral-exam style).
- **MCQ** — stem, options, answer, explanation.
- **Cloze** — `{{c1::hidden}}` deletions (import-supported; first-class engine support planned, see [[Roadmap]] Phase 2).
- **Image occlusion (IO)** — base image + masked regions; each region ~a card. Images are data-URIs today (watch payload — see [[Architecture]]).
- **Miss-derived** — auto-created from wrong answers.

## SRS state (SM-2)
Per card: `due` (date), `interval` (days), `ease` (factor), `reps` (successful reps), plus lapse tracking. New cards are gated by the **daily new-card budget** (`newLimit` + `newlog`) so the queue never explodes (see [[Principles]] "trust the schedule"). That budget is then scaled per rotation by its **schedule phase** (`src/lib/rotationPhase.js`, D12) — reviews are never scaled, only the new-card tap. Cross-rotation due items feed the "Study Due" queue.

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

## Attempt log (Phase 4 — shipped)
The **per-answer event log** that powers [[AI-Personalization-Engine]] now exists (`src/lib/attempts.js`, key `babyclerk:attempts`):
```
attempt { id, ts, rotation, kind, cardId, topic, correct, grade, latencyMs }
```
Append-only, local-first, synced (union-by-id, capped at 4000), user-clearable (Settings). `summarize()` and `weakestTopics()` roll up accuracy by rotation and rotation+topic. Logged from Flashcards (grade → correct = not "again") and Quiz (MCQ correctness).

On top of the log, `src/lib/mastery.js` computes a per-topic **mastery model** — recency-weighted accuracy, confidence (from sample size), and trend — consumed by the `/progress` insights and the study-queue prioritizer.

**Still open:** a normalized **topic ontology** — today we aggregate on each card's free-text `topic` string, which works per-rotation but won't cluster the same concept across rotations. That's OD3 in [[Decisions]] and the next content-side step for sharper weak-area targeting.

Related: [[Sync-and-Accounts]] · [[Architecture]] · [[AI-Personalization-Engine]]
