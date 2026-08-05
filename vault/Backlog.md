# Backlog

Live, prioritized next actions. This is the "what to pick up next" list — keep it current; move done items to [[Features]]/[[Roadmap]] status. Ordered by leverage.

> 🧭 **Big-picture next moves live in [[Improvement-Proposals]]** — 5 specced, prioritized proposals (P1 forecast · P2 ontology · P3 onboarding · P4 tutor · P5 FSRS/pacing). Pick from there for significant work; this list tracks the granular items.

## Now (highest leverage)
- [x] **OD1 (Montis license)** — resolved: free/community deck, cleared for you + classmates. Before wide public launch, record the actual license text + attribution. See [[Licensing-and-Copyright]].
- [ ] **Decide OD2 (AI cost model)** — hosted proxy (you pay, no user key) vs. keep BYO-key optional. Blocks the "no API key for users" work. See [[Decisions]] D9.
- [x] **Rotation schedule + exam dates UI** — shipped (`/schedule`), synced. ([[Roadmap]] Phase 3)
- [x] **Current-rotation prioritization** on the home screen + exam countdowns. Shipped.
- [ ] **Verify Phase 1 in prod** — confirm the sign-in/sync deploy is green and magic-link redirect URLs are configured in Supabase. See [[Sync-and-Accounts]].

## Next
- [x] **Attempt log** schema + writes on every answer. Shipped (`babyclerk:attempts`, synced). ([[Data-Model]])
- [x] **Weak-area dashboard** — shipped (`/progress` + home teaser).
- [x] **Mastery model** — shipped (`src/lib/mastery.js`): recency-weighted accuracy, confidence, trend. Feeds `/progress` + `orderForFocus`.
- [ ] **Topic ontology (OD3)** — normalized cross-rotation tags so the same concept clusters. Sharpens weak-area targeting.
- [x] **Weak-area targeting in the study queue** — shipped: `orderForFocus` orders "Study due" by topic-weakness + exam proximity (reorder only). First use of the log to *act*.
- [x] **Exam-proximity in the prioritizer** — folded into `orderForFocus` (imminent-exam rotations rise).
- [ ] **Deck manager** (enable/disable, per-source counts).
- [ ] **Cloze** as first-class engine card type.

## Later
- [ ] **AI tutor** actions: explain-a-miss, quiz-me, generate-from-weak-spot. ([[AI-Personalization-Engine]])
- [x] **Exam readiness forecast** — shipped (P1). Still open: **"what to expect" per rotation/exam** (the content half of Layer 5).
- [x] **First-run onboarding** — shipped (P3): `/welcome`, stream → pace → ready.
- [ ] **Multi-school profiles**.
- [ ] **Accessibility + reliability pass**; export/delete my data.
- [ ] **Deck sharing / cohorts** (license-gated).

## Decisions to get from the user (see [[Decisions]] open items)
- [x] OD1 Montis license (free/community, cleared for classmates) · [x] OD2 AI cost (BYO key, D10)
- [ ] OD3 topic ontology · OD4 original content sourcing

## Watch-items (not tasks yet)
- Sync blob size (IO images, future attempt log) — [[Architecture]], [[Sync-and-Accounts]].

Related: [[Roadmap]] · [[Decisions]] · [[Features]]
