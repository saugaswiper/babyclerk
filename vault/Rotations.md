# Rotations

The clerkship rotations BabyClerk covers. **Queen's-first**, structured so another school is a content/profile change, not a code change (see [[Principles]], [[Personas]] P3).

## Covered rotations (7)
1. **Internal Medicine**
2. **Surgery**
3. **Obstetrics & Gynecology**
4. **Pediatrics**
5. **Psychiatry**
6. **Family Medicine**
7. **Emergency Medicine**

Each rotation ships with: notes, a **checklist** (procedures/experiences to get signed off), flashcards, viva prompts, and MCQs. Progress per rotation is tracked (see [[Data-Model]]).

## Per-rotation content model (target)
Each rotation should eventually have a structured **profile**:
- **High-yield topics** (tagged for [[AI-Personalization-Engine|weak-area targeting]]).
- **Common presentations / "what to expect"** on the wards.
- **Exam blueprint** — what the end-of-rotation exam emphasizes (feeds [[AI-Personalization-Engine|forecasting]]).
- **Checklist** of required clinical experiences.
- **Queen's-specific layer** (local protocols, exam quirks) that a school profile can override.

## Date awareness (planned — [[Roadmap]] Phase 3)
Students enter their **rotation schedule** (which block, start/end dates) and **exam dates**. The app then:
- Prioritizes the **current** rotation on the home screen.
- Ramps intensity toward each rotation's exam.
- Surfaces "what to expect" for the rotation you're on / about to start.

## Generalization notes
- Rotation *names and structure* vary by school/country (e.g., combined Medicine/Surgery blocks, different exam formats). Keep rotation definitions in **data**, selectable via a school profile.
- The **topic ontology** (see [[Content-Strategy]], [[Data-Model]]) should be rotation-tagged so content maps cleanly regardless of local scheduling.

Related: [[Content-Strategy]] · [[AI-Personalization-Engine]] · [[Roadmap]]
