# Content Strategy

**Model: Hybrid — original core + private import** (user's choice). Ship a solid, legally-clean original baseline that's "crazy good out of the box," and let each student privately extend it with their own decks (UWorld misses, Anki, class notes).

## The three content layers (merged at read time — see [[Architecture]])
1. **Original core (shippable to everyone).** Authored or AI-generated **and verified**, openly-licensed or ours. This is what a brand-new user sees and what must generalize beyond Queen's. **The baseline everyone gets.**
2. **Imported (private to the user).** Anki/CSV/cloze/JSON/file/UWorld-misses. Legally clean because it's the user's own content, never hosted publicly. See [[Licensing-and-Copyright]].
3. **Generated (private).** AI-created and miss-derived cards. Marked and traceable — see [[AI-Personalization-Engine]].

## Why hybrid (the reasoning)
- **Out-of-box value:** import-only fails a new user (empty app). An original core makes day 1 great.
- **Depth without legal risk:** students still get their beloved commercial decks — privately, by import — without us hosting copyrighted material. See [[Licensing-and-Copyright]] ⚠️.
- **We complement, not replace, UWorld/AMBOSS** (a [[Vision]] non-goal to replace them).

## Current state
- Baseline today leans on a **bundled third-party deck (Montis)**. For a launchable public product we need an **original/openly-licensed core** as the default baseline (see [[Roadmap]] Phase 2). Treat replacing/verifying the baseline as pre-launch work.

## Quality bar (see [[Principles]] "evidence-first")
- Accurate, high-yield, traceable. A wrong fact is worse than a missing one.
- AI-generated content is **clearly marked** and verifiable; it doesn't silently become "truth."
- Prefer current guidelines; note when content may date.

## Coverage target (Queen's-first, generalizable)
- The 7 core clerkship rotations (see [[Rotations]]), each with: high-yield facts (flashcards), viva prompts, MCQs, notes, checklist.
- **Generalization discipline:** rotation *content* is data, not code; Queen's specifics (local protocols, exam quirks) are a layer that a school profile can override (see [[Personas]] P3, [[Principles]] "no school hardcoding").

## Topic tagging (enables personalization)
Every item should carry a **topic + system/rotation tag** (see [[Data-Model]], [[AI-Personalization-Engine]]). Without consistent tags, weak-area targeting can't work. Bake tagging into content authoring from now on.

## Open questions (→ ask user / [[Decisions]])
- How much original content is "enough" to ship compellingly?
- Adopt an existing open question bank / med-ed taxonomy, or author from scratch?
- Verification workflow for AI-generated core content (who/what checks it)?

Related: [[Licensing-and-Copyright]] · [[Rotations]] · [[Roadmap]] · [[AI-Personalization-Engine]]
