import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { appendCustom } from '../lib/customContent.js'
import { normaliseCloze } from '../lib/cloze.js'

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
  // Cloze text import
  const [clozeText, setClozeText] = useState('')
  const [clozeTopic, setClozeTopic] = useState('')
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

  const validFor = (kind) => (it) => {
    if (kind === 'flashcards') return (it.front && it.back) || it.cloze || (it.type === 'io' && it.image)
    if (kind === 'viva') return it.question && it.answer
    if (kind === 'mcqs') return it.question && Array.isArray(it.options) && typeof it.answer === 'number'
    return false
  }

  const importCloze = () => {
    setError('')
    setDone(0)
    const items = clozeText
      .split('\n')
      .map((l) => normaliseCloze(l))
      .filter(Boolean)
      .map((cloze) => ({ cloze, topic: clozeTopic.trim() || 'Cloze' }))
    if (!items.length) {
      setError('No cloze deletions found. Wrap the hidden text in {{double braces}} on each line.')
      return
    }
    appendCustom(rotation.id, 'flashcards', items)
    setDone(items.length)
    setClozeText('')
  }

  // Import a parsed value: an object with flashcards/viva/mcqs arrays imports all
  // kinds at once; a bare array uses the currently-selected kind. Returns count.
  const importParsed = (data) => {
    let n = 0
    if (data && !Array.isArray(data) && (data.flashcards || data.viva || data.mcqs)) {
      for (const kind of ['flashcards', 'viva', 'mcqs']) {
        const arr = Array.isArray(data[kind]) ? data[kind].filter(validFor(kind)) : []
        if (arr.length) {
          appendCustom(rotation.id, kind, arr)
          n += arr.length
        }
      }
    } else if (Array.isArray(data)) {
      const valid = data.filter(validFor(jsonKind))
      if (valid.length) {
        appendCustom(rotation.id, jsonKind, valid)
        n += valid.length
      }
    }
    return n
  }

  const importJson = () => {
    setError('')
    setDone(0)
    let data
    try {
      data = JSON.parse(json)
    } catch {
      setError('That isn’t valid JSON.')
      return
    }
    const n = importParsed(data)
    if (!n) {
      setError('No items matched the expected shape. Check the format above.')
      return
    }
    setDone(n)
    setJson('')
  }

  const onJsonFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setDone(0)
    const reader = new FileReader()
    reader.onload = () => {
      let data
      try {
        data = JSON.parse(String(reader.result || ''))
      } catch {
        setError('That file isn’t valid JSON.')
        return
      }
      const n = importParsed(data)
      if (!n) setError('No importable flashcards/viva/MCQs found in that file.')
      else setDone(n)
    }
    reader.readAsText(file)
    e.target.value = '' // allow re-selecting the same file
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — Import</h1>
        <p className="sub">Bring in your own cards from Anki exports, spreadsheets, or JSON.</p>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        <button className={`btn ${tab === 'cards' ? 'primary' : 'ghost'}`} onClick={() => setTab('cards')}>
          Flashcards (text)
        </button>
        <button className={`btn ${tab === 'cloze' ? 'primary' : 'ghost'}`} onClick={() => setTab('cloze')}>
          Cloze (text)
        </button>
        <button className={`btn ${tab === 'json' ? 'primary' : 'ghost'}`} onClick={() => setTab('json')}>
          JSON (advanced)
        </button>
      </div>

      {tab === 'cloze' ? (
        <div className="card">
          <p className="muted" style={{ marginTop: 0, fontSize: '0.88rem' }}>
            One cloze card per line. Wrap the hidden part in <code>{'{{double braces}}'}</code> — e.g.{' '}
            <code>{'First-line for eclampsia is {{magnesium sulfate}}.'}</code>. You can hide several parts per
            line, and Anki-style <code>{'{{c1::…}}'}</code> also works.
          </p>
          <label className="section-title">Topic label (optional)</label>
          <input className="text-input" value={clozeTopic} onChange={(e) => setClozeTopic(e.target.value)} placeholder="Cloze" />
          <label className="section-title" htmlFor="clozetext">Cloze lines</label>
          <textarea
            id="clozetext"
            className="text-input"
            rows={8}
            value={clozeText}
            onChange={(e) => setClozeText(e.target.value)}
            placeholder={'The antidote for {{acetaminophen}} overdose is {{N-acetylcysteine}}.'}
          />
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={importCloze}>Import cloze cards</button>
            <Link className="btn ghost" to={`/r/${rotation.id}`}>Back to {rotation.name}</Link>
          </div>
        </div>
      ) : tab === 'cards' ? (
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
          <label className="section-title" style={{ marginTop: 0 }}>Load a file</label>
          <p className="muted" style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>
            Pick a <code>.json</code> file (e.g. a Montis deck file). A file with{' '}
            <code>flashcards</code>/<code>viva</code>/<code>mcqs</code> arrays imports everything at once.
          </p>
          <input type="file" accept=".json,application/json" onChange={onJsonFile} className="text-input" />

          <p className="muted" style={{ margin: '14px 0 6px', fontSize: '0.88rem' }}>
            …or paste JSON. A bare array uses the Kind below. Flashcards:{' '}
            <code>{'{ front, back, topic? }'}</code>. Viva: <code>{'{ question, answer, topic? }'}</code>. MCQs:{' '}
            <code>{'{ question, options[], answer (index), explanation, topic? }'}</code>.
          </p>

          <label className="section-title">Kind (for a pasted bare array)</label>
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
