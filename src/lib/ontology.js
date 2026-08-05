// Turn a card into a *concept* — the unit the mastery model should reason
// about. Deterministic, offline, and cheap enough to run on every answer.
//
// Resolution order:
//   1. The card's topic string, if it's already a concept (or an alias of one)
//   2. Keyword matching on the card's own text, for the broad/opaque buckets
//   3. The topic string as-is, or nothing when even that is meaningless
//
// The result is stored on the attempt at log time (attempts.js), because the
// attempt log is append-only history — we never rewrite it, and cards aren't
// available when reading it back. Old attempts simply have no concept and fall
// back to their topic, so nothing breaks.
//
// See vault/Improvement-Proposals.md (P2).
import {
  CONCEPTS,
  TOPIC_ALIASES,
  OPAQUE_TOPICS,
  BROAD_TOPICS,
  conceptLabel,
} from '../data/ontology.js'

// Pre-compile one word-boundary regex per term. Terms are short and the set is
// small (~350), so a linear scan per card is well under a millisecond.
const MATCHERS = CONCEPTS.map((c) => ({
  concept: c,
  terms: c.terms.map((t) => ({
    len: t.length,
    re: new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
  })),
}))

function cardText(card) {
  if (!card) return ''
  return [card.front, card.back, card.question, card.answer, card.cloze, card.explanation]
    .filter((x) => typeof x === 'string')
    .join(' \n ')
    .toLowerCase()
}

// Best concept for this text: most distinct terms matched, ties broken by the
// longest match (so "prostate cancer" beats a bare "cancer"-style term).
function matchConcept(text, rotationId) {
  if (!text) return null
  let best = null
  for (const { concept, terms } of MATCHERS) {
    if (concept.rotations && rotationId && !concept.rotations.includes(rotationId)) continue
    let hits = 0
    let longest = 0
    for (const t of terms) {
      if (t.re.test(text)) {
        hits++
        if (t.len > longest) longest = t.len
      }
    }
    if (!hits) continue
    if (!best || hits > best.hits || (hits === best.hits && longest > best.longest)) {
      best = { id: concept.id, hits, longest }
    }
  }
  return best?.id || null
}

/**
 * @returns {string|null} concept id, or null when the card can't be classified
 */
export function conceptIdFor(card, rotationId) {
  const topic = card?.topic

  if (topic) {
    const alias = TOPIC_ALIASES[topic]
    if (alias) return alias
    if (!OPAQUE_TOPICS.has(topic) && !BROAD_TOPICS.has(topic)) {
      // A specific topic we don't have an alias for is still better than a guess.
      return matchConcept(cardText(card), rotationId) || `topic:${topic}`
    }
  }

  const matched = matchConcept(cardText(card), rotationId)
  if (matched) return matched
  // Broad labels are weak but not worthless; opaque ones tell us nothing.
  if (topic && BROAD_TOPICS.has(topic)) return `topic:${topic}`
  return null
}

// Display name for a concept id (including the `topic:` passthrough form).
export function labelFor(id) {
  if (!id) return null
  if (id.startsWith('topic:')) return id.slice(6)
  return conceptLabel(id)
}

// The prioritizer resolves every due card on each render, so memoize by card id.
// Cards are immutable within a session, which makes this safe.
const cache = new Map()

// Convenience for the study pages: the concept label to store on an attempt.
export function conceptFor(card, rotationId) {
  const key = card?.id ? `${rotationId}|${card.id}` : null
  if (key && cache.has(key)) return cache.get(key)
  const id = conceptIdFor(card, rotationId)
  const out = id ? { id, label: labelFor(id) } : null
  if (key) cache.set(key, out)
  return out
}
