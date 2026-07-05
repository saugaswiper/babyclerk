import { Link } from 'react-router-dom'
import { rotations } from '../data/rotations/index.js'
import { getRotationMerged } from '../lib/customContent.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countToday } from '../lib/scheduler.js'

export default function Home() {
  // Merged decks (built-in + your imported/AI cards) so counts match reality.
  const stats = rotations.map((r) => {
    const merged = getRotationMerged(r.id)
    const srsState = readStored(`srs:${r.id}`, {})
    return { r: merged, due: countToday(merged.flashcards, srsState, r.id) }
  })
  const totalDue = stats.reduce((n, s) => n + s.due, 0)

  return (
    <>
      <div className="page-head">
        <h1>Pick a rotation</h1>
        <p className="sub">
          Clerkship prep for Queen’s &amp; the MCCQE — drill flashcards, viva questions, MCQs and
          high-yield notes so you’re never caught out on the wards.
        </p>
      </div>

      {totalDue > 0 && (
        <Link to="/study" className="card tile" style={{ marginBottom: 16, borderColor: 'var(--primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="tile-emoji" style={{ fontSize: '1.4rem' }}>▶</span>
            Study due now — {totalDue} card{totalDue === 1 ? '' : 's'}
          </h3>
          <p>One session, every rotation. Ten minutes and you’re caught up.</p>
        </Link>
      )}

      <div className="grid">
        {stats.map(({ r, due }) => (
          <Link key={r.id} to={`/r/${r.id}`} className="card tile">
            <span className="tile-emoji">{r.emoji}</span>
            <h3>{r.name}</h3>
            <p>{r.blurb}</p>
            <div className="tile-stat">
              <span>{r.flashcards.length} cards</span>
              <span>{r.mcqs.length} MCQs</span>
              {due > 0 && <span className="due">{due} due</span>}
            </div>
          </Link>
        ))}
      </div>

      <p className="kbd-hint">
        Tip: start with <strong>Notes</strong> to learn, then <strong>Flashcards</strong> &amp;{' '}
        <strong>Viva</strong> to drill, then <strong>Quiz</strong> to test yourself.
      </p>
    </>
  )
}
