---
type: curriculum
status: applied
added: 2026-08-04
asset: none in repo — de-identified spreadsheets delivered to the user out-of-band
license: institutional (Queen's internal scheduling doc) — see cautions
---

# Queen's MEDS 2028 — IntraTract Clerkship Schedules (Streams 1–3)

## What it is
The official MEDS 2028 (Kingston) clerkship rotation schedules for Streams 1, 2, and 3 — the two-week block grid, rotation sequence, and per-student locations/selectives.

## Why it matters
Lets a Queen's student prefill their rotation dates in one tap instead of typing them, which powers current-rotation focus and exam countdowns ([[Rotations]], [[AI-Personalization-Engine]] date layer).

## What was done with it
- **De-identified:** every student name removed. The raw spreadsheets were **not committed** (institutional internal doc on a public repo); de-identified copies were delivered to the user directly.
- **Extracted** cohort-level rotation windows (identical for everyone in a stream) into `src/data/queensSchedule.js` — dates + app-rotation only, **no names, no locations, no per-student rows**.
- **Wired** into the schedule editor (`/schedule`) as a "load your stream" preset.

## Extracted insights (durable)
- Streams are time-shifts of the same rotation set across the 2026–27 clerkship year (block-level year rule: the doc dates the Dec block to 2026).
- Section A is column-aligned (OBG…PEDS, 2 wks each). Section B = MEDCORE (4 wks) → PSYCH (4 wks) → Surgery block (subspecialties permute per student → one Surgery span).
- Mapped to app rotations: Internal Medicine (MEDCORE), Psychiatry, Surgery, OB/GYN, Pediatrics. **Not** in these blocks: Anesthesia, Emergency, medicine/tract selectives, Neurology, Family Medicine — students add those.
- Exam dates were not cohort-uniform in the source → left for the user to enter.

## Open questions / cautions
- ⚠️ **Institutional document.** Kept the raw file out of the public repo; only non-personal cohort dates live in the app. If BabyClerk goes public, confirm Queen's is fine with bundling even the de-identified schedule dates.
- Verify the prefilled windows against the official schedule — the MEDCORE/PSYCH/Surgery split within Section B was inferred from the block structure.

Related: [[../README]] · [[../../Rotations]] · [[../../Licensing-and-Copyright]]
