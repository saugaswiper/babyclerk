import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotationMerged } from '../lib/customContent.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { review } from '../lib/srs.js'
import { sessionFor, noteIntroduced } from '../lib/scheduler.js'
import CardFace from '../components/CardFace.jsx'

export default function Flashcards() {
  const { rotationId } = useParams()
  const rotation = getRotationMerged(rotationId)
  const [srs, setSrs] = useLocalStorage(`srs:${rotationId}`, {})

  // Build the session queue once on mount: due/new cards first.
  const [queue, setQueue] = useState([])
  const [mode, setMode] = useState('due') // 'due' | 'all'
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  const buildQueue = (which) => {
    if (!rotation) return []
    // 'all' ignores the daily budget (explicit "review everything"); 'due' applies it.
    const list = which === 'all' ? rotation.flashcards : sessionFor(rotation.flashcards, srs, rotationId).all
    return list.map((c) => c.id)
  }

  // Initialise queue on first render (due cards).
  useEffect(() => {
    if (rotation) setQueue(buildQueue('due'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotationId])

  const current = useMemo(
    () => (queue.length ? rotation?.flashcards.find((c) => c.id === queue[0]) : null),
    [queue, rotation]
  )

  const grade = (g) => {
    if (!current) return
    if (!srs[current.id]) noteIntroduced(rotationId) // first time seen → counts against today's new budget
    setSrs((prev) => ({ ...prev, [current.id]: review(prev[current.id], g) }))
    setReviewed((n) => n + 1)
    setFlipped(false)
    setQueue((q) => {
      const rest = q.slice(1)
      // 'again' re-queues the card near the end of this session.
      return g === 'again' ? [...rest, current.id] : rest
    })
  }

  const startSession = (which) => {
    setMode(which)
    setQueue(buildQueue(which))
    setReviewed(0)
    setFlipped(false)
  }

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      if (!current) return
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped) {
        if (e.key === '1') grade('again')
        if (e.key === '2') grade('hard')
        if (e.key === '3') grade('good')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, flipped])

  if (!rotation) return <NotFound />

  const total = reviewed + queue.length
  const pct = total ? Math.round((reviewed / total) * 100) : 0

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>🃏 {rotation.name} — Flashcards</h1>
        <p className="sub">Tap the card to reveal the answer, then rate how well you knew it.</p>
      </div>

      {current ? (
        <>
          <div className="progress-bar">
            <span style={{ width: `${pct}%` }} />
          </div>

          <div
            className="flashcard"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
          >
            <span className="face-label">{flipped ? 'Answer' : 'Question'}</span>
            {current.topic && <span className="topic-chip">{current.topic}</span>}
            <CardFace card={current} flipped={flipped} />
            {!flipped && <div className="hint">Tap or press Space to flip</div>}
          </div>

          {flipped ? (
            <div className="rate-row">
              <button className="btn again" onClick={() => grade('again')}>
                Again <small>&lt;10 min</small>
              </button>
              <button className="btn hard" onClick={() => grade('hard')}>
                Hard <small>shorter</small>
              </button>
              <button className="btn good" onClick={() => grade('good')}>
                Good <small>longer</small>
              </button>
            </div>
          ) : (
            <div className="btn-row" style={{ marginTop: 16, justifyContent: 'center' }}>
              <button className="btn primary" onClick={() => setFlipped(true)}>
                Reveal answer
              </button>
            </div>
          )}

          <p className="kbd-hint">
            <kbd>Space</kbd> flip · <kbd>1</kbd> again · <kbd>2</kbd> hard · <kbd>3</kbd> good ·{' '}
            {reviewed} reviewed, {queue.length} left
          </p>
        </>
      ) : (
        <div className="card result-card">
          <div className="big">✓</div>
          <h2>{mode === 'due' ? 'All caught up!' : 'Deck complete'}</h2>
          <p className="muted">
            {reviewed > 0
              ? `You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'} this session.`
              : 'No cards are due right now — spaced repetition will bring them back when it’s time.'}
          </p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 14 }}>
            <button className="btn primary" onClick={() => startSession('all')}>
              Review all cards
            </button>
            <Link className="btn" to={`/r/${rotation.id}`}>
              Back to {rotation.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function NotFound() {
  return (
    <div className="empty">
      <p>Rotation not found.</p>
      <Link className="btn" to="/">Back to rotations</Link>
    </div>
  )
}
