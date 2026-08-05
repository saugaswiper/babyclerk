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

### D8 — Desktop packaging does not bypass copyright
**Decision:** Do not treat "make it a desktop app" as a way to bundle content we can't redistribute.
**Context:** User asked whether a standalone laptop app could sidestep the Montis licensing question.
**Consequence:** Distribution is distribution regardless of format; only *personal* use is exempt. Web PWA stays the platform (it already installs offline); licensing is solved by the deck's actual license + the import model, not by platform choice. See [[Licensing-and-Copyright]].

### D9 — API access for less-technical users is a proxy question, not MCP
**Decision:** To spare users from pasting an Anthropic key, the answer is a backend proxy (shared key) or keeping AI optional — **not** MCP. MCP is a connector protocol for AI *clients*; it doesn't give a public web app model access or billing.
**Context:** User asked "can we use MCP instead of an API key for less tech-savvy users."
**Consequence:** Reframed as OD2 (AI cost model) — a spending decision. See [[AI-Personalization-Engine]], [[Sync-and-Accounts]].

### D10 — AI generation: user's key (BYO), grounded on sources
**Decision:** AI generation runs on the **user's own Anthropic key** (BYO — resolves OD2). It also supports **grounded generation**: paste source text and cards are built strictly from it (paraphrased, per-item provenance).
**Context:** User chose BYO-key over a hosted proxy, and wants to generate content from open-source resources.
**Consequence:** No hosted AI cost to fund; AI features stay optional (core study needs no key). Grounding makes output evidence-based. **Licensing rule:** ground *public/shippable* content only on openly-licensed/public-domain sources (paraphrase + record provenance); personal grounding on any legally-held source is fine. See [[Content-Strategy]], [[Licensing-and-Copyright]].

### D11 — Schedules are stream-level, not per-person
**Decision:** Incorporate schedules at the **stream** level only (cohort-uniform major-rotation dates). Do **not** build per-individual/intra-tract schedules (specific surgery subspecialty order, tract selective, hospital location, vacation placement).
**Context:** User asked whether exact per-person schedules could be incorporated; chose "stream preset is enough."
**Consequence:** For studying, the stream preset gives exact rotation-date windows (what drives prioritization). Per-person detail is out of scope because it's name-keyed (PII we strip for the public repo) and finer than the one-block-per-rotation model. If revisited, do it as a **private personal import** (own data, synced to the user's account only, never committed) — not public data. See [[Resources/Curriculum/Queens-MEDS2028-Schedules]].

### D12 — FSRS replaces SM-2, migrating lazily behind a reversible toggle
**Decision:** The default scheduler is **FSRS-4.5**, implemented directly in `src/lib/fsrs.js` (~100 lines, **no dependency** — a package would break the offline/no-heavy-deps rule in [[Principles]]). Migration is **lazy**: a card converts on its next review (SM-2 interval → initial stability, ease → difficulty), and FSRS **keeps the SM-2 fields maintained**, so the Settings toggle (Adaptive / Classic) works in both directions indefinitely. Adaptive is the default rather than opt-in.
**Context:** SM-2's single ease factor spirals downward on repeated failures ("ease hell"), punishing exactly the struggling student this app exists for; FSRS separates *stability* from *difficulty* and schedules from an explicit target retention.
**Consequence:** Better retention per review across every card, and real per-card recall probabilities for the readiness forecast (which now uses FSRS retrievability when `s` exists and falls back to the SM-2 heuristic otherwise). Defaulting to Adaptive touches existing study history, which is only acceptable *because* the migration is non-destructive and one click reverts it — keep it that way. **Do not mix FSRS versions:** 4.5 weights require 4.5's linear initial-difficulty formula (see [[Improvement-Proposals]] P5 for the bug this caused).

## Open decisions (unresolved — resolve with the user)
- **OD1 — Montis license (downgraded).** Reported as a free/community deck; **cleared for you + classmates**. Before a wide public launch, record the actual license text + attribution. See [[Licensing-and-Copyright]].
- ~~**OD2 — AI cost model.**~~ **Resolved (D10): user's own key (BYO).** Revisit a hosted tier only if a less-technical public audience needs zero-setup AI.
- **OD3 — Topic ontology.** Adopt an existing med-ed taxonomy or author our own? Blocks clean weak-area targeting.
- **OD4 — Original content sourcing.** Author from scratch, curate open banks, or AI-generate-then-verify — and who verifies?

Related: [[Roadmap]] · [[Backlog]]
