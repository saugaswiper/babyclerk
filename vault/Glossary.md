# Glossary

## App terms
- **Study Due** — the cross-rotation queue of cards due for review right now.
- **Daily new-card budget** (`newLimit`) — cap on how many *new* cards are introduced per day, so the queue never explodes.
- **Attempt log** — planned per-answer event record powering personalization. See [[Data-Model]].
- **Mastery model** — per-topic estimate of how well the student knows a topic. See [[AI-Personalization-Engine]].
- **Sync blob** — the JSON of all synced progress for one user, stored in Supabase `progress.data`. See [[Sync-and-Accounts]].
- **Content layers** — bundled / imported / generated content, merged at read time. See [[Architecture]].
- **School profile** — planned data layer holding a school's rotations/exam quirks so the core stays school-agnostic. See [[Personas]].

## Study-science terms
- **SM-2** — the SuperMemo-2 spaced-repetition algorithm (interval, ease factor, reps) used by the scheduler.
- **Spaced repetition (SRS)** — reviewing material at increasing intervals timed to just before forgetting.
- **Cloze deletion** — a card that hides part of a sentence (`{{c1::…}}`) for recall.
- **Image occlusion (IO)** — a card that masks regions of an image to test recall of labeled anatomy/figures.
- **Viva** — oral-examination-style Q&A drilling.

## Clerkship terms
- **Clerkship / clerk** — the clinical years of med school; a student in them.
- **Rotation** — a block on one specialty (Medicine, Surgery, OB/GYN, Peds, Psych, Family, Emerg). See [[Rotations]].
- **MCCQE** — Medical Council of Canada Qualifying Examination (relevant for Queen's-first focus).
- **High-yield** — content most likely to matter for exams/wards; what we prioritize.
- **Preceptor** — the supervising physician on a rotation.

## Tech terms
- **PWA** — Progressive Web App: installable, offline-capable web app.
- **RLS** — Row-Level Security (Postgres/Supabase): each user can only access their own rows.
- **PKCE** — auth flow returning a `?code=` to exchange for a session (avoids HashRouter collision).
- **HashRouter** — client routing via URL hash; needed for GitHub Pages.

Related: [[Home]]
