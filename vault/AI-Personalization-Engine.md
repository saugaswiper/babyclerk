# AI Personalization Engine

**The big bet** (see [[Vision]]). An AI system that learns from a student's actual performance to (1) target weak areas with tailored questions and (2) tell them what to expect on rotation and on exams *given the date*. This is the moat — everything else is table stakes.

> User's framing: *"an AI system that learns from the user's performance to give them weak-area targeting and questions related to such — and also what they should expect on rotation/exam given the date."*

## The loop we're building
```
study/answer → attempt log → mastery model → prioritizer → next best action
      ↑                                                          │
      └──────────────── AI generates targeted practice ←─────────┘
                          (+ date/rotation context)
```

## Layer 1 — Measure (foundation, [[Roadmap]] Phase 4)
Nothing personalizes without data. See [[Data-Model]] "attempt log."
- **Attempt log:** every answer → `{card_id, topic, kind, correct, latency_ms, ts, rotation}`. Append-only, local-first, synced.
- **Topic ontology:** every card/MCQ tagged with a topic + system/rotation. Rolling accuracy computes per topic. (Open question: adopt existing med-ed taxonomy vs. roll our own — see [[Roadmap]].)
- Latency matters: slow-but-correct ≠ mastered.

## Layer 2 — Model (mastery estimation) — ✅ first version shipped
`src/lib/mastery.js` turns raw attempts into a **per-topic mastery estimate**:
- ✅ Recency-weighted accuracy (newest answers weigh more; decay 0.9).
- ✅ Confidence from sample size (`n/(n+5)`).
- ✅ Trend (improving/declining/steady) once ≥6 attempts.
- ✅ Rules-based and transparent — every number traces to countable attempts, so a student can see *why*. Sophistication (Bayesian/ELO/learned) comes later. **Explainability > cleverness** held.
- Consumed by `/progress` (the read) and `orderForFocus` (Layer 3). Latency is captured in the log for future use.

## Layer 3 — Prioritize (the daily decision) — 🔨 first version shipped
`orderForFocus` (in `src/lib/studyQueue.js`) reorders the "Study due" queue by topic-weakness (from the attempt log) + exam proximity (from the schedule), reviews still ahead of new cards. This is Layer 3's first real implementation — reorder only, no scheduling change. Remaining: weight into the *daily budget* and generation.

Given mastery + the calendar, decide **what to do now**:
- Weak topics get more weight.
- **Current rotation** gets more weight (from the schedule — see below).
- **Exam proximity ramps intensity**: as an exam date nears, shift from broad new-learning to weak-area consolidation for that rotation.
- Respect the daily budget so it stays achievable (see [[Principles]] "trust the schedule").

## Layer 4 — Generate (AI targeted practice)
This is where Claude earns its place (Anthropic API, user key — see [[Architecture]]):
- **Weak-area questions:** "generate 5 questions on [weak topic] at [difficulty]," grounded in the student's misses.
- **Explain a miss:** on-demand tutor explanation for a wrong answer.
- **"Quiz me on X":** conversational drilling.
- **Feedback loop:** generated questions flow *back* into the attempt log + mastery model, so the system learns from AI-driven practice too.
- Guardrails: generated content is marked, verifiable, and never presented as authoritative fact without traceability (see [[Content-Strategy]], [[Principles]]).

## Layer 5 — Forecast (date-aware "what to expect")
The calendar-aware tutor:
- From the **rotation schedule + exam dates** (Phase 3), plus mastery, produce:
  - **"What to expect on this rotation"**: high-yield topics, common presentations, what preceptors/exams emphasize.
  - **"What to expect on this exam"**: topic blueprint + your predicted weak spots on it.
  - **Readiness estimate**: "you're ~70% ready for the Peds exam; hit these 4 topics."
- Start with **static rotation/exam profiles** (curated content), layer AI personalization on top. Don't block the feature on the AI being perfect.

## Build order (do not skip ahead)
1. **Schedule & dates** (Phase 3) — cheap, high value, unlocks forecasting.
2. **Attempt log + topic tags** (Phase 4) — the substrate. **Highest-leverage unglamorous work.**
3. **Mastery model + weak-area dashboard** (Phase 4/5).
4. **Prioritizer** wired into the home screen.
5. **AI generation + tutor** (Phase 5).
6. **Forecast** (Phase 5), static → personalized.

Building AI generation before the attempt log exists = guessing. See [[Roadmap]] sequencing.

## Principles specific to this engine
- **Explainable:** the student can always see *why* something was surfaced.
- **Private:** performance data is theirs — synced, exportable, deletable (see [[Sync-and-Accounts]], [[Principles]]).
- **Honest:** never fake mastery/readiness numbers; show confidence.
- **Graceful offline:** measurement + rules-based prioritization work offline; only *generation* needs the network.

## Open questions (→ [[Decisions]] / ask user)
- Topic ontology source?
- AI cost model: user key only vs. hosted allowance? (Affects how freely we can auto-generate — see [[Roadmap]] Phase 6.)
- How much to trust AI-generated medical content vs. requiring a verified core (see [[Licensing-and-Copyright]], [[Content-Strategy]]).

Related: [[Vision]] · [[Roadmap]] · [[Data-Model]] · [[Content-Strategy]]
