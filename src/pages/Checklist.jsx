import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { useLocalStorage } from '../lib/useLocalStorage.js'
import { rotationPlan } from '../lib/rotationPhase.js'

export default function Checklist() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)
  const [checked, setChecked] = useLocalStorage(`checklist:${rotationId}`, {})
  const plan = rotationPlan(rotationId)

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  const doneCount = rotation.checklist.filter((_, i) => checked[i]).length

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — Prep Checklist</h1>
        <p className="sub">
          {doneCount} / {rotation.checklist.length} done — the essentials to walk in confident.
          {plan.phase === 'upcoming' && ` ${plan.note}`}
        </p>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${rotation.checklist.length ? (doneCount / rotation.checklist.length) * 100 : 0}%` }} />
      </div>

      <ul className="checklist">
        {rotation.checklist.map((item, i) => (
          <li key={i} className={checked[i] ? 'done' : ''}>
            <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} id={`chk-${i}`} />
            <label htmlFor={`chk-${i}`}>
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
        <Link className="btn ghost" to={`/r/${rotation.id}`}>
          Back to {rotation.name}
        </Link>
      </div>
    </div>
  )
}
