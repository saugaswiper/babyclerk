# Principles

Non-negotiables that constrain every design decision. If a feature violates one of these, it's wrong — or the principle needs an explicit [[Decisions|ADR]] to change.

## Product principles
1. **Zero-friction daily loop.** The default screen answers "what do I do now?" Opening the app and starting should take one tap. Planning is the app's job, not the student's.
2. **Offline-first, ward-ready.** Everything core must work with no signal, fast, on a phone. Network features degrade gracefully; they never block studying. See [[Architecture]].
3. **Guest-first, account-optional.** A new user can study immediately without signing up. Accounts add sync + personalization but are never a gate. See [[Sync-and-Accounts]].
4. **Trust the schedule.** If the app says "12 cards due," that must be true and achievable. Never overwhelm; respect the daily new-card budget. Realism > ambition.
5. **Evidence-first content.** Medical content is accurate, high-yield, and traceable. When AI generates content, it's clearly marked and verifiable. Wrong facts are worse than no facts. See [[Content-Strategy]].
6. **The app adapts to the student, not vice versa.** Personalization is the product. See [[AI-Personalization-Engine]].
7. **Respect the calendar.** Rotation and exam dates change what matters. Date-awareness is first-class, not a widget. See [[AI-Personalization-Engine]] and [[Rotations]].

## Engineering principles
1. **Local is the source of truth; cloud is a mirror.** All progress lives in `localStorage` first; sync is a background merge, never a blocking read. See [[Data-Model]].
2. **Merge, never clobber.** Multi-device sync must merge card-by-card (max reps, latest schedule, union of decks). A sync must never lose a study session. See [[Sync-and-Accounts]].
3. **Secrets stay on device.** The Anthropic API key and any user secret are never synced, never sent to our servers. Row-level security isolates every user's data.
4. **Ship small, ship verified.** Build must pass (`npm run build`) before deploy. Prefer incremental, reversible changes. See [[Agent-Guide]].
5. **No school hardcoding in the core.** Queen's-specific content lives in data/content layers, not in engine logic, so generalizing to another school is a content task, not a rewrite.
6. **Privacy by default.** Performance data is the user's. We collect only what personalization needs, we tell users what we store, and we let them export/delete it.
7. **Keep the vault current.** Any change to architecture, data model, or roadmap updates this vault in the same PR. The vault is code's memory.

## Content principles
- **Never publicly host copyrighted content.** UWorld/AMBOSS/commercial decks are import-only and private to the user. See [[Licensing-and-Copyright]] — read it before adding any deck.
- **Original core is the shippable baseline.** What ships to everyone is original or openly-licensed. See [[Content-Strategy]].

Related: [[Vision]] · [[Roadmap]] · [[Agent-Guide]]
