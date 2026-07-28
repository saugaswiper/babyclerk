# Backlog

Live, prioritized next actions. This is the "what to pick up next" list — keep it current; move done items to [[Features]]/[[Roadmap]] status. Ordered by leverage.

## Now (highest leverage)
- [x] **OD1 (Montis license)** — resolved: free/community deck, cleared for you + classmates. Before wide public launch, record the actual license text + attribution. See [[Licensing-and-Copyright]].
- [ ] **Decide OD2 (AI cost model)** — hosted proxy (you pay, no user key) vs. keep BYO-key optional. Blocks the "no API key for users" work. See [[Decisions]] D9.
- [ ] **Rotation schedule + exam dates UI** — let users enter blocks/dates. Unlocks date-awareness cheaply. ([[Roadmap]] Phase 3)
- [ ] **Current-rotation prioritization** on the home screen once dates exist.
- [ ] **Verify Phase 1 in prod** — confirm the sign-in/sync deploy is green and magic-link redirect URLs are configured in Supabase. See [[Sync-and-Accounts]].

## Next
- [ ] **Attempt log** schema + writes on every answer. Foundation for personalization. ([[Roadmap]] Phase 4, [[Data-Model]])
- [ ] **Topic tagging** across existing content (needs OD3 ontology decision).
- [ ] **Weak-area dashboard** (read-only insight first).
- [ ] **Exam-proximity intensity ramp** in the prioritizer.
- [ ] **Deck manager** (enable/disable, per-source counts).
- [ ] **Cloze** as first-class engine card type.

## Later
- [ ] **AI tutor** actions: explain-a-miss, quiz-me, generate-from-weak-spot. ([[AI-Personalization-Engine]])
- [ ] **Exam readiness forecast** + "what to expect" per rotation.
- [ ] **First-run onboarding** (school, rotations, dates, seed decks).
- [ ] **Multi-school profiles**.
- [ ] **Accessibility + reliability pass**; export/delete my data.
- [ ] **Deck sharing / cohorts** (license-gated).

## Decisions to get from the user (see [[Decisions]] open items)
- [ ] OD1 Montis license · OD2 AI cost model · OD3 topic ontology · OD4 original content sourcing

## Watch-items (not tasks yet)
- Sync blob size (IO images, future attempt log) — [[Architecture]], [[Sync-and-Accounts]].

Related: [[Roadmap]] · [[Decisions]] · [[Features]]
