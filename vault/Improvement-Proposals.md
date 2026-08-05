# Improvement Proposals — the 5 highest-leverage moves

Written 2026-08-05 after a deep review of the shipped app. This note is **for future agents**: each proposal explains *what*, *why it matters more than the alternatives*, *how to build it in this codebase*, and *how you'll know it worked*. Read [[Mission]] first, then pick from here (in rough priority order) unless the user directs otherwise.

**Where the app stands today:** the full adaptive loop exists — attempt log → mastery model → prioritized queue → AI drill generation ([[AI-Personalization-Engine]] layers 1–4). Schedule/exam awareness is live with Queen's MEDS 2028 presets. What's missing is not more features around the loop — it's the pieces that make the loop *trustworthy, legible, and effortless*: a real forecast, a real ontology, a real first hour, a real tutor, and a scheduler that adapts instead of just ordering.

---

## P1 · Exam Readiness Forecast — "Will I be ready?" (Engine Layer 5) — ✅ SHIPPED

> **Status: shipped.** `src/lib/forecast.js` + `src/components/Readiness.jsx`, surfaced on `/r/:id`, the home exam banner, and `/progress`. Two notes for whoever picks this up next: the verdict is gated on **pace only** (`readinessAtTarget` assumes you stop studying, so gating on it flags everyone), and `isWorthShowing()` hides untouched decks whose only target is a distant MCCQE. Remaining Layer 5 work is the *content* half — "what to expect on this rotation/exam". See [[AI-Personalization-Engine]] Layer 5 for the model. Original proposal below.


**What.** A per-rotation readiness score and a concrete daily plan: given the exam date, the deck size, current mastery, and the daily budget, compute (a) *coverage* — what fraction of the deck you'll have seen at least once by exam day at current pace, (b) *retention* — projected recall of seen material using each card's SRS state, and (c) the gap between the two and today's date. Surface it as one honest sentence + a bar on `/r/:id` and the home exam banner: *"On pace to cover 82% by exam day — add 4 cards/day to close it"*.

**Why this is #1.** It's the single question every clerk actually asks, and it's the promised capstone of the engine ([[AI-Personalization-Engine]] Layer 5, [[Roadmap]] Phase 5). Everything it needs already exists: `srs:{rotationId}` state, `examDaysFor()` in `src/lib/schedule.js`, deck counts, the daily new-card budget in `src/lib/scheduler.js`, and the mastery model. It's pure arithmetic — **no AI call, no new data, works offline**, fully explainable ([[Principles]]). It converts the exam countdown (anxiety) into a plan (agency) — that *is* the "clerkship is a breeze" mission.

**How.**
- New `src/lib/forecast.js`: `forecastRotation(rotationId, schedule)` → `{ coveragePct, projectedCoverage, onPace, cardsPerDayNeeded, weakTopicsCount, daysLeft }`. Coverage = seen cards / deck; projection = seen + (dailyNewBudget × daysLeft), capped at deck size. Blend in `masteryLookup` for a weighted-readiness variant later — ship the simple version first.
- UI: readiness strip on the rotation page + one line inside the home exam banner. Colour with the existing `examColor` scale.
- Vault: mark Layer 5 🔨→✅ in [[AI-Personalization-Engine]] and [[Roadmap]] when shipped.

**Success looks like:** a student 14 days from their OBGYN exam opens the app and knows, without thinking, whether today's default pace is enough — and gets a one-tap "raise my daily budget for this rotation" fix.

---

## P2 · Topic Ontology — the knowledge graph under the mastery model (resolves OD3) — ✅ SHIPPED

> **Status: shipped** — `src/data/ontology.js` (the dictionary) + `src/lib/ontology.js` (the resolver).
>
> **⚠️ The proposal below was written on a wrong premise. Read this instead.** I assumed the problem was *fragmentation* — that "Pre-eclampsia", "pre-eclampsia/HELLP" and "Hypertension in pregnancy" were splitting one concept into three weak spots. Measuring the actual corpus showed the opposite: there are only **61 distinct topic strings across 1,929 cards**, and they're *lecture-section labels*, not concepts — 190 cards say "Urology", 172 say "Peds", 147 say "Psychiatry", 133 say "Toronto Notes". The real failure was that the weak-area dashboard could only ever tell a student **"you're weak at… Peds."**
>
> So the shipped design is a **classifier**, not a merge table:
> - `TOPIC_ALIASES` normalizes the topic strings that *are* concepts and merges genuine duplicates ("Pain Meds" / "Pain Medication Dosing" / "Acute and Chronic Pain" → `pain-management`; "ECG Bootcamp" / "ECG Review" → `ecg`).
> - `OPAQUE_TOPICS` / `BROAD_TOPICS` mark labels that carry no signal or too little of it.
> - `CONCEPTS` (~110 entries) are matched by **word-boundary keyword search against the card's own text**, which splits the mega-buckets. Deterministic, offline, no API cost — important, because AI-classifying 1,929 cards would spend the user's money on a build-time job.
> - **Measured result: 68% of cards resolve to a real concept, 24% pass through as their topic, 7.8% unclassified — 158 distinct concepts in use, up from 61 strings.** Re-run the coverage check after editing the dictionary.
>
> **Where the concept is stored matters.** It's computed at **write time** in `logAttempt` (which now takes `card`) and saved on the attempt as `concept`/`conceptId`. The attempt log is append-only history and cards aren't available when reading it back, so read-time normalization was impossible. Pre-ontology attempts have no concept and fall back to `topic` — `topicKeyOf()` in `attempts.js` is the single place that decision lives.
>
> **Two consistency traps, both hit and fixed:** the prioritizer (`orderForFocus`) was looking up mastery by `card.topic` while mastery had become concept-keyed — it must call `conceptFor()` the same way. And `StudyToday`, the app's *primary* study path, turned out never to have called `logAttempt` at all, so cross-rotation sessions produced no telemetry whatsoever. Both fixed in the same change.
>
> Also shipped: **cross-rotation weakness** on `/progress` (`crossRotationWeakness()`) — concepts you're failing in more than one block, which is the payoff the ontology existed for. Original proposal below.


**What.** Replace free-text `topic` strings with a curated, normalized concept list (~150–250 clerkship concepts, each with `id`, `label`, `rotations: []`, `aliases: []`, optional MCC presentation mapping). Existing card topics map onto it via an alias table; unmapped topics degrade gracefully to today's behavior.

**Why it's significant.** The ontology is the **ceiling on every downstream feature**. Today "Pre-eclampsia", "pre‑eclampsia/HELLP", and "Hypertension in pregnancy" are three different weak spots — the mastery signal fragments, so `weakTopics` under-ranks the student's true weakest concept, and Drill generates cards for a splinter of it. A normalized layer makes weak-area targeting sharp, enables **cross-rotation insight** ("you're weak on fluids & electrolytes *everywhere*"), gives grounded AI generation a stable vocabulary, and is the prerequisite for mapping content to MCCQE objectives (the exam students actually fear). This is the open decision OD3 in [[Decisions]] — the longest-standing acknowledged gap.

**How.**
- `src/data/ontology.js`: the concept list + alias map. Build it per-rotation from the existing decks' topic strings (script it: dump distinct topics, cluster, hand-curate). Roll our own, MCC-informed — adopting a full external taxonomy is overkill for ~250 concepts (proposed resolution to OD3; confirm with user).
- `src/lib/ontology.js`: `normalizeTopic(raw) → conceptId | raw`. Apply at **read time** in `summarize`/`topicMastery` (never rewrite the attempt log — it's synced history).
- `/progress` groups by concept; a cross-rotation weak concept links to every rotation that touches it.
- Vault: record the decision as D12; update [[Data-Model]] and [[AI-Personalization-Engine]].

**Success looks like:** the weak-topic list gets *shorter and truer* — concepts, not string variants — and Drill's generated cards visibly hit the actual weakness.

---

## P3 · First-Hour Experience — onboarding that reaches "aha" in 60 seconds — ✅ SHIPPED (part 1)

> **Status: the onboarding flow is shipped** — `src/pages/Welcome.jsx` + `src/lib/onboarding.js`, route `/welcome`, re-runnable from Settings. The guard (`needsOnboarding()`) deliberately requires *all three* of: no `onboarded` flag, no schedule, no attempts — pre-onboarding users must never be interrupted. **Still open: the systematic empty-state pass** described below (each empty state should sell the feature and offer the one action that unlocks it), and the "setup checklist" card on home. Original proposal below.


**What.** A one-time, skippable first-run flow (3 steps, one screen each): **(1)** Who are you — Queen's MEDS 2028 stream picker (reusing the `/schedule` stream cards) or "I'll set dates later"; **(2)** Pace — daily new-card budget with a recommendation; **(3)** Land on a home screen that immediately shows *their* current rotation on top, *their* exam countdown, and a "Start today's 10 minutes" button. Plus **empty-state repair** throughout: `/progress` before data, Drill without an API key, home without a schedule should each *sell the feature and offer the one action that unlocks it* (some of this exists; make it systematic).

**Why it's significant.** The adaptive engine is invisible until a student has a schedule and ~20 answers logged. Right now the app's opening move is a generic rotation grid — the "date-aware, learns-you" thesis (the actual moat) doesn't show up until the user stumbles into `/schedule` and `/progress`. For a **real launchable product** ([[Vision]]) spreading classmate-to-classmate, the first hour *is* the product. This is [[Roadmap]] Phase 6's top item pulled forward, because every classmate who bounces before setting a schedule never sees Phases 3–5 at all.

**How.**
- `src/pages/Welcome.jsx` + `babyclerk:onboarded` flag (localStorage, synced like other prefs). Route guard in `App.jsx`: first visit → `/welcome`.
- Reuse, don't rebuild: stream cards from `Schedule.jsx`, budget control from Settings. Keep it under ~150 lines.
- Add a small "setup checklist" card on home until schedule + first session + (optional) sign-in are done — then it disappears forever.
- Extend later into multi-school: the school picker is where a second school's preset plugs in ([[Personas]] P3).

**Success looks like:** a classmate given the link reaches a personalized, date-aware home screen — with their real rotation on top — in under a minute, without instructions.

---

## P4 · AI Tutor Moments — "explain my miss" at the point of failure — ✅ SHIPPED (part 1)

> **Status: "Explain this" is shipped** — `src/lib/tutor.js` + `src/components/ExplainMiss.jsx`, wired into `Quiz` (on a wrong answer) and `Flashcards` (on any revealed card). Design notes worth keeping: the prompt is grounded **only** on that card's own text, `effort: 'low'` with `max_tokens: 1024` keeps it cheap, image-occlusion cards render no button (nothing to ground on), and cloze cards flatten via `clozeFront`/`clozeReveal`. **Still open: "Quiz me on X"** — the conversational drill that logs answers back into the attempt log (`kind: 'tutor'`), which is what makes the tutor feed the mastery model rather than just talk. Original proposal below.


**What.** Bring AI into the *moment of learning*, not just deck-building. Two moves: **(1) Explain my miss** — after a wrong MCQ/flashcard answer, one tap streams a short, targeted explanation of *why the right answer is right and why your choice was wrong*, grounded in the card's own content (stem/options/explanation/back) so it stays factual; **(2) Quiz me on X** — a conversational rapid-fire drill on any topic from `/progress` or a rotation page, where each response is judged, logged to the attempt log, and feeds the mastery model.

**Why it's significant.** This is the difference between an app that *schedules* studying and one that *teaches* — the "adaptive tutor" of the [[Vision]], listed at [[Roadmap]] Phase 5 and [[Backlog]] "Later". The infrastructure cost is small because the hard parts are done: BYO key (D10), `generateItems`' structured-output pattern in `src/lib/generate.js`, and `logAttempt` for closing the loop. Grounding on the card's own text keeps hallucination risk low and sidesteps content-licensing issues ([[Licensing-and-Copyright]] — explanations of your own miss are transformative, personal use). Crucially, the misses a student gets *explained* are exactly the attempts the mastery model already flags — the tutor and the telemetry reinforce each other.

**How.**
- `src/lib/tutor.js`: `explainMiss({ card, chosen, apiKey, model })` — single non-streamed call first (streaming is polish), strict prompt: "use only the material provided; ≤120 words; name the discriminating feature."
- UI: an "Explain this" ghost button in the quiz/flashcard answer states, gated on `getApiKey()` like Drill; result renders in the existing `.explain` box style.
- Quiz-me: reuse the Drill pipeline but hold generated items in session state, log each answer with `logAttempt` (tag `kind: 'tutor'`), and offer "keep these as cards" at the end (feeds Phase 5's feedback-loop bullet).
- Watch: per-answer API calls are the user's money — never auto-fire; always a deliberate tap.

**Success looks like:** a wrong answer stops being a dead end. Miss → understand → re-drill happens inside one session, and the attempt log shows the topic trending ↑ afterward.

---

## P5 · Adaptive Scheduler — FSRS-grade memory model + load that responds to the calendar — ✅ SHIPPED

> **Status: shipped.** `src/lib/fsrs.js` (FSRS-4.5, no dependency), `src/lib/pacing.js`, Settings toggle Adaptive/Classic defaulting to Adaptive. Hard-won notes for future agents:
>
> - **Do not mix FSRS versions.** The first implementation paired FSRS-5's *exponential* initial-difficulty formula with FSRS-4.5's 17 weights; `D0` clamped to 1.0 for every card, the `(11 − D)` term maxed out, and intervals ran away (4d → 23d → 109d → 437d). FSRS-4.5 uses **linear** `D0(g) = w4 − (g−3)·w5` and no `(10−D)/9` damping. Verified good-every-time now reads 4d → 15d → 50d → 149d, and difficulty stays near 5.
> - **State is a superset, never a replacement.** FSRS adds `{s, d, last}` and keeps `{ease, interval, due, reps}` maintained, so Classic ⇄ Adaptive works in both directions and old cards migrate lazily on next review. `lastReviewedAt()` in `srs.js` infers `last` for pre-migration cards from `due − interval`.
> - **Pacing and the forecast must agree.** The taper made the readiness card contradict itself ("you need 45/day" next to "today's pace: 14"). Fixed with `strategy: 'cover' | 'consolidate'` on the forecast: in consolidate mode the verdict is graded on *readiness* rather than coverage, the headline talks about retention, and the manual "raise pace" button is hidden so it can't fight the engine.
>
> Original proposal below.


**What.** Two coupled upgrades to the scheduling core: **(1)** replace SM-2 with **FSRS** (Free Spaced Repetition Scheduler — open-source MIT algorithm, the modern Anki default) for meaningfully better retention-per-review; **(2)** **adaptive pacing** — the daily new-card budget stops being a global constant and responds to the schedule: ramp new cards early in a rotation, shift to review-heavy as the exam approaches (the intensity ramp promised in [[Features]]), throttle after overload days, and split the budget across rotations by exam proximity.

**Why it's significant.** The SRS engine is the app's engine room — every card interaction flows through it, so a better memory model compounds across all ~1,970 cards and everything students import. FSRS's difficulty/stability/retrievability model also gives the readiness forecast (P1) *real* per-card recall probabilities instead of a heuristic, and adaptive pacing is the last 🔨 in [[Roadmap]] Phase 3 ("intensity ramp") plus the first ⬜ of Phase 5. SM-2's fixed ease-factor spiral ("ease hell") is a known failure mode that quietly punishes exactly the struggling students BabyClerk exists for.

**How.**
- `src/lib/fsrs.js`: implement the FSRS-4.5 update equations directly (~100 lines, default parameters — **no dependency**, keeping the no-heavy-deps rule in [[Principles]]). Extend the per-card SRS state with `{ stability, difficulty }`; **migrate lazily** — cards convert from SM-2 state on their next review (interval → initial stability), so nothing breaks, sync stays backward-compatible, and rollback is trivial.
- `src/lib/pacing.js`: `dailyBudgetFor(rotationId, schedule, recentAttempts)` — base budget × exam-phase multiplier (early: 1.2×, final week: 0.3× new / review-first) × overload guard (yesterday's due count vs. completed). Deterministic and explainable; show the "why" in the UI ("Exam in 6 days — easing off new cards").
- Ship behind a Settings toggle ("Scheduler: Classic / Adaptive") for one release; default to Adaptive once verified.
- Vault: new decision entry (D13) with the migration story; update [[Data-Model]] (`srs:*` shape) and [[Features]].

**Success looks like:** review load feels lighter for the same retention (fewer redundant reps), the pre-exam week automatically becomes review-focused without the student touching Settings, and P1's forecast quotes real recall probabilities.

---

## Runners-up (considered, deliberately not in the five)

- **OTP-code sign-in + sync status UX** — real friction (magic-link PKCE breaks cross-browser), but it polishes an existing flow rather than changing what the app *is*. Do it inside Phase 6 reliability.
- **Deck manager / original verified core** — important for launch ([[Content-Strategy]]), but it's content operations, and P2's ontology has to land first to make content work stick.
- **Cohort/deck sharing** — highest long-term growth loop, but license-gated ([[Licensing-and-Copyright]]) and premature before P3 makes single-player onboarding great.

## Sequencing & dependencies

```
P3 (onboarding) ──────────────► ship anytime; pulls users into the loop
P1 (forecast, simple) ────────► ship now on SRS-state arithmetic
P2 (ontology) ────────────────► sharpens P4's targeting + /progress
P5 (FSRS + pacing) ───────────► upgrades P1's forecast from heuristic to model
P4 (tutor) ───────────────────► best after P2 (right concepts) but viable before
```

Fastest visible wins: **P1-simple and P3** (days each, zero new dependencies). Deepest compounding wins: **P2 and P5**. P4 is the one users will talk about.

**For future agents:** when you ship any of these, update this note's status, the [[Roadmap]] phase, [[Features]], and [[Backlog]] in the *same commit* as the code — and record new decisions (ontology choice → D12, FSRS migration → D13) in [[Decisions]].

Related: [[Mission]] · [[Vision]] · [[Roadmap]] · [[AI-Personalization-Engine]] · [[Backlog]] · [[Decisions]]
