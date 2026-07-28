# Vision

## North star
> Make clerkship a breeze for any medical student.

BabyClerk is a study companion that a clerk opens **every day of every rotation** and trusts to tell them: *what to study now, why, and what's coming.* It combines a best-in-class spaced-repetition engine with an AI that learns each student's weak spots and prepares them for exactly what they'll face — by rotation and by date.

Built **Queen's-first** (see [[Personas]]), designed from day one to generalize to any school. The ambition is a **real, launchable product** — not a personal script. See [[Roadmap]] for the path.

## What "a breeze" means (the felt experience)
1. **No decision fatigue.** Open the app → it already knows what you should do today. One tap to start.
2. **Nothing falls through the cracks.** Every high-yield fact for the current rotation is scheduled and tracked. Weak areas resurface automatically.
3. **Right thing at the right time.** Two weeks before the OB/GYN exam, the app shifts weight to OB/GYN and drills your weakest OB topics harder.
4. **Feels like a tutor, not a flashcard box.** It explains, generates targeted practice, and adapts — see [[AI-Personalization-Engine]].
5. **Works on the wards.** Fast, offline, installable, glanceable between patients. See [[Architecture]].

## Success criteria
A student using BabyClerk should be able to say, truthfully:
- "I never had to plan my studying — it planned itself."
- "The night before my exam, I knew I'd covered the high-yield stuff, because the app closed the loop on my weak areas."
- "It caught things I was quietly bad at before they cost me."

### Measurable proxies (see [[Roadmap]] for when we instrument these)
- **Daily active return rate** during a rotation (do they come back every day?).
- **Due-card completion rate** (does the schedule stay realistic?).
- **Weak-area convergence** (do flagged weak topics improve over time?).
- **Self-reported exam confidence** before vs. after.

## Explicit non-goals
- Not a replacement for UWorld/AMBOSS question banks — we **complement** them (import your misses, drill your weak spots). See [[Content-Strategy]].
- Not a clinical reference / point-of-care tool (no dosing decisions, no patient data).
- Not a social network. Sharing decks may come later, but the core loop is the individual learner.

## The one big bet
The differentiator is **[[AI-Personalization-Engine|adaptive personalization]]**: an AI system that learns from a student's actual performance to (a) target weak areas with tailored questions and (b) forecast what to expect on rotation and on exams given the calendar. Everything else (great SRS, clean content, offline PWA) is table stakes we already largely have — the moat is the tutor that learns *you*.

Related: [[Principles]] · [[Roadmap]] · [[Content-Strategy]]
