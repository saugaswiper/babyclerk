import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiKey, getModel } from '../lib/settings.js'
import { explainMiss } from '../lib/tutor.js'
import { isCloze, clozeFront, clozeReveal } from '../lib/cloze.js'
import Icon from '../components/Icon.jsx'

// The tutor only sees text. Cloze cards flatten to a front/back pair; an
// image-occlusion card has nothing to ground on, so we don't offer the button.
function asText(card) {
  if (isCloze(card)) return { front: clozeFront(card.cloze), back: clozeReveal(card.cloze) }
  if (card.front && card.back) return { front: card.front, back: card.back }
  return null
}

// "Explain this" at the moment of a miss. Never fires on its own — each tap is
// an API call on the student's own key. See vault/Improvement-Proposals.md (P4).
export default function ExplainMiss({ kind, card, chosen, rotationName }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const hasKey = !!getApiKey()
  const text = kind === 'mcq' ? card : asText(card)

  async function run() {
    setBusy(true)
    setError('')
    try {
      setResult(await explainMiss({ apiKey: getApiKey(), model: getModel(), rotationName, kind, card: text, chosen }))
    } catch (e) {
      setError(e?.message || 'Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!text) return null

  if (result) {
    return (
      <div className="tutor-box">
        <span className="tutor-tag"><Icon name="sparkles" size={13} /> Tutor</span>
        <p><strong>Why it&apos;s {kind === 'mcq' ? 'the answer' : 'that'}:</strong> {result.correct}</p>
        <p><strong>{kind === 'mcq' ? 'Why yours isn’t:' : 'Easily confused with:'}</strong> {result.contrast}</p>
        <p className="tutor-hook"><Icon name="pin" size={14} /> {result.remember}</p>
      </div>
    )
  }

  return (
    <div className="tutor-cta">
      <button className="btn ghost" onClick={run} disabled={busy}>
        <Icon name="sparkles" size={15} /> {busy ? 'Thinking…' : 'Explain this'}
      </button>
      {!hasKey && !error && (
        <span className="muted tutor-hint">
          needs your <Link to="/settings">API key</Link>
        </span>
      )}
      {error && <span className="tutor-err">{error}</span>}
    </div>
  )
}
