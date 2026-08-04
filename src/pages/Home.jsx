import { Link } from 'react-router-dom'
import { rotations, getRotation } from '../data/rotations/index.js'
import { getRotationMerged } from '../lib/customContent.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countToday } from '../lib/scheduler.js'
import {
  getSchedule,
  getCurrentRotationId,
  getUpcomingExams,
  examDaysFor,
  hasSchedule,
  countdown,
  EXTRA_BLOCKS,
  isExtraBlock,
} from '../lib/schedule.js'
import { weakTopics } from '../lib/mastery.js'

export default function Home() {
  const schedule = getSchedule()
  const currentId = getCurrentRotationId(schedule)
  const exams = getUpcomingExams(schedule)
  const scheduled = hasSchedule(schedule)

  const stats = rotations.map((r) => {
    const merged = getRotationMerged(r.id)
    const srsState = readStored(`srs:${r.id}`, {})
    return { r: merged, due: countToday(merged.flashcards, srsState, r.id) }
  })
  const totalDue = stats.reduce((n, s) => n + s.due, 0)

  // Current rotation floats to the top; everything else keeps its order.
  const ordered = [...stats].sort((a, b) => {
    if (a.r.id === currentId) return -1
    if (b.r.id === currentId) return 1
    return 0
  })

  const nextExam = exams[0]
  const weak = weakTopics(undefined, { min: 3, limit: 3 })
  // Current block might be a rotation without a deck (Anesthesia/Emergency/…).
  const currentIsContent = rotations.some((r) => r.id === currentId)
  const currentExtra = currentId && !currentIsContent ? EXTRA_BLOCKS[currentId] || currentId : null

  return (
    <>
      <div className="page-head">
        <h1>Pick a rotation</h1>
        <p className="sub">
          Clerkship prep for Queen’s &amp; the MCCQE — drill flashcards, viva questions, MCQs and
          high-yield notes so you’re never caught out on the wards.
        </p>
      </div>

      {currentExtra && (
        <Link to="/schedule" className="card tile" style={{ marginBottom: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <span style={{ fontSize: '1.3rem' }}>📍</span>
            On {currentExtra} now
          </h3>
          <p style={{ margin: '4px 0 0' }}>No deck for this rotation yet — you can still track its dates and exam.</p>
        </Link>
      )}

      {nextExam && (
        <Link
          to={nextExam.rotationId && !isExtraBlock(nextExam.rotationId) ? `/r/${nextExam.rotationId}` : '/schedule'}
          className="card tile"
          style={{ marginBottom: 16, borderColor: examColor(nextExam.days) }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <span style={{ fontSize: '1.3rem' }}>⏰</span>
            {examName(nextExam)} exam {countdown(nextExam.days)}
          </h3>
          <p style={{ margin: '4px 0 0' }}>{examNudge(nextExam.days)}</p>
        </Link>
      )}

      {totalDue > 0 && (
        <Link to="/study" className="card tile" style={{ marginBottom: 16, borderColor: 'var(--primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="tile-emoji" style={{ fontSize: '1.4rem' }}>▶</span>
            Study due now — {totalDue} card{totalDue === 1 ? '' : 's'}
          </h3>
          <p>One session, every rotation. Ten minutes and you’re caught up.</p>
        </Link>
      )}

      {weak.length > 0 && (
        <Link to="/progress" className="card tile" style={{ marginBottom: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            Your weak spots
          </h3>
          <p style={{ margin: '4px 0 0' }}>
            Focus areas from your answers: {weak.map((t) => t.topic).join(', ')}. Tap to see your full progress.
          </p>
        </Link>
      )}

      <div className="grid">
        {ordered.map(({ r, due }) => {
          const isCurrent = r.id === currentId
          const examDays = examDaysFor(r.id, schedule)
          return (
            <Link
              key={r.id}
              to={`/r/${r.id}`}
              className="card tile"
              style={isCurrent ? { borderColor: 'var(--primary)' } : undefined}
            >
              {isCurrent && <span className="badge-now">On rotation now</span>}
              <span className="tile-emoji">{r.emoji}</span>
              <h3>{r.name}</h3>
              <p>{r.blurb}</p>
              <div className="tile-stat">
                <span>{r.flashcards.length} cards</span>
                <span>{r.mcqs.length} MCQs</span>
                {due > 0 && <span className="due">{due} due</span>}
                {examDays != null && examDays <= 30 && (
                  <span className="pill-exam" style={{ background: examColor(examDays) }}>
                    exam {countdown(examDays)}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {scheduled ? (
        <p className="kbd-hint">
          <Link to="/schedule">Edit your rotation schedule →</Link>
        </p>
      ) : (
        <Link to="/schedule" className="card" style={{ marginTop: 16, display: 'block' }}>
          🗓️ <strong>Set your rotation schedule</strong> — get current-rotation focus and exam countdowns.
        </Link>
      )}

      <p className="kbd-hint">
        Tip: start with <strong>Notes</strong> to learn, then <strong>Flashcards</strong> &amp;{' '}
        <strong>Viva</strong> to drill, then <strong>Quiz</strong> to test yourself.
      </p>
    </>
  )
}

function examName(exam) {
  if (exam.label) return exam.label
  return getRotation(exam.rotationId)?.name || EXTRA_BLOCKS[exam.rotationId] || 'Rotation'
}

function examColor(days) {
  if (days <= 7) return 'var(--danger)'
  if (days <= 21) return 'var(--warning, #d97706)'
  return 'var(--primary)'
}

function examNudge(days) {
  if (days <= 3) return 'Crunch time — hammer your weak topics and review, review, review.'
  if (days <= 7) return 'One week out. Prioritize this rotation’s reviews over new cards.'
  if (days <= 21) return 'Ramp up — make this rotation your daily focus.'
  return 'Plenty of time. Keep a steady daily pace and you’ll be ready.'
}
