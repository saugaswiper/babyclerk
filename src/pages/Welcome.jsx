import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { rotations, getRotation } from '../data/rotations/index.js'
import { getRotationMerged } from '../lib/customContent.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countToday } from '../lib/scheduler.js'
import { QUEENS_MEDS2028 } from '../data/queensSchedule.js'
import {
  getSchedule,
  setSchedule,
  getCurrentRotationId,
  getUpcomingExams,
  countdown,
  daysUntil,
  rotationColor,
  EXTRA_BLOCKS,
} from '../lib/schedule.js'
import { getNewLimit, setNewLimit } from '../lib/settings.js'
import { setOnboarded } from '../lib/onboarding.js'
import Icon from '../components/Icon.jsx'

const fmtMon = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })

function streamSpan(stream) {
  const all = Object.values(stream.rotations)
  const start = all.reduce((m, r) => (r.start < m ? r.start : m), all[0].start)
  const end = all.reduce((m, r) => (r.end > m ? r.end : m), all[0].end)
  return `${fmtMon(start)} – ${fmtMon(end)}`
}

// Rough daily time: a new card costs ~20s to learn, and each one drags along
// ~2 reviews at ~8s. Good enough to make the choice concrete.
const minutesFor = (n) => Math.max(1, Math.round((n * 36) / 60))

const PACES = [
  { n: 10, label: 'Light', desc: 'Busy ward weeks and call nights' },
  { n: 20, label: 'Steady', desc: 'The default — sustainable all block', recommended: true },
  { n: 35, label: 'Hard', desc: 'Exam soon, or you want to be ahead' },
]

const STEPS = ['Your schedule', 'Your pace', 'Ready']

export default function Welcome() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [stream, setStream] = useState('')
  const [pace, setPace] = useState(getNewLimit())

  function chooseStream(streamId) {
    const s = QUEENS_MEDS2028.streams[streamId]
    if (!s) return
    const sched = getSchedule()
    const merged = { ...sched.rotations }
    for (const [rid, win] of Object.entries(s.rotations)) {
      merged[rid] = { ...(merged[rid] || {}), start: win.start, end: win.end }
    }
    setSchedule({ ...sched, rotations: merged })
    setStream(streamId)
    setStep(1)
  }

  function choosePace(n) {
    setPace(n)
    setNewLimit(n)
    setStep(2)
  }

  function finish(to) {
    setOnboarded()
    navigate(to)
  }

  return (
    <div className="study-shell welcome">
      <div className="wl-steps" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <span key={s} className={`wl-step ${i === step ? 'on' : ''} ${i < step ? 'done' : ''}`}>
            <i />
            {s}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="wl-panel">
          <h1>Let&apos;s make this yours.</h1>
          <p className="sub">
            Tell BabyClerk when your rotations run and it stops being a pile of cards — your current
            rotation floats to the top, exams start counting down, and study priority follows your calendar.
          </p>

          <label className="section-title">Load your {QUEENS_MEDS2028.label} stream</label>
          <div className="stream-cards">
            {Object.entries(QUEENS_MEDS2028.streams).map(([id, s]) => (
              <button key={id} className="stream-card" onClick={() => chooseStream(id)}>
                <span className="stream-top"><strong>{s.label}</strong></span>
                <span className="muted stream-span">{streamSpan(s)}</span>
                <span className="stream-dots">
                  {Object.keys(s.rotations).map((rid) => (
                    <i key={rid} style={{ background: rotationColor(rid) }} title={getRotation(rid)?.name || EXTRA_BLOCKS[rid]} />
                  ))}
                </span>
              </button>
            ))}
          </div>

          <div className="wl-actions">
            <button className="btn" onClick={() => setStep(1)}>
              Another school — I&apos;ll add dates later
            </button>
            <button className="linklike" onClick={() => finish('/')}>Skip setup</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wl-panel">
          <h1>How much per day?</h1>
          <p className="sub">
            How many <strong>new</strong> cards to introduce each day in a rotation. Reviews come on top,
            and they&apos;re what actually make it stick. You can change this any time in Settings.
          </p>

          <div className="wl-paces">
            {PACES.map((p) => (
              <button
                key={p.n}
                className={`wl-pace ${pace === p.n ? 'active' : ''}`}
                onClick={() => choosePace(p.n)}
              >
                <span className="wl-pace-n">{p.n}</span>
                <span className="wl-pace-body">
                  <strong>
                    {p.label}
                    {p.recommended && <span className="pill" style={{ marginLeft: 8 }}>recommended</span>}
                  </strong>
                  <span className="muted">{p.desc} · about {minutesFor(p.n)} min/day</span>
                </span>
                <Icon name="arrow-right" size={18} style={{ color: 'var(--text-faint)', flex: 'none' }} />
              </button>
            ))}
          </div>

          <div className="wl-actions">
            <button className="linklike" onClick={() => setStep(0)}>Back</button>
          </div>
        </div>
      )}

      {step === 2 && <Ready stream={stream} pace={pace} onFinish={finish} />}
    </div>
  )
}

function Ready({ stream, pace, onFinish }) {
  const schedule = getSchedule()
  const currentId = getCurrentRotationId(schedule)
  const nextExam = getUpcomingExams(schedule)[0]
  const current = currentId ? getRotation(currentId) : null
  const currentLabel = current?.name || (currentId ? EXTRA_BLOCKS[currentId] : null)

  // Between blocks (or before the year starts): name what's coming instead.
  const upcoming = currentLabel
    ? null
    : Object.entries(schedule.rotations)
        .map(([id, r]) => ({ id, days: daysUntil(r.start) }))
        .filter((x) => x.days != null && x.days > 0)
        .sort((a, b) => a.days - b.days)[0]
  const upcomingLabel = upcoming ? getRotation(upcoming.id)?.name || EXTRA_BLOCKS[upcoming.id] : null

  const totalDue = rotations.reduce((n, r) => {
    const merged = getRotationMerged(r.id)
    return n + countToday(merged.flashcards, readStored(`srs:${r.id}`, {}), r.id)
  }, 0)

  return (
    <div className="wl-panel">
      <h1>You&apos;re set.</h1>
      <p className="sub">Here&apos;s what BabyClerk knows about you now — everything else it learns as you study.</p>

      <ul className="wl-summary">
        <li>
          <Icon name="calendar" size={18} style={{ color: 'var(--primary)' }} />
          {stream ? (
            <span><strong>{QUEENS_MEDS2028.streams[stream].label}</strong> loaded — all eight blocks dated.</span>
          ) : (
            <span>No schedule yet — <Link to="/schedule">add your rotation dates</Link> whenever you like.</span>
          )}
        </li>
        {currentLabel && (
          <li>
            <Icon name="pin" size={18} style={{ color: 'var(--primary)' }} />
            <span>You&apos;re on <strong>{currentLabel}</strong> right now — it sits at the top of your home screen.</span>
          </li>
        )}
        {upcomingLabel && (
          <li>
            <Icon name="pin" size={18} style={{ color: 'var(--primary)' }} />
            <span>
              First up: <strong>{upcomingLabel}</strong>, starting {countdown(upcoming.days)}. It&apos;ll move to
              the top of your home screen on day one.
            </span>
          </li>
        )}
        {nextExam && (
          <li>
            <Icon name="clock" size={18} style={{ color: 'var(--warning)' }} />
            <span>
              Next exam <strong>{countdown(nextExam.days)}</strong> — you&apos;ll get a readiness estimate as soon as you start answering.
            </span>
          </li>
        )}
        <li>
          <Icon name="target" size={18} style={{ color: 'var(--accent)' }} />
          <span><strong>{pace} new cards/day</strong> per rotation, plus reviews.</span>
        </li>
      </ul>

      <div className="wl-actions">
        <button className="btn primary" onClick={() => onFinish(totalDue > 0 ? '/study' : '/')}>
          {totalDue > 0 ? `Start today's session — ${totalDue} cards` : 'Pick a rotation'}
        </button>
        <button className="linklike" onClick={() => onFinish('/')}>Just take me home</button>
      </div>

      <p className="rdy-note" style={{ marginTop: 18 }}>
        Everything saves in this browser. Sign in later if you want it on your phone too — nothing is
        required, and your API key never leaves this device.
      </p>
    </div>
  )
}
