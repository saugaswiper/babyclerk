import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Viva() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  const [order, setOrder] = useState([])
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (rotation) setOrder(rotation.viva.map((_, i) => i))
  }, [rotationId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const q = rotation.viva[order[idx]]
  const atEnd = idx >= order.length - 1

  const next = () => {
    setRevealed(false)
    setIdx((i) => Math.min(i + 1, order.length - 1))
  }
  const prev = () => {
    setRevealed(false)
    setIdx((i) => Math.max(i - 1, 0))
  }
  const reshuffle = () => {
    setOrder(shuffle(rotation.viva.map((_, i) => i)))
    setIdx(0)
    setRevealed(false)
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>🗣️ {rotation.name} — Viva Drills</h1>
        <p className="sub">Answer out loud as if your tutor just asked you, then reveal the model answer.</p>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${order.length ? ((idx + 1) / order.length) * 100 : 0}%` }} />
      </div>

      {q && (
        <div className="card">
          {q.topic && <span className="pill" style={{ marginBottom: 8, display: 'inline-block' }}>{q.topic}</span>}
          <p className="viva-q">{q.question}</p>

          {revealed ? (
            <div className="viva-a">
              <p>{q.answer}</p>
            </div>
          ) : (
            <button className="btn primary block" style={{ marginTop: 12 }} onClick={() => setRevealed(true)}>
              Reveal model answer
            </button>
          )}

          <div className="btn-row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
            <button className="btn ghost" onClick={prev} disabled={idx === 0}>
              ← Previous
            </button>
            <span className="muted" style={{ alignSelf: 'center' }}>
              {idx + 1} / {order.length}
            </span>
            {atEnd ? (
              <button className="btn" onClick={reshuffle}>
                Shuffle ↺
              </button>
            ) : (
              <button className="btn primary" onClick={next}>
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
        <button className="btn ghost" onClick={reshuffle}>
          Shuffle questions
        </button>
        <Link className="btn ghost" to={`/r/${rotation.id}`}>
          Back to {rotation.name}
        </Link>
      </div>
    </div>
  )
}
