# Roadmap

Phased path from "great study tool" (where we are) to "adaptive tutor that makes clerkship a breeze" (the [[Vision]]). Horizon: **real launchable product**.

Legend: ✅ done · 🔨 in progress · ⬜ planned. Keep statuses current — this note is the plan of record. Detailed per-feature status lives in [[Features]]; concrete next actions in [[Backlog]]; the 5 specced high-leverage proposals (forecast, ontology, onboarding, tutor, FSRS/pacing) in [[Improvement-Proposals]].

---

## Phase 0 — Foundation ✅ (shipped)
The daily study loop, done well.
- ✅ 7 rotations with notes + checklists (Queen's-flavored) — see [[Rotations]]
- ✅ ~1,970 flashcards (Montis deck bundled) + viva drills + MCQ quizzes
- ✅ SM-2 spaced repetition with a **daily new-card budget** (anti-overwhelm)
- ✅ Cross-rotation "Study Due" queue
- ✅ Full-text search across all content
- ✅ PWA: offline, installable, app-like — see [[Architecture]]
- ✅ Backup / restore (JSON export-import)

## Phase 1 — Accounts & sync ✅ (shipped)
Progress that follows the student across devices.
- ✅ Optional email (magic-link) sign-in via Supabase
- ✅ Cloud sync of all progress as a per-user JSON blob, **merge-not-clobber**
- ✅ Row-level security; API key never synced
- See [[Sync-and-Accounts]] · [[Data-Model]]

## Phase 2 — Content authoring & extension 🔨
Make the content great and let students extend it. (Hybrid model — see [[Content-Strategy]].)
- ✅ Import: text / CSV / cloze / JSON / file
- ✅ AI card generation (Anthropic API, user's key)
- ✅ Image-occlusion creator
- ✅ Misses → cards (turn wrong answers into review)
- ⬜ **Original high-yield core** per rotation, verified & traceable (replace reliance on bundled third-party deck for the shippable baseline) — see [[Licensing-and-Copyright]]
- ⬜ Deck manager: enable/disable, tag, see counts per source
- ⬜ Cloze-native card type first-class in the engine (not just import)

## Phase 3 — Date & schedule awareness 🔨 (in progress)
The app understands *where the student is in time*.
- ✅ **Rotation schedule**: user enters rotation blocks + start/end dates (`/schedule`)
- ✅ **Exam dates** per rotation + MCCQE
- ✅ Home screen reprioritizes to the **current rotation** (floats to top, "On rotation now" badge)
- ✅ **Exam countdowns**: soonest-exam banner + per-tile exam pills, color-coded by proximity
- ✅ **School schedule presets**: `/schedule` can prefill rotation dates from a program's schedule — first one shipped: Queen's MEDS 2028 (Streams 1–3), de-identified cohort dates only. See [[Resources/Curriculum/Queens-MEDS2028-Schedules]].
- 🔨 **Intensity ramp**: proximity messaging shipped (nudges by days-out); auto-adjusting new-card load is Phase 5
- ⬜ "What to expect" per rotation/exam given the date (static first, AI later)
- ✅ Realistic daily plan to "cover it all before exam day" — the readiness forecast states the required cards/day and can set it (Phase 5 entry below)
- Feeds directly into [[AI-Personalization-Engine]]. Schedule stored as `babyclerk:schedule`, synced (latest-edit-wins) — see [[Data-Model]].

## Phase 4 — Performance telemetry (the data foundation) 🔨 (core shipped)
You can't personalize what you don't measure. **Prerequisite for Phase 5.**
- ✅ **Attempt log**: every flashcard + MCQ answer records {id, topic, kind, correct, grade, latency, ts, rotation} — `babyclerk:attempts`, capped, synced (union by id). See [[Data-Model]].
- ✅ Per-topic + per-rotation accuracy rollups (`summarize`, `weakestTopics`)
- ✅ **Insight dashboard** (`/progress`): overall accuracy, weakest topics (min-sample gated), accuracy by rotation; weak-spots teaser on home
- ✅ Privacy-first: user's own data, synced to their row, **clear-history control** in Settings — see [[Principles]]
- 🔨 Uses each card's existing `topic` string as the interim taxonomy. **Normalized cross-rotation ontology still open (OD3)** — see [[Decisions]].
- ✅ Mastery *model* (`src/lib/mastery.js`): recency-weighted accuracy, confidence from sample size, up/down trend detection — drives both the `/progress` insights and the prioritizer. Explainable (every number traces to attempts).

## Phase 5 — Adaptive AI tutor 🔨 (the moat — see [[AI-Personalization-Engine]])
The system that learns *you*.
- 🔨 **Weak-area targeting**: the "Study due" queue now **orders** cards so weak topics + imminent-exam rotations come first (reorder only — reviews still precede new cards; timing untouched). Next: auto-generate related questions for the weakest topic.
- 🔨 **AI generation** (user's key — D10): on-demand flashcards/cloze/viva/MCQs, grounded generation from pasted source, AND **"Drill my weak spot"** — one tap on `/progress` generates 5 fresh cards on the mastery model's weakest topic and adds them to the deck (closes measure→model→generate→measure). Next: exam-readiness forecast (Layer 5).
- ⬜ **Adaptive pacing**: new-card load & mix auto-tune to performance + time available
- 🔨 **AI tutor**: ✅ **explain a miss** (grounded on the card itself — `src/lib/tutor.js`), ✅ generate practice from a fumbled topic ("Drill my weak spot"). Remaining: ⬜ "quiz me on X" conversational drilling that logs its answers back into the attempt log.
- ✅ **Exam forecast** (Layer 5, readiness half): given the exam date + your review history, `src/lib/forecast.js` computes "% ready today", whether your daily pace covers the deck in time, and the cards/day that closes the gap. No AI, offline, explainable. Remaining: the "what to expect on this rotation/exam" content half.
- ⬜ Feedback loop: generated questions flow back into the attempt log and mastery model

## Phase 6 — Launch, scale & polish ⬜
Turn it into a product others rely on.
- ✅ **First-run onboarding** (`src/pages/Welcome.jsx`, route `/welcome`): stream → pace → ready, ~60 seconds to a personalized, date-aware home screen. Entry is gated by `needsOnboarding()` (`src/lib/onboarding.js`): only fires on `/` for someone with no `onboarded` flag, no schedule, and no attempts — so existing users and deep links are never hijacked. The school step is where a second school's preset plugs in (see multi-school below).
- ⬜ Multi-school support: school profiles as data (Queen's is the first profile) — see [[Personas]] P3
- ⬜ Reliability: error handling, sync conflict UX, empty states, accessibility pass
- ⬜ Cost model: keep it viable (AI usage via user key vs. hosted tier — open question, see [[Backlog]])
- ⬜ Distribution: shareable link, PWA install prompts, maybe app-store wrapper
- ⬜ Growth loops: deck sharing, class cohorts (opt-in)
- ⬜ Analytics against the [[Vision]] success metrics

---

## Sequencing logic (why this order)
- Phases 3 → 4 → 5 are a **dependency chain**: date-awareness and telemetry are the substrate the AI tutor needs. Building the tutor before the attempt log exists would be guessing. **Phase 4 is the highest-leverage unglamorous work.**
- Phase 2 original content and Phase 6 multi-school both hinge on [[Licensing-and-Copyright]] discipline — do them right or they block launch.

## Open questions (resolve via [[Decisions]] / ask the user)
- AI cost: user-supplied key only, or a hosted allowance? Affects Phase 5/6 economics.
- How much original content is "enough" to ship a compelling out-of-box experience?
- Topic ontology: adopt an existing med-ed taxonomy or roll our own? (Affects Phase 4.)

Related: [[Vision]] · [[AI-Personalization-Engine]] · [[Backlog]] · [[Features]]
