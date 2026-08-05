# Features Catalog

Shipped + planned features with status. Keep in sync with [[Roadmap]] (this is the detailed view; Roadmap is the phased plan). Legend: ✅ shipped · 🔨 in progress · ⬜ planned.

## Study core
- ✅ **Rotations** (7) with notes + checklists — see [[Rotations]]
- ✅ **Flashcards** (~1,970, Montis bundled) with front/back
- ✅ **Viva drills** (oral-exam prompts + model answers)
- ✅ **MCQ quizzes** (stem/options/answer/explanation) + best-score tracking
- ✅ **Spaced repetition** — **FSRS-4.5** (`src/lib/fsrs.js`, ~100 lines, no dependency) models *stability* and *difficulty* separately, so a card you keep failing recovers instead of spiralling into permanently short intervals ("ease hell"). Migration from SM-2 is **lazy and non-destructive**: a card converts on its next review (old interval → initial stability, ease → difficulty) and the SM-2 fields stay maintained, so the Classic toggle works in both directions forever.
- ✅ **Adaptive pacing** (`src/lib/pacing.js`) — the daily new-card budget responds to the calendar: raised (capped at 2× your setting) when you're behind on coverage with time left, tapered to 70/40/0% inside 14/7/3 days of an exam so the session becomes consolidation. Always shows its reasoning.
- ✅ **Scheduler toggle** in Settings (Adaptive / Classic), defaulting to Adaptive
- ✅ **Study Due** — cross-rotation due queue ("what do I do now")
- ✅ **Full-text search** across all content
- ⬜ **Cloze** as a first-class engine card type (import exists; native support planned)

## Content authoring & extension
- ✅ **Import**: text / CSV / cloze / JSON / file
- ✅ **AI card generation** (Anthropic API, user key) — incl. **grounded generation** from pasted source text (paraphrased + provenance-tagged)
- ✅ **Study from your own material** (`/r/:id/material`) — paste a textbook chapter or lecture notes; it chunks into sections, generates per section with provenance, and marks every card **private** (never bundled, never shareable — `getShareableCustom` enforces it). Per-source removal built in. See [[Licensing-and-Copyright]].
- ✅ **Image-occlusion creator** (`IOCreate`)
- ✅ **Misses → cards** (wrong answers become review cards)
- ⬜ **Deck manager** (enable/disable, tag, per-source counts)
- ⬜ **Original verified core** (shippable baseline) — see [[Content-Strategy]]

## Look & feel
- ✅ **Design system** — refined tokens (layered depth, radii, focus rings), tactile buttons, tinted answer buttons, polished tiles/cards/topbar, dark-mode tuned, `prefers-reduced-motion` respected
- ✅ **No emojis** — replaced app-wide with a cohesive custom **SVG icon set** (`components/Icon.jsx`): crisp, theme-aware, offline-safe. Each rotation has an `icon` id.
- ✅ **Signature hero** (Home) — clinical-monitor gradient + **ECG pulse line** drawn on load (per Anthropic frontend-design skill: hero-as-thesis, signature element, restraint). No stock photos — offline-first PWA
- ✅ **Calendar-style schedule timeline** (`ScheduleTimeline`) — **colour-coded per rotation** (done=faded, current=ringed), month ruler, "today" marker + overall progress
- ✅ **Visual schedule editor** — big stream-picker cards (span + colour preview) as the primary flow; colour-coded rotation rows show dates as readable text with an Edit/Add toggle (date-typing is secondary). Dates **verified against the source spreadsheets**.
- ✅ **Animated ECG page background** on Home (subtle, full-page, reduced-motion safe) — the signature motif as ambient backdrop
- Note: deliberately **no heavy 3D/animation deps** (Three.js/GSAP/etc.) — conflicts with offline-first/ward-ready ([[Principles]]); motion is CSS-only

## Accounts & platform
- ✅ **PWA**: offline, installable, app-like
- ✅ **Backup / restore** (JSON export-import)
- ✅ **Email magic-link sign-in** (Supabase, optional)
- ✅ **Cloud sync** (merge-not-clobber) — see [[Sync-and-Accounts]]
- ✅ **Settings**: API key, model, daily new-card limit, account/sync controls

## Personalization & dates (the frontier — see [[AI-Personalization-Engine]])
- ✅ **Rotation schedule + exam dates** (`/schedule`, synced)
- ✅ **Current-rotation prioritization** on home (+ "On rotation now" badge)
- ✅ **Exam countdowns** (soonest-exam banner + per-tile pills, color-coded)
- ✅ **Exam-proximity intensity ramp** — messaging plus the auto-adjusting new-card load (adaptive pacing)
- ✅ **Attempt log** (per-answer telemetry: flashcards + MCQs, synced, clearable)
- ✅ **Weak-area dashboard** (`/progress`): overall accuracy, weakest topics, by-rotation; home teaser
- ✅ **Topic ontology** (`src/data/ontology.js`) — the decks' `topic` strings are lecture labels (190 cards say "Urology", 172 say "Peds"), so cards are classified into ~110 real concepts by keyword-matching their own text. 68% map to a concept; 158 in use vs 61 raw strings. Resolved at write time onto each attempt; pre-ontology attempts fall back to `topic`.
- ✅ **Cross-rotation weakness** (`/progress`) — concepts you're failing in more than one block, surfaced above the per-rotation list
- ✅ **Mastery model** — recency-weighted accuracy + confidence + trend (↑/↓); powers insights + prioritizer
- ✅ **Weak-area targeting** — "Study due" queue orders by weakness + exam proximity; **"Drill my weak spot"** on `/progress` AI-generates targeted cards for the weakest topic (closes the loop)
- ✅ **Exam readiness forecast** (`src/lib/forecast.js`) — "% ready today" from per-card recall decay + coverage, plus a pace verdict (on track / tight / behind) and a one-tap "raise pace to N/day" fix. Shown on `/r/:id`, in the home exam banner, and as a cross-rotation list on `/progress`. Deterministic, offline, fully explainable.
- ✅ **Adaptive pacing** — shipped (see Study core above); the forecast switches from a "cover the deck" strategy to a "consolidate" one when the taper kicks in, so the verdict stops grading you on coverage in exam week
- ✅ **AI tutor — "Explain this"** (`src/lib/tutor.js`): at a wrong MCQ or a revealed flashcard, one tap returns why the answer is right, why yours isn't, and a memory hook — grounded strictly on that card's own text. Gated on the user's API key; never auto-fires.
- ⬜ **AI tutor — "Quiz me on X"** (conversational drilling that logs back to the attempt log)
- ⬜ **"What to expect"** by rotation/date (the other half of Layer 5)

## Launch (see [[Roadmap]] Phase 6)
- ✅ **First-run onboarding** (`/welcome`) — 3 steps: stream picker (writes the schedule) → daily pace (writes `newLimit`) → a "you're set" summary naming your current/next rotation and today's card count, landing straight in a session. Guarded by `needsOnboarding()` so it only ever catches genuinely new visitors; re-runnable from Settings.
- ⬜ Multi-school profiles
- ⬜ Accessibility + reliability pass
- ⬜ Deck sharing / cohorts (opt-in, license-gated)

Related: [[Roadmap]] · [[Backlog]] · [[AI-Personalization-Engine]]
