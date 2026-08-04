import { Fragment } from 'react'
import { EXTRA_BLOCKS } from '../lib/schedule.js'
import { getRotation } from '../data/rotations/index.js'

// A compact, calendar-style Gantt of the rotation schedule: each rotation is a
// bar placed across a month ruler, with a "today" marker and overall progress.
// Read-only; reflects whatever schedule is passed in.
const d = (iso) => new Date(iso + 'T00:00:00')
const fmt = (iso) => d(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const nameFor = (id) => getRotation(id)?.name || EXTRA_BLOCKS[id] || id

export default function ScheduleTimeline({ schedule }) {
  const entries = Object.entries(schedule.rotations || {})
    .filter(([, r]) => r.start && r.end)
    .map(([id, r]) => ({ id, label: nameFor(id), start: r.start, end: r.end, hasDeck: !!getRotation(id) }))
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))

  if (!entries.length) return null

  const min = d(entries.reduce((m, e) => (e.start < m ? e.start : m), entries[0].start))
  const max = d(entries.reduce((m, e) => (e.end > m ? e.end : m), entries[0].end))
  const total = Math.max(1, max - min)

  const n = new Date()
  const today = new Date(n.getFullYear(), n.getMonth(), n.getDate())
  const inRange = today >= min && today <= max
  const todayPct = ((today - min) / total) * 100

  const pct = (date) => ((date - min) / total) * 100
  const statusOf = (e) => {
    const s = d(e.start)
    const en = d(e.end)
    if (en < today) return 'past'
    if (s <= today && today <= en) return 'current'
    return 'upcoming'
  }

  // Month ruler tick positions.
  const months = []
  let cur = new Date(min.getFullYear(), min.getMonth(), 1)
  while (cur <= max) {
    months.push(new Date(cur))
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }

  const current = entries.find((e) => statusOf(e) === 'current')
  const overall = today < min ? 0 : today > max ? 100 : Math.round((today - min) / total * 100)
  const idx = current ? entries.indexOf(current) + 1 : today > max ? entries.length : 0

  const minWidth = 116 + months.length * 66

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <label className="section-title" style={{ marginTop: 0 }}>Your rotations</label>

      <div className="muted" style={{ fontSize: '0.9rem', marginBottom: 8 }}>
        {current ? (
          <>
            <strong style={{ color: 'var(--text)' }}>{current.label}</strong> now · rotation {idx} of {entries.length}
          </>
        ) : today > max ? (
          <>Clerkship complete 🎉</>
        ) : (
          <>Starts {fmt(entries[0].start)}</>
        )}
        {' · '}{overall}% through
      </div>
      <div className="progress-bar" style={{ marginBottom: 16 }}>
        <span style={{ width: `${overall}%` }} />
      </div>

      <div className="tl-scroll">
        <div className="tl-inner" style={{ minWidth }}>
          <div className="tl-corner" />
          <div className="tl-ruler">
            {months.map((m, i) => (
              <span key={i} className="tl-month" style={{ left: `${pct(m)}%` }}>
                {m.toLocaleDateString(undefined, { month: 'short' })}
                {m.getMonth() === 0 ? ` ’${String(m.getFullYear()).slice(2)}` : ''}
              </span>
            ))}
          </div>

          {entries.map((e) => {
            const s = d(e.start)
            const en = d(e.end)
            const left = pct(s)
            const width = Math.max(((en - s) / total) * 100, 1.4)
            const st = statusOf(e)
            return (
              <Fragment key={e.id}>
                <span className="tl-name" title={`${fmt(e.start)} – ${fmt(e.end)}`}>{e.label}</span>
                <div className="tl-track">
                  {inRange && <span className="tl-today" style={{ left: `${todayPct}%` }} />}
                  <span
                    className={`tl-bar ${st}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${e.label}: ${fmt(e.start)} – ${fmt(e.end)}${e.hasDeck ? '' : ' (no deck)'}`}
                  />
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="tl-legend muted">
        <span><i className="tl-dot past" /> done</span>
        <span><i className="tl-dot current" /> now</span>
        <span><i className="tl-dot upcoming" /> upcoming</span>
        <span><i className="tl-dot today-dot" /> today</span>
      </div>
    </div>
  )
}
