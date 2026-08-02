import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { collectDue, orderForFocus, hasFocusData } from '../lib/studyQueue.js'
import { readStored, writeStored } from '../lib/useLocalStorage.js'
import { review } from '../lib/srs.js'
import { noteIntroduced } from '../lib/scheduler.js'
import CardFace from '../components/CardFace.jsx'

// One session across every rotation: all due cards, graded back into each
// rotation's own spaced-repetition schedule.
export default function StudyToday() {
  const [queue, setQueue] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setQueue(orderForFocus(collectDue()))
    setFocused(hasFocusData())
    setLoaded(true)
  }, [])

  const current = queue[0] || null

  const grade = (g) => {
    if (!current) return
    const key = `srs:${current.rotationId}`
    const map = readStored(key, {})
    if (!map[current.card.id]) noteIntroduced(current.rotationId) // first time seen → today's new budget
    map[current.card.id] = review(map[current.card.id], g)
    writeStored(key, map)
    setReviewed((n) => n + 1)
    setFlipped(false)
    setQueue((q) => {
      const rest = q.slice(1)
      // 'again' re-queues the card near the end of this session.
      return g === 'again' ? [...rest, current] : rest
    })
  }

  // Keyboard shortcuts (same as the per-rotation deck).
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

  const total = reviewed + queue.length
  const pct = total ? Math.round((reviewed / total) * 100) : 0

  const perRotation = useMemo(() => {
    const m = new Map()
    for (const e of queue) m.set(e.emoji + ' ' + e.rotationName, (m.get(e.emoji + ' ' + e.rotationName) || 0) + 1)
    return [...m.entries()]
  }, [queue])

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>▶ Study due</h1>
        <p className="sub">
          Every card that’s due right now, across all rotations.
          {focused && ' Ordered so your weak topics and soonest exams come first.'}
        </p>
      </div>

      {current ? (
        <>
          <div className="progress-bar">
            <span style={{ width: `${pct}%` }} />
          </div>

          <div className="flashcard" onClick={() => setFlipped((f) => !f)} role="button" tabIndex={0}>
            <span className="face-label">{flipped ? 'Answer' : 'Question'}</span>
            <span className="topic-chip">
              {current.emoji} {current.card.topic || current.rotationName}
            </span>
            <CardFace card={current.card} flipped={flipped} />
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
          <h2>{loaded && reviewed > 0 ? 'Session complete' : 'All caught up!'}</h2>
          <p className="muted">
            {reviewed > 0
              ? `You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'} across your rotations.`
              : 'Nothing is due right now — spaced repetition will bring cards back when it’s time.'}
          </p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 14 }}>
            <Link className="btn primary" to="/">
              Back home
            </Link>
          </div>
        </div>
      )}

      {current && perRotation.length > 1 && (
        <p className="kbd-hint">
          Left in queue: {perRotation.map(([name, n]) => `${name} (${n})`).join(' · ')}
        </p>
      )}
    </div>
  )
}
