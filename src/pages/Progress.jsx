import { Link } from 'react-router-dom'
import { rotations, getRotation } from '../data/rotations/index.js'
import { getAttempts, summarize, weakestTopics } from '../lib/attempts.js'

function pct(correct, n) {
  return n ? Math.round((correct / n) * 100) : 0
}
function accColor(p) {
  if (p >= 80) return 'var(--primary)'
  if (p >= 60) return 'var(--warning, #d97706)'
  return 'var(--danger)'
}
function rotationName(id) {
  return getRotation(id)?.name || id
}

export default function Progress() {
  const attempts = getAttempts()
  const { byRotation, total } = summarize(attempts)
  const weak = weakestTopics(attempts, { min: 3, limit: 8 })

  const overallCorrect = attempts.reduce((n, a) => n + (a.correct ? 1 : 0), 0)
  const overallPct = pct(overallCorrect, total)

  // Rotations in their canonical order, only those with attempts.
  const rows = rotations
    .map((r) => ({ id: r.id, name: r.name, emoji: r.emoji, e: byRotation[r.id] }))
    .filter((r) => r.e && r.e.n > 0)

  if (total === 0) {
    return (
      <div className="study-shell">
        <div className="page-head">
          <h1>📈 Your progress</h1>
          <p className="sub">Answer some flashcards and quizzes and this page fills in — it tracks how you do per rotation and surfaces your weakest topics so you know exactly where to focus.</p>
        </div>
        <div className="card result-card">
          <div className="big">🌱</div>
          <h2>Nothing tracked yet</h2>
          <p className="muted">Start a flashcard session or a quiz and come back.</p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 14 }}>
            <Link className="btn primary" to="/study">Study due now</Link>
            <Link className="btn" to="/">Pick a rotation</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>📈 Your progress</h1>
        <p className="sub">Based on {total} answered question{total === 1 ? '' : 's'}. This is the data your future weak-area coaching will run on.</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 800, color: accColor(overallPct) }}>{overallPct}%</span>
          <span className="muted">overall accuracy · {overallCorrect}/{total} correct</span>
        </div>
      </div>

      {weak.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <label className="section-title" style={{ marginTop: 0 }}>🎯 Focus here — your weakest topics</label>
          <ul className="weak-list">
            {weak.map((t) => (
              <li key={`${t.rotation}-${t.topic}`}>
                <Link to={`/r/${t.rotation}/flashcards`} className="weak-item">
                  <span className="weak-topic">{t.topic}</span>
                  <span className="weak-meta">
                    <span className="muted">{rotationName(t.rotation)}</span>
                    <span style={{ color: accColor(pct(t.correct, t.n)), fontWeight: 700 }}>{pct(t.correct, t.n)}%</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ fontSize: '0.8rem', margin: '10px 0 0' }}>
            Only topics you’ve answered ≥3 times are ranked, so one unlucky miss doesn’t skew it.
          </p>
        </div>
      )}

      <div className="card">
        <label className="section-title" style={{ marginTop: 0 }}>Accuracy by rotation</label>
        {rows.map((r) => {
          const p = pct(r.e.correct, r.e.n)
          return (
            <Link key={r.id} to={`/r/${r.id}`} className="acc-row">
              <span className="acc-label">{r.emoji} {r.name}</span>
              <span className="acc-bar">
                <span style={{ width: `${p}%`, background: accColor(p) }} />
              </span>
              <span className="acc-val">{p}% <span className="muted">({r.e.n})</span></span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
