import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { getApiKey, getModel } from '../lib/settings.js'
import { generateFromMaterial, chunkSource } from '../lib/generate.js'
import { appendCustom, privateSummary, removeMaterial } from '../lib/customContent.js'
import GeneratedItem from '../components/GeneratedItem.jsx'
import Icon from '../components/Icon.jsx'

const KINDS = [
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'cloze', label: 'Cloze' },
  { id: 'viva', label: 'Viva questions' },
  { id: 'mcqs', label: 'MCQs' },
]

const DENSITY = [
  { n: 4, label: 'Light', hint: 'the essentials only' },
  { n: 7, label: 'Standard', hint: 'a solid pass', recommended: true },
  { n: 12, label: 'Thorough', hint: 'exam-level detail' },
]

const bucketFor = (kind) => (kind === 'cloze' ? 'flashcards' : kind)

export default function Material() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  const [kind, setKind] = useState('flashcards')
  const [perChunk, setPerChunk] = useState(7)
  const [sourceName, setSourceName] = useState('')
  const [source, setSource] = useState('')
  const [progress, setProgress] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [existing, setExisting] = useState(() => (rotation ? privateSummary(rotation.id) : null))

  const chunks = useMemo(() => chunkSource(source), [source])
  const hasKey = !!getApiKey()

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  async function run() {
    setError('')
    setResult(null)
    setAdded(false)
    setProgress({ index: 0, total: chunks.length, items: 0 })
    try {
      const out = await generateFromMaterial({
        apiKey: getApiKey(),
        model: getModel(),
        rotationName: rotation.name,
        kind,
        source,
        sourceName: sourceName.trim(),
        perChunk,
        onProgress: setProgress,
      })
      setResult(out)
    } catch (e) {
      setError(e?.message || 'Something went wrong.')
    } finally {
      setProgress(null)
    }
  }

  function addToDeck() {
    appendCustom(rotation.id, bucketFor(kind), result.items)
    setAdded(true)
    setExisting(privateSummary(rotation.id))
  }

  function drop(name) {
    removeMaterial(rotation.id, name)
    setExisting(privateSummary(rotation.id))
  }

  const running = !!progress

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — study from your own material</h1>
        <p className="sub">
          Paste a chapter, your lecture notes, or a guideline. BabyClerk splits it into sections and
          builds cards from each one — in its own words, tied back to where they came from.
        </p>
      </div>

      <div className="card notice-private">
        <h3><Icon name="user" size={17} /> These cards stay yours</h3>
        <p>
          Use this with material you legally hold — a textbook you bought, your own notes, your school&apos;s
          slides. Everything generated here is marked <strong>private</strong>: it lives in this browser and
          your own account, it is never bundled into the app, and it will never be included if you share a
          deck with classmates. Don&apos;t paste anything you aren&apos;t allowed to have.
        </p>
      </div>

      {!hasKey && (
        <div className="explain" style={{ marginBottom: 16 }}>
          <strong>No API key set.</strong> Add your Anthropic API key in{' '}
          <Link to="/settings" style={{ color: 'var(--primary)', fontWeight: 700 }}>Settings</Link>{' '}
          to generate from your material.
        </div>
      )}

      <div className="card">
        <label className="section-title" style={{ marginTop: 0 }} htmlFor="matname">
          What is this material?
        </label>
        <input
          id="matname"
          className="text-input"
          placeholder="e.g. Toronto Notes — Obstetrics, or Week 3 lecture slides"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
        />
        <p className="muted" style={{ fontSize: '0.8rem', marginTop: 6 }}>
          Cards are labelled with this, so you can find or remove them all later.
        </p>

        <label className="section-title" htmlFor="mattext">Paste the text</label>
        <textarea
          id="mattext"
          className="text-input"
          placeholder="Paste a chapter or section here — long is fine, it gets split automatically…"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          rows={10}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        {chunks.length > 0 && (
          <p className="muted" style={{ fontSize: '0.8rem', marginTop: 6 }}>
            {source.trim().length.toLocaleString()} characters · <strong>{chunks.length} section
            {chunks.length === 1 ? '' : 's'}</strong> · about {chunks.length * perChunk} cards ·{' '}
            {chunks.length} API {chunks.length === 1 ? 'call' : 'calls'} on your key
          </p>
        )}

        <label className="section-title">Card type</label>
        <div className="btn-row">
          {KINDS.map((k) => (
            <button key={k.id} className={`btn ${kind === k.id ? 'primary' : 'ghost'}`} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>

        <label className="section-title">How deep per section</label>
        <div className="btn-row">
          {DENSITY.map((d) => (
            <button key={d.n} className={`btn ${perChunk === d.n ? 'primary' : 'ghost'}`} onClick={() => setPerChunk(d.n)}>
              {d.label} <small style={{ opacity: 0.75 }}>· {d.n}</small>
            </button>
          ))}
        </div>

        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn primary" onClick={run} disabled={!hasKey || running || !chunks.length}>
            {running ? 'Generating…' : `Generate from ${chunks.length || 0} section${chunks.length === 1 ? '' : 's'}`}
          </button>
          <Link className="btn ghost" to={`/r/${rotation.id}`}>Back to {rotation.name}</Link>
        </div>

        {progress && (
          <div style={{ marginTop: 16 }}>
            <div className="progress-bar">
              <span style={{ width: `${progress.total ? (progress.index / progress.total) * 100 : 0}%` }} />
            </div>
            <p className="muted" style={{ fontSize: '0.82rem', marginTop: 8 }}>
              Section {Math.min(progress.index + 1, progress.total)} of {progress.total} · {progress.items} cards so far
            </p>
          </div>
        )}

        {error && (
          <div className="explain" style={{ marginTop: 14, borderColor: 'var(--danger)' }}>{error}</div>
        )}
      </div>

      {existing?.count > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <label className="section-title" style={{ marginTop: 0 }}>Your private material here</label>
          <p className="muted" style={{ fontSize: '0.85rem', margin: '0 0 10px' }}>
            {existing.count} private card{existing.count === 1 ? '' : 's'} in {rotation.name}.
          </p>
          {existing.sources.map((s) => (
            <div key={s} className="mat-row">
              <span>{s}</span>
              <button className="linklike" onClick={() => drop(s)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {result && (
        <>
          <div className="section-title">
            Preview ({result.items.length} from {result.chunks} section{result.chunks === 1 ? '' : 's'})
          </div>
          {result.failures.length > 0 && (
            <div className="explain" style={{ marginBottom: 12 }}>
              {result.failures.length} section{result.failures.length === 1 ? '' : 's'} couldn&apos;t be
              processed ({result.failures.map((f) => `#${f.index}`).join(', ')}) — the rest came through fine.
            </div>
          )}
          {result.items.map((it, i) => (
            <GeneratedItem key={i} kind={kind} item={it} />
          ))}

          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 8 }}>
            {added ? (
              <Link className="btn primary" to={`/r/${rotation.id}/${kind === 'mcqs' ? 'quiz' : bucketFor(kind)}`}>
                Added — study them
              </Link>
            ) : (
              <button className="btn primary" onClick={addToDeck}>
                Add {result.items.length} private card{result.items.length === 1 ? '' : 's'} to my deck
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
