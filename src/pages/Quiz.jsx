import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotationMerged, addMissCard } from '../lib/customContent.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { logAttempt } from '../lib/attempts.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Quiz() {
  const { rotationId } = useParams()
  const rotation = getRotationMerged(rotationId)
  const [best, setBest] = useLocalStorage(`quizbest:${rotationId}`, null)

  const [order, setOrder] = useState([])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [missMsg, setMissMsg] = useState('') // feedback when a wrong answer becomes a card
  const [missAdded, setMissAdded] = useState(0)

  const start = () => {
    setOrder(shuffle((rotation?.mcqs || []).map((_, i) => i)))
    setIdx(0)
    setPicked(null)
    setScore(0)
    setDone(false)
    setMissMsg('')
    setMissAdded(0)
  }

  useEffect(() => {
    if (rotation) start()
  }, [rotationId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const q = rotation.mcqs[order[idx]]
  const answered = picked !== null

  // Reset the per-question timer whenever a new question is shown.
  const shownAt = useRef(Date.now())
  useEffect(() => {
    shownAt.current = Date.now()
  }, [idx, order])

  const choose = (i) => {
    if (answered) return
    setPicked(i)
    logAttempt({
      rotation: rotation.id,
      kind: 'mcq',
      cardId: q.id || null,
      topic: q.topic || null,
      correct: i === q.answer,
      latencyMs: Date.now() - shownAt.current,
    })
    if (i === q.answer) {
      setScore((s) => s + 1)
    } else {
      // Missed it → turn this question into a flashcard, due now.
      const added = addMissCard(rotation.id, q)
      if (added) setMissAdded((n) => n + 1)
      setMissMsg(added ? 'Added to your flashcards for review' : 'Already in your flashcards')
    }
  }

  const next = () => {
    setMissMsg('')
    if (idx >= order.length - 1) {
      const finalScore = score
      const pct = Math.round((finalScore / order.length) * 100)
      if (best === null || pct > best) setBest(pct)
      setDone(true)
    } else {
      setIdx((i) => i + 1)
      setPicked(null)
    }
  }

  if (done) {
    const pct = Math.round((score / order.length) * 100)
    return (
      <div className="study-shell">
        <div className="card result-card">
          <div className="big">{pct}%</div>
          <h2>
            {score} / {order.length} correct
          </h2>
          <p className="muted">
            {pct >= 80 ? 'Strong — you’d hold your own on rounds.' : pct >= 50 ? 'Solid start — revisit the misses.' : 'Worth another pass through the notes and flashcards.'}
            {best !== null && ` · Best: ${best}%`}
          </p>
          {missAdded > 0 && (
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {missAdded} missed question{missAdded === 1 ? '' : 's'} added to your flashcards — due now.
            </p>
          )}
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 14 }}>
            <button className="btn primary" onClick={start}>
              Retake quiz
            </button>
            {missAdded > 0 && (
              <Link className="btn" to={`/r/${rotation.id}/flashcards`}>
                Review the misses
              </Link>
            )}
            <Link className="btn" to={`/r/${rotation.id}`}>
              Back to {rotation.name}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — Quiz</h1>
        <p className="sub">One best answer. You’ll get an explanation after each question.</p>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${order.length ? ((idx + 1) / order.length) * 100 : 0}%` }} />
      </div>

      {q && (
        <div className="card">
          <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>
            Question {idx + 1} of {order.length} · Score {score}
          </div>
          {q.topic && <span className="pill" style={{ marginBottom: 10, display: 'inline-block' }}>{q.topic}</span>}
          <p className="viva-q" style={{ fontSize: '1.1rem' }}>{q.question}</p>

          <div style={{ marginTop: 14 }}>
            {q.options.map((opt, i) => {
              let cls = 'option'
              if (answered) {
                if (i === q.answer) cls += ' correct'
                else if (i === picked) cls += ' wrong'
                else cls += ' dim'
              }
              return (
                <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
                  <span className="key">{KEYS[i]}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="explain">
              <strong>{picked === q.answer ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
              {missMsg && (
                <div style={{ marginTop: 8, color: 'var(--primary)', fontWeight: 600 }}>{missMsg}</div>
              )}
            </div>
          )}

          {answered && (
            <button className="btn primary block" style={{ marginTop: 16 }} onClick={next}>
              {idx >= order.length - 1 ? 'See results' : 'Next question →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
