# Decision Log (ADRs)

Key decisions and *why*, so future sessions don't re-litigate them. Add a dated entry when you make a call that shapes the product or architecture. Format: **Decision — Context — Consequence.**

---

### D1 — Local-first, cloud-as-mirror
**Decision:** `localStorage` is the source of truth; Supabase syncs a per-user blob.
**Context:** Ward use = flaky signal; studying must never block on the network ([[Principles]]).
**Consequence:** All features work offline; sync is a background merge. See [[Sync-and-Accounts]].

### D2 — Merge, never clobber
**Decision:** Sync merges card-by-card (max reps, latest schedule, union decks) rather than last-writer-wins.
**Context:** Students study on multiple devices, often offline.
**Consequence:** A sync can only add progress, never lose a session. Merge rules in [[Sync-and-Accounts]].

### D3 — Magic-link + PKCE (not implicit flow)
**Decision:** Email magic-link auth using PKCE.
**Context:** Passwordless suits students; HashRouter (GitHub Pages) collides with hash-fragment auth tokens.
**Consequence:** Callback uses `?code=…` query, no router collision. Requires redirect-URL config in Supabase. See [[Architecture]].

### D4 — Bundle deck content in JS, sync only progress
**Decision:** Deck content ships in the bundle; only progress goes in the sync blob.
**Context:** Keep the sync payload small and fast.
**Consequence:** Sync stays light; content updates ship via deploy. See [[Data-Model]].

### D5 — Hybrid content model
**Decision:** Original core (public) + private import + private AI-generated.
**Context:** Import-only = empty day-1; hosting commercial decks = illegal. (User chose hybrid.)
**Consequence:** Great out-of-box + legal + deep. See [[Content-Strategy]], [[Licensing-and-Copyright]].

### D6 — Queen's-first, generalizable core
**Decision:** Optimize for Queen's now; keep school specifics in data/profiles, never in engine code.
**Context:** User wants "any med student" reach but a great local experience first. (User chose Queen's-first, others welcome.)
**Consequence:** Multi-school later is a content/profile task, not a rewrite. See [[Personas]], [[Rotations]].

### D7 — Personalization is the product bet
**Decision:** Invest toward an adaptive AI tutor driven by a performance attempt-log.
**Context:** SRS + content are table stakes; the moat is learning *the student*. (User's core ask.)
**Consequence:** Roadmap sequences telemetry (Phase 4) before AI generation (Phase 5). See [[AI-Personalization-Engine]].

---

## Open decisions (unresolved — resolve with the user)
- **OD1 — Montis license.** Is bundling the Montis deck publicly OK? Blocks calling the app launch-ready. See [[Licensing-and-Copyright]]. **Needs answer.**
- **OD2 — AI cost model.** User-supplied key only, or a hosted allowance/tier? Shapes Phase 5/6 economics.
- **OD3 — Topic ontology.** Adopt an existing med-ed taxonomy or author our own? Blocks clean weak-area targeting.
- **OD4 — Original content sourcing.** Author from scratch, curate open banks, or AI-generate-then-verify — and who verifies?

Related: [[Roadmap]] · [[Backlog]]
