import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rotations } from '../data/rotations/index.js'
import { getSchedule, setSchedule, daysUntil, countdown } from '../lib/schedule.js'

export default function Schedule() {
  const [sched, setSched] = useState(getSchedule)

  function persist(next) {
    setSched(next)
    setSchedule(next)
  }
  function updateRotation(id, field, value) {
    persist({
      ...sched,
      rotations: { ...sched.rotations, [id]: { ...(sched.rotations[id] || {}), [field]: value } },
    })
  }
  function clearRotation(id) {
    const rest = { ...sched.rotations }
    delete rest[id]
    persist({ ...sched, rotations: rest })
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>🗓️ Your schedule</h1>
        <p className="sub">
          Enter your rotation blocks and exam dates. BabyClerk highlights the rotation you’re on now and
          counts down to each exam. Optional — everything works without it, and it saves automatically.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <label className="section-title" htmlFor="mccqe" style={{ marginTop: 0 }}>
          MCCQE / big exam date
        </label>
        <input
          id="mccqe"
          type="date"
          className="text-input"
          value={sched.mccqe || ''}
          onChange={(e) => persist({ ...sched, mccqe: e.target.value })}
        />
        {sched.mccqe && (
          <p className="muted" style={{ fontSize: '0.82rem', marginTop: 8 }}>
            {countdown(daysUntil(sched.mccqe))}
          </p>
        )}
      </div>

      {rotations.map((r) => {
        const entry = sched.rotations[r.id] || {}
        const filled = entry.start || entry.end || entry.exam
        return (
          <div key={r.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>
                {r.emoji} {r.name}
              </strong>
              {filled && (
                <button
                  className="btn ghost"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => clearRotation(r.id)}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="sched-grid">
              <label>
                Start
                <input
                  type="date"
                  className="text-input"
                  value={entry.start || ''}
                  onChange={(e) => updateRotation(r.id, 'start', e.target.value)}
                />
              </label>
              <label>
                End
                <input
                  type="date"
                  className="text-input"
                  value={entry.end || ''}
                  onChange={(e) => updateRotation(r.id, 'end', e.target.value)}
                />
              </label>
              <label>
                Exam
                <input
                  type="date"
                  className="text-input"
                  value={entry.exam || ''}
                  onChange={(e) => updateRotation(r.id, 'exam', e.target.value)}
                />
              </label>
            </div>
            {entry.exam && daysUntil(entry.exam) != null && daysUntil(entry.exam) >= 0 && (
              <p className="muted" style={{ fontSize: '0.82rem', margin: '8px 0 0' }}>
                Exam {countdown(daysUntil(entry.exam))}
              </p>
            )}
          </div>
        )
      })}

      <Link className="btn primary" to="/">
        Done
      </Link>
    </div>
  )
}
