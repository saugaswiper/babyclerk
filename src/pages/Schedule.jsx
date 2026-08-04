import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rotations } from '../data/rotations/index.js'
import { getSchedule, setSchedule, daysUntil, countdown, EXTRA_BLOCKS } from '../lib/schedule.js'
import { QUEENS_MEDS2028 } from '../data/queensSchedule.js'
import ScheduleTimeline from '../components/ScheduleTimeline.jsx'

export default function Schedule() {
  const [sched, setSched] = useState(getSchedule)
  const [preset, setPreset] = useState('')
  const [presetMsg, setPresetMsg] = useState('')

  function persist(next) {
    setSched(next)
    setSchedule(next)
  }

  function applyPreset(streamId) {
    const stream = QUEENS_MEDS2028.streams[streamId]
    if (!stream) return
    const merged = { ...sched.rotations }
    for (const [rid, win] of Object.entries(stream.rotations)) {
      // Fill start/end from the preset; keep any exam date already set.
      merged[rid] = { ...(merged[rid] || {}), start: win.start, end: win.end }
    }
    persist({ ...sched, rotations: merged })
    setPresetMsg(
      `Loaded ${QUEENS_MEDS2028.label} — ${stream.label}. Dates prefilled below; review against your official schedule and add exam dates.`
    )
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

      <ScheduleTimeline schedule={sched} />

      <div className="card" style={{ marginBottom: 16 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Quick start — load your program’s schedule</label>
        <p className="muted" style={{ margin: '0 0 10px', fontSize: '0.85rem' }}>
          Prefill rotation dates from the {QUEENS_MEDS2028.label} clerkship schedule. Pick your stream, then
          review and tweak below (surgery subspecialties, electives, and exam dates are yours to add).
        </p>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <select
            className="text-input"
            style={{ maxWidth: 200 }}
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            <option value="">Choose your stream…</option>
            {Object.entries(QUEENS_MEDS2028.streams).map(([id, s]) => (
              <option key={id} value={id}>{s.label}</option>
            ))}
          </select>
          <button className="btn primary" disabled={!preset} onClick={() => applyPreset(preset)}>
            Load
          </button>
        </div>
        {presetMsg && (
          <p className="muted" style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--primary)' }}>{presetMsg}</p>
        )}
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

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Other rotations (no deck yet)</label>
        <p className="muted" style={{ margin: '0 0 4px', fontSize: '0.82rem' }}>
          Rotations BabyClerk doesn’t have study cards for. Tracked so “what you’re on now” and exam
          countdowns stay accurate — presets fill these in too.
        </p>
        {Object.entries(EXTRA_BLOCKS).map(([id, name]) => {
          const entry = sched.rotations[id] || {}
          const filled = entry.start || entry.end || entry.exam
          return (
            <div key={id} style={{ padding: '10px 0', borderTop: '1px solid var(--border, #e5e7eb)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.92rem' }}>{name}</strong>
                {filled && (
                  <button
                    className="btn ghost"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    onClick={() => clearRotation(id)}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="sched-grid">
                <label>
                  Start
                  <input type="date" className="text-input" value={entry.start || ''} onChange={(e) => updateRotation(id, 'start', e.target.value)} />
                </label>
                <label>
                  End
                  <input type="date" className="text-input" value={entry.end || ''} onChange={(e) => updateRotation(id, 'end', e.target.value)} />
                </label>
                <label>
                  Exam
                  <input type="date" className="text-input" value={entry.exam || ''} onChange={(e) => updateRotation(id, 'exam', e.target.value)} />
                </label>
              </div>
            </div>
          )
        })}
      </div>

      <Link className="btn primary" to="/">
        Done
      </Link>
    </div>
  )
}
