import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { appendCustom } from '../lib/customContent.js'

// Parse Anki/CSV-style lines into flashcards. Each non-empty line: front <delim> back.
function parseCards(text, delim, topic) {
  const sep = delim === 'comma' ? ',' : '\t'
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(sep)
      if (idx === -1) return null
      const front = line.slice(0, idx).trim()
      const back = line.slice(idx + 1).trim()
      if (!front || !back) return null
      return { front, back, topic: topic || 'Imported' }
    })
    .filter(Boolean)
}

export default function Import() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  const [tab, setTab] = useState('cards')
  // Card text import
  const [text, setText] = useState('')
  const [delim, setDelim] = useState('tab')
  const [topic, setTopic] = useState('')
  // JSON import
  const [jsonKind, setJsonKind] = useState('flashcards')
  const [json, setJson] = useState('')

  const [error, setError] = useState('')
  const [done, setDone] = useState(0)

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const importCards = () => {
    setError('')
    setDone(0)
    const cards = parseCards(text, delim, topic.trim())
    if (!cards.length) {
      setError('No valid rows found. Each line needs a front and back separated by the chosen delimiter.')
      return
    }
    appendCustom(rotation.id, 'flashcards', cards)
    setDone(cards.length)
    setText('')
  }

  const importJson = () => {
    setError('')
    setDone(0)
    let arr
    try {
      arr = JSON.parse(json)
    } catch {
      setError('That isn’t valid JSON.')
      return
    }
    if (!Array.isArray(arr) || !arr.length) {
      setError('Expected a non-empty JSON array of objects.')
      return
    }
    // Light validation per kind.
    const valid = arr.filter((it) => {
      if (jsonKind === 'flashcards') return it.front && it.back
      if (jsonKind === 'viva') return it.question && it.answer
      if (jsonKind === 'mcqs') return it.question && Array.isArray(it.options) && typeof it.answer === 'number'
      return false
    })
    if (!valid.length) {
      setError('No items matched the expected shape for ' + jsonKind + '.')
      return
    }
    appendCustom(rotation.id, jsonKind, valid)
    setDone(valid.length)
    setJson('')
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>📥 {rotation.name} — Import</h1>
        <p className="sub">Bring in your own cards from Anki exports, spreadsheets, or JSON.</p>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        <button className={`btn ${tab === 'cards' ? 'primary' : 'ghost'}`} onClick={() => setTab('cards')}>
          Flashcards (text)
        </button>
        <button className={`btn ${tab === 'json' ? 'primary' : 'ghost'}`} onClick={() => setTab('json')}>
          JSON (advanced)
        </button>
      </div>

      {tab === 'cards' ? (
        <div className="card">
          <p className="muted" style={{ marginTop: 0, fontSize: '0.88rem' }}>
            Paste one card per line as <code>front{delim === 'comma' ? ',' : ' [Tab] '}back</code>. Anki’s
            “Notes in Plain Text (.txt)” export is tab-separated and pastes straight in.
          </p>

          <label className="section-title">Delimiter</label>
          <div className="btn-row">
            <button className={`btn ${delim === 'tab' ? 'primary' : 'ghost'}`} onClick={() => setDelim('tab')}>
              Tab
            </button>
            <button className={`btn ${delim === 'comma' ? 'primary' : 'ghost'}`} onClick={() => setDelim('comma')}>
              Comma
            </button>
          </div>

          <label className="section-title" htmlFor="topic">Topic label (optional)</label>
          <input id="topic" className="text-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Imported" />

          <label className="section-title" htmlFor="cardtext">Cards</label>
          <textarea
            id="cardtext"
            className="text-input"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={delim === 'comma' ? 'What is CURB-65?,Confusion, Urea...' : 'What is CURB-65?\tConfusion, Urea, RR, BP, age ≥65'}
          />

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={importCards}>Import cards</button>
            <Link className="btn ghost" to={`/r/${rotation.id}`}>Back to {rotation.name}</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="muted" style={{ marginTop: 0, fontSize: '0.88rem' }}>
            Paste a JSON array. Flashcards: <code>{'{ front, back, topic? }'}</code>. Viva:{' '}
            <code>{'{ question, answer, topic? }'}</code>. MCQs:{' '}
            <code>{'{ question, options[], answer (index), explanation, topic? }'}</code>.
          </p>

          <label className="section-title">Kind</label>
          <select className="text-input" value={jsonKind} onChange={(e) => setJsonKind(e.target.value)}>
            <option value="flashcards">Flashcards</option>
            <option value="viva">Viva questions</option>
            <option value="mcqs">MCQs</option>
          </select>

          <label className="section-title" htmlFor="jsontext">JSON</label>
          <textarea
            id="jsontext"
            className="text-input"
            rows={8}
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder='[{ "front": "...", "back": "...", "topic": "..." }]'
          />

          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={importJson}>Import JSON</button>
            <Link className="btn ghost" to={`/r/${rotation.id}`}>Back to {rotation.name}</Link>
          </div>
        </div>
      )}

      {error && (
        <div className="explain" style={{ marginTop: 14, borderColor: 'var(--danger)' }}>{error}</div>
      )}
      {done > 0 && (
        <div className="explain" style={{ marginTop: 14, borderColor: 'var(--good)' }}>
          <strong>Imported {done} item{done === 1 ? '' : 's'}.</strong> They’re now in your{' '}
          {tab === 'cards' ? 'flashcards' : jsonKind === 'mcqs' ? 'quiz' : jsonKind}.
        </div>
      )}
    </div>
  )
}
