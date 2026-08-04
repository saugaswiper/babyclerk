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
import { rotationPlan, nextUp, LEAD_DAYS } from '../lib/rotationPhase.js'
import { prepProgress } from '../lib/checklist.js'
import { weakTopics } from '../lib/mastery.js'
import Icon from '../components/Icon.jsx'

export default function Home() {
  const schedule = getSchedule()
  const currentId = getCurrentRotationId(schedule)
  const exams = getUpcomingExams(schedule)
  const scheduled = hasSchedule(schedule)

  const stats = rotations.map((r) => {
    const merged = getRotationMerged(r.id)
    const srsState = readStored(`srs:${r.id}`, {})
    return {
      r: merged,
      due: countToday(merged.flashcards, srsState, r.id),
      plan: rotationPlan(r.id, { schedule }),
      prep: prepProgress(r.id, merged.checklist),
    }
  })
  const totalDue = stats.reduce((n, s) => n + s.due, 0)

  // Heaviest phase first (current → exam → priming → paused), original order on
  // ties. With no schedule every rotation weighs the same, so nothing moves.
  const ordered = stats
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s.plan.weight - a.s.plan.weight || a.i - b.i)
    .map((x) => x.s)

  const focus = stats.find((s) => s.plan.phase === 'current')

  // The block you should be getting ready for, once it's close enough to matter.
  const next = nextUp(schedule)
  const nextPrep = next && next.startsIn <= LEAD_DAYS ? next : null
  const nextStats = nextPrep ? stats.find((s) => s.r.id === nextPrep.id) : null

  const nextExam = exams[0]
  const weak = weakTopics(undefined, { min: 3, limit: 3 })
  // Current block might be a rotation without a deck (Anesthesia/Emergency/…).
  const currentIsContent = rotations.some((r) => r.id === currentId)
  const currentExtra = currentId && !currentIsContent ? EXTRA_BLOCKS[currentId] || currentId : null

  return (
    <>
      <section className="hero">
        <svg className="hero-ecg" viewBox="0 0 240 48" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path
            pathLength="1"
            d="M0 26 H44 l4 -3 l3 8 l5 -24 l5 36 l4 -17 l3 0 H124 l4 -3 l3 8 l5 -24 l5 36 l4 -17 l3 0 H240"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className="hero-body">
          <span className="hero-eyebrow">Queen’s clerkship · MCCQE</span>
          <h1>Know exactly what to study today.</h1>
          <p>Spaced-repetition decks, weak-spot targeting, and your rotation schedule — in one calm place.</p>
        </div>
      </section>

      {currentExtra && (
        <Link to="/schedule" className="card tile" style={{ marginBottom: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <Icon name="pin" size={20} style={{ color: 'var(--primary)' }} />
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
            <Icon name="clock" size={20} style={{ color: examColor(nextExam.days) }} />
            {examName(nextExam)} exam {countdown(nextExam.days)}
          </h3>
          <p style={{ margin: '4px 0 0' }}>{examNudge(nextExam.days)}</p>
        </Link>
      )}

      {totalDue > 0 && (
        <Link to="/study" className="card tile" style={{ marginBottom: 16, borderColor: 'var(--primary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <Icon name="play" size={20} style={{ color: 'var(--primary)' }} />
            Study due now — {totalDue} card{totalDue === 1 ? '' : 's'}
          </h3>
          <p style={{ margin: '4px 0 0' }}>
            {focus
              ? `One session, every rotation — new material weighted to ${focus.r.name} while you’re on it.`
              : 'One session, every rotation. Ten minutes and you’re caught up.'}
          </p>
        </Link>
      )}

      {nextPrep && (
        <Link
          to={nextStats ? `/r/${nextStats.r.id}/checklist` : '/schedule'}
          className="card tile"
          style={{ marginBottom: 16 }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <Icon name="clipboard" size={20} style={{ color: 'var(--primary)' }} />
            Next up: {nextStats ? nextStats.r.name : EXTRA_BLOCKS[nextPrep.id] || nextPrep.id} — starts{' '}
            {countdown(nextPrep.startsIn)}
          </h3>
          <p style={{ margin: '4px 0 0' }}>
            {nextStats
              ? nextStats.prep.left > 0
                ? `${nextStats.prep.left} prep item${nextStats.prep.left === 1 ? '' : 's'} left, and its cards have started mixing in. Tap to get ready.`
                : 'Prep checklist done — its cards are already mixing into your daily queue.'
              : 'No deck for this block yet — check your dates and exam on the schedule.'}
          </p>
        </Link>
      )}

      {weak.length > 0 && (
        <Link to="/progress" className="card tile" style={{ marginBottom: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <Icon name="target" size={20} style={{ color: 'var(--accent)' }} />
            Your weak spots
          </h3>
          <p style={{ margin: '4px 0 0' }}>
            Focus areas from your answers: {weak.map((t) => t.topic).join(', ')}. Tap to see your full progress.
          </p>
        </Link>
      )}

      <div className="section-title">Pick a rotation</div>
      <div className="grid">
        {ordered.map(({ r, due, plan, prep }) => {
          const isCurrent = plan.phase === 'current'
          const examDays = examDaysFor(r.id, schedule)
          const examPill = examDays != null && examDays <= 30
          // The badge and the exam pill already say it — don't say it twice.
          const showPhase = plan.short && !isCurrent && !(plan.phase === 'exam' && examPill)
          const showPrep = prep.left > 0 && (isCurrent || plan.phase === 'upcoming')
          return (
            <Link
              key={r.id}
              to={`/r/${r.id}`}
              className="card tile"
              style={isCurrent ? { borderColor: 'var(--primary)' } : undefined}
            >
              {isCurrent && <span className="badge-now">On rotation now</span>}
              <span className="tile-ico"><Icon name={r.icon} size={24} /></span>
              <h3>{r.name}</h3>
              <p>{r.blurb}</p>
              <div className="tile-stat">
                <span>{r.flashcards.length} cards</span>
                <span>{r.mcqs.length} MCQs</span>
                {due > 0 && <span className="due">{due} due</span>}
                {showPrep && <span>{prep.left} to prep</span>}
                {showPhase && <span>{plan.short}</span>}
                {examPill && (
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
        <Link to="/schedule" className="card" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="calendar" size={20} style={{ color: 'var(--primary)', flex: 'none' }} />
          <span>
            <strong>Set your rotation schedule</strong> — pace new cards to the block you’re on, prep for the
            next one, and count down to each exam.
          </span>
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
