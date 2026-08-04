import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { rotations } from '../data/rotations/index.js'
import { getRotationMerged } from '../lib/customContent.js'
import { isCloze, clozeReveal } from '../lib/cloze.js'

const MAX_RESULTS = 60

// Build a flat searchable index of everything (built-in + imported/AI content).
function buildIndex() {
  const items = []
  for (const r of rotations) {
    const m = getRotationMerged(r.id)
    for (const c of m.flashcards) {
      let title, body
      if (c.type === 'io') { title = `${c.topic || 'Image'} (image occlusion)`; body = c.back || '' }
      else if (isCloze(c)) { title = clozeReveal(c.cloze); body = '' }
      else { title = c.front; body = c.back }
      items.push({
        kind: 'Flashcard', emoji: r.emoji, rotationName: r.name,
        title, body, topic: c.topic,
        link: `/r/${r.id}/flashcards`,
        text: `${title}\n${body}\n${c.topic || ''}`.toLowerCase(),
      })
    }
    for (const v of m.viva) {
      items.push({
        kind: 'Viva', emoji: r.emoji, rotationName: r.name,
        title: v.question, body: v.answer, topic: v.topic,
        link: `/r/${r.id}/viva`,
        text: `${v.question}\n${v.answer}\n${v.topic || ''}`.toLowerCase(),
      })
    }
    for (const q of m.mcqs) {
      items.push({
        kind: 'MCQ', emoji: r.emoji, rotationName: r.name,
        title: q.question, body: q.explanation, topic: q.topic,
        link: `/r/${r.id}/quiz`,
        text: `${q.question}\n${(q.options || []).join('\n')}\n${q.explanation || ''}\n${q.topic || ''}`.toLowerCase(),
      })
    }
    for (const n of m.notes) {
      const body = n.sections.map((s) => `${s.heading}: ${s.points.join(' · ')}`).join('\n')
      items.push({
        kind: 'Note', emoji: r.emoji, rotationName: r.name,
        title: n.title, body, topic: n.topic,
        link: `/r/${r.id}/notes`,
        text: `${n.title}\n${body}\n${n.topic || ''}`.toLowerCase(),
      })
    }
  }
  return items
}

export default function Search() {
  const [query, setQuery] = useState('')
  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const tokens = q.split(/\s+/)
    const scored = []
    for (const item of index) {
      if (!tokens.every((t) => item.text.includes(t))) continue
      // Rank title matches above body-only matches.
      const titleHit = tokens.every((t) => item.title.toLowerCase().includes(t))
      scored.push({ item, score: titleHit ? 2 : 1 })
      if (scored.length >= MAX_RESULTS * 3) break
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, MAX_RESULTS).map((s) => s.item)
  }, [query, index])

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>Search</h1>
        <p className="sub">Look anything up fast — every card, viva question, MCQ, and note.</p>
      </div>

      <input
        className="text-input"
        placeholder="e.g. hyperkalemia, Form 1, CURB-65…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {query.trim().length >= 2 && (
        <p className="muted" style={{ fontSize: '0.82rem', margin: '8px 2px' }}>
          {results.length === 0
            ? 'No matches.'
            : `${results.length}${results.length === MAX_RESULTS ? '+' : ''} result${results.length === 1 ? '' : 's'}`}
        </p>
      )}

      {results.map((r, i) => (
        <Link key={i} to={r.link} className="card" style={{ display: 'block', marginBottom: 10 }}>
          <div className="tile-stat" style={{ marginTop: 0, marginBottom: 6 }}>
            <span className="pill">{r.kind}</span>
            <span>
              {r.emoji} {r.rotationName}
            </span>
            {r.topic && <span>{r.topic}</span>}
          </div>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>{r.title}</p>
          {r.body && (
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem', whiteSpace: 'pre-line' }}>
              {r.body.length > 300 ? r.body.slice(0, 300) + '…' : r.body}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
