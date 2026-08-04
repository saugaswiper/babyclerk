import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rotations, getRotation } from '../data/rotations/index.js'
import {
  getSchedule,
  setSchedule,
  daysUntil,
  countdown,
  EXTRA_BLOCKS,
  rotationColor,
} from '../lib/schedule.js'
import { QUEENS_MEDS2028 } from '../data/queensSchedule.js'
import ScheduleTimeline from '../components/ScheduleTimeline.jsx'
import Icon from '../components/Icon.jsx'

const d = (iso) => new Date(iso + 'T00:00:00')
const fmtDay = (iso) => (iso ? d(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—')
const fmtMon = (iso) => d(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })

// All schedulable blocks in a stable order: content rotations, then no-deck blocks.
const ALL_BLOCKS = [
  ...rotations.map((r) => ({ id: r.id, name: r.name, extra: false })),
  ...Object.entries(EXTRA_BLOCKS).map(([id, name]) => ({ id, name, extra: true })),
]

function streamSpan(stream) {
  const all = Object.values(stream.rotations)
  const start = all.reduce((m, r) => (r.start < m ? r.start : m), all[0].start)
  const end = all.reduce((m, r) => (r.end > m ? r.end : m), all[0].end)
  return `${fmtMon(start)} – ${fmtMon(end)}`
}

export default function Schedule() {
  const [sched, setSched] = useState(getSchedule)
  const [loadedStream, setLoadedStream] = useState('')
  const [editing, setEditing] = useState(null)

  function persist(next) {
    setSched(next)
    setSchedule(next)
  }
  function updateRotation(id, field, value) {
    persist({ ...sched, rotations: { ...sched.rotations, [id]: { ...(sched.rotations[id] || {}), [field]: value } } })
  }
  function clearRotation(id) {
    const rest = { ...sched.rotations }
    delete rest[id]
    persist({ ...sched, rotations: rest })
  }
  function applyPreset(streamId) {
    const stream = QUEENS_MEDS2028.streams[streamId]
    if (!stream) return
    const merged = { ...sched.rotations }
    for (const [rid, win] of Object.entries(stream.rotations)) {
      merged[rid] = { ...(merged[rid] || {}), start: win.start, end: win.end }
    }
    persist({ ...sched, rotations: merged })
    setLoadedStream(streamId)
  }
  function clearAll() {
    persist({ ...sched, rotations: {} })
    setLoadedStream('')
  }

  const anyScheduled = Object.keys(sched.rotations).length > 0

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>Your schedule</h1>
        <p className="sub">
          Load your stream to fill in every rotation automatically — then it drives current-rotation focus,
          exam countdowns, and study priority. Fine-tune any block below if you need to.
        </p>
      </div>

      {anyScheduled && <ScheduleTimeline schedule={sched} />}

      {/* Stream picker — the primary way to set a schedule */}
      <div className="card" style={{ marginBottom: 16 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Load your {QUEENS_MEDS2028.label} stream</label>
        <div className="stream-cards">
          {Object.entries(QUEENS_MEDS2028.streams).map(([id, s]) => (
            <button
              key={id}
              className={`stream-card ${loadedStream === id ? 'active' : ''}`}
              onClick={() => applyPreset(id)}
            >
              <span className="stream-top">
                <strong>{s.label}</strong>
                {loadedStream === id && <Icon name="check" size={16} />}
              </span>
              <span className="muted stream-span">{streamSpan(s)}</span>
              <span className="stream-dots">
                {Object.keys(s.rotations).map((rid) => (
                  <i key={rid} style={{ background: rotationColor(rid) }} title={getRotation(rid)?.name || EXTRA_BLOCKS[rid]} />
                ))}
              </span>
            </button>
          ))}
        </div>
        <p className="muted" style={{ fontSize: '0.8rem', margin: '10px 0 0' }}>
          Prefills Internal Medicine, Psychiatry, Surgery, OB/GYN, Pediatrics, Anesthesia, Emergency &amp;
          Medicine Selective. Add exam dates below. {anyScheduled && (
            <button className="linklike" onClick={clearAll}>Clear all</button>
          )}
        </p>
      </div>

      {/* MCCQE / big exam */}
      <div className="card" style={{ marginBottom: 16 }}>
        <label className="section-title" htmlFor="mccqe" style={{ marginTop: 0 }}>MCCQE / big exam date</label>
        <input
          id="mccqe"
          type="date"
          className="text-input"
          value={sched.mccqe || ''}
          onChange={(e) => persist({ ...sched, mccqe: e.target.value })}
        />
        {sched.mccqe && <p className="muted" style={{ fontSize: '0.82rem', marginTop: 8 }}>{countdown(daysUntil(sched.mccqe))}</p>}
      </div>

      {/* Color-coded rotation list */}
      <label className="section-title">Rotations</label>
      {ALL_BLOCKS.map((b) => {
        const entry = sched.rotations[b.id] || {}
        const set = entry.start && entry.end
        const examDays = daysUntil(entry.exam)
        const open = editing === b.id
        return (
          <div key={b.id} className="sched-row card" style={{ borderLeft: `4px solid ${rotationColor(b.id)}` }}>
            <div className="sched-row-head">
              <div>
                <div className="sched-row-name">
                  {b.name}
                  {b.extra && <span className="pill" style={{ marginLeft: 8, fontSize: '0.64rem' }}>no deck</span>}
                </div>
                <div className="muted" style={{ fontSize: '0.84rem' }}>
                  {set ? `${fmtDay(entry.start)} – ${fmtDay(entry.end)}` : 'Not scheduled'}
                  {entry.exam && examDays != null && examDays >= 0 && (
                    <> · <span style={{ color: rotationColor(b.id), fontWeight: 700 }}>exam {countdown(examDays)}</span></>
                  )}
                </div>
              </div>
              <button className="btn ghost sched-edit" onClick={() => setEditing(open ? null : b.id)}>
                {open ? 'Done' : set ? 'Edit' : 'Add'}
              </button>
            </div>
            {open && (
              <>
                <div className="sched-grid">
                  <label>Start<input type="date" className="text-input" value={entry.start || ''} onChange={(e) => updateRotation(b.id, 'start', e.target.value)} /></label>
                  <label>End<input type="date" className="text-input" value={entry.end || ''} onChange={(e) => updateRotation(b.id, 'end', e.target.value)} /></label>
                  <label>Exam<input type="date" className="text-input" value={entry.exam || ''} onChange={(e) => updateRotation(b.id, 'exam', e.target.value)} /></label>
                </div>
                {(entry.start || entry.end || entry.exam) && (
                  <button className="linklike" style={{ marginTop: 8 }} onClick={() => clearRotation(b.id)}>Clear this rotation</button>
                )}
              </>
            )}
          </div>
        )
      })}

      <Link className="btn primary" to="/" style={{ marginTop: 16 }}>Done</Link>
    </div>
  )
}
