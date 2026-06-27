import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { getApiKey, getModel } from '../lib/settings.js'
import { generateItems } from '../lib/generate.js'
import { appendCustom } from '../lib/customContent.js'

const KINDS = [
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'viva', label: 'Viva questions' },
  { id: 'mcqs', label: 'MCQs' },
]

export default function Generate() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  const [kind, setKind] = useState('flashcards')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [added, setAdded] = useState(false)

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const hasKey = !!getApiKey()

  const run = async () => {
    setError('')
    setResults(null)
    setAdded(false)
    setLoading(true)
    try {
      const items = await generateItems({
        apiKey: getApiKey(),
        model: getModel(),
        rotationName: rotation.name,
        topic: topic.trim(),
        kind,
        count: Number(count),
      })
      setResults(items)
    } catch (e) {
      setError(e?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const addToDeck = () => {
    appendCustom(rotation.id, kind, results)
    setAdded(true)
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>✨ {rotation.name} — AI Generate</h1>
        <p className="sub">Create fresh questions on demand, then save them into your deck.</p>
      </div>

      {!hasKey && (
        <div className="explain" style={{ marginBottom: 16 }}>
          <strong>No API key set.</strong> Add your Anthropic API key in{' '}
          <Link to="/settings" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Settings
          </Link>{' '}
          to use AI generation.
        </div>
      )}

      <div className="card">
        <label className="section-title" style={{ marginTop: 0 }}>What to generate</label>
        <div className="btn-row">
          {KINDS.map((k) => (
            <button
              key={k.id}
              className={`btn ${kind === k.id ? 'primary' : 'ghost'}`}
              onClick={() => setKind(k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>

        <label className="section-title" htmlFor="topic">Topic (optional)</label>
        <input
          id="topic"
          className="text-input"
          placeholder={`e.g. ${rotation.notes[0]?.title || 'a high-yield topic'}`}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <label className="section-title" htmlFor="count">How many</label>
        <select id="count" className="text-input" value={count} onChange={(e) => setCount(e.target.value)}>
          {[3, 5, 8, 10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn primary" onClick={run} disabled={!hasKey || loading}>
            {loading ? 'Generating…' : 'Generate'}
          </button>
          <Link className="btn ghost" to={`/r/${rotation.id}`}>
            Back to {rotation.name}
          </Link>
        </div>

        {error && (
          <div className="explain" style={{ marginTop: 14, borderColor: 'var(--danger)' }}>
            {error}
          </div>
        )}
      </div>

      {results && (
        <>
          <div className="section-title">Preview ({results.length})</div>
          {results.map((it, i) => (
            <div key={i} className="card" style={{ marginBottom: 10 }}>
              {it.topic && <span className="pill" style={{ marginBottom: 6, display: 'inline-block' }}>{it.topic}</span>}
              {kind === 'flashcards' && (
                <>
                  <p style={{ fontWeight: 700, margin: '0 0 6px' }}>{it.front}</p>
                  <p className="muted" style={{ margin: 0 }}>{it.back}</p>
                </>
              )}
              {kind === 'viva' && (
                <>
                  <p style={{ fontWeight: 700, margin: '0 0 6px' }}>{it.question}</p>
                  <p className="muted" style={{ margin: 0 }}>{it.answer}</p>
                </>
              )}
              {kind === 'mcqs' && (
                <>
                  <p style={{ fontWeight: 700, margin: '0 0 6px' }}>{it.question}</p>
                  <ol type="A" style={{ margin: '0 0 6px', paddingLeft: 20 }}>
                    {it.options?.map((o, j) => (
                      <li key={j} style={{ fontWeight: j === it.answer ? 700 : 400, color: j === it.answer ? 'var(--good)' : 'inherit' }}>
                        {o}
                      </li>
                    ))}
                  </ol>
                  <p className="muted" style={{ margin: 0 }}>{it.explanation}</p>
                </>
              )}
            </div>
          ))}

          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 8 }}>
            {added ? (
              <Link className="btn primary" to={`/r/${rotation.id}/${kind === 'mcqs' ? 'quiz' : kind}`}>
                Added ✓ — study them
              </Link>
            ) : (
              <button className="btn primary" onClick={addToDeck}>
                Add {results.length} to my {kind === 'mcqs' ? 'quiz' : kind}
              </button>
            )}
            <button className="btn ghost" onClick={run} disabled={loading}>
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  )
}
