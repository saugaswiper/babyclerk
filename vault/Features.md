# Features Catalog

Shipped + planned features with status. Keep in sync with [[Roadmap]] (this is the detailed view; Roadmap is the phased plan). Legend: ✅ shipped · 🔨 in progress · ⬜ planned.

## Study core
- ✅ **Rotations** (7) with notes + checklists — see [[Rotations]]
- ✅ **Flashcards** (~1,970, Montis bundled) with front/back
- ✅ **Viva drills** (oral-exam prompts + model answers)
- ✅ **MCQ quizzes** (stem/options/answer/explanation) + best-score tracking
- ✅ **Spaced repetition** (SM-2) with **daily new-card budget**
- ✅ **Study Due** — cross-rotation due queue ("what do I do now")
- ✅ **Full-text search** across all content
- ⬜ **Cloze** as a first-class engine card type (import exists; native support planned)

## Content authoring & extension
- ✅ **Import**: text / CSV / cloze / JSON / file
- ✅ **AI card generation** (Anthropic API, user key) — incl. **grounded generation** from pasted source text (paraphrased + provenance-tagged)
- ✅ **Image-occlusion creator** (`IOCreate`)
- ✅ **Misses → cards** (wrong answers become review cards)
- ⬜ **Deck manager** (enable/disable, tag, per-source counts)
- ⬜ **Original verified core** (shippable baseline) — see [[Content-Strategy]]

## Look & feel
- ✅ **Design system** — refined tokens (layered depth, radii, focus rings), tactile buttons, tinted answer buttons, polished tiles/cards/topbar, dark-mode tuned, `prefers-reduced-motion` respected
- ✅ **No emojis** — replaced app-wide with a cohesive custom **SVG icon set** (`components/Icon.jsx`): crisp, theme-aware, offline-safe. Each rotation has an `icon` id.
- ✅ **Signature hero** (Home) — clinical-monitor gradient + **ECG pulse line** drawn on load (per Anthropic frontend-design skill: hero-as-thesis, signature element, restraint). No stock photos — offline-first PWA
- ✅ **Calendar-style schedule timeline** (`ScheduleTimeline`) — rotations as bars across a month ruler with a "today" marker + overall clerkship progress; on `/schedule`
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
- 🔨 **Exam-proximity intensity ramp** (messaging done; auto new-card load = Phase 5)
- ✅ **Attempt log** (per-answer telemetry: flashcards + MCQs, synced, clearable)
- ✅ **Weak-area dashboard** (`/progress`): overall accuracy, weakest topics, by-rotation; home teaser
- 🔨 **Topic tagging** — uses cards' existing `topic` strings; normalized ontology open (OD3)
- ✅ **Mastery model** — recency-weighted accuracy + confidence + trend (↑/↓); powers insights + prioritizer
- 🔨 **Weak-area targeting** — "Study due" queue orders by weakness + exam proximity (shipped); AI-generate related questions still ⬜
- ⬜ **Adaptive pacing**
- ⬜ **AI tutor** (explain miss, quiz-me, generate from weak spot)
- ⬜ **Exam readiness forecast** + "what to expect" by rotation/date

## Launch (see [[Roadmap]] Phase 6)
- ⬜ First-run onboarding
- ⬜ Multi-school profiles
- ⬜ Accessibility + reliability pass
- ⬜ Deck sharing / cohorts (opt-in, license-gated)

Related: [[Roadmap]] · [[Backlog]] · [[AI-Personalization-Engine]]
