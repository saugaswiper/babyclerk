import { Link } from 'react-router-dom'
import { setNewLimit } from '../lib/settings.js'
import { countdown } from '../lib/schedule.js'
import { VERDICT_LABEL, verdictColor } from '../lib/forecast.js'
import Icon from './Icon.jsx'

const pct = (x) => Math.round(x * 100)

// Seen-and-holding / seen-but-faded / never-met, as one bar.
export function ReadinessBar({ f, height = 10 }) {
  const seg = (n) => ({ width: `${(n / f.deck) * 100}%` })
  return (
    <div className="rdy-bar" style={{ height }} role="img"
      aria-label={`${f.strongNow} cards holding, ${f.fadedNow} faded, ${f.unseen} not yet met, of ${f.deck}`}>
      <span className="rdy-seg strong" style={seg(f.strongNow)} />
      <span className="rdy-seg faded" style={seg(f.fadedNow)} />
      <span className="rdy-seg unseen" style={seg(f.unseen)} />
    </div>
  )
}

// Full readiness panel — used at the top of a rotation page.
export function ReadinessCard({ f, onBudgetChange }) {
  if (!f) return null
  const ready = pct(f.readinessNow)

  function raise() {
    setNewLimit(f.perDayNeeded)
    onBudgetChange?.()
  }

  return (
    <div className="card readiness" style={{ borderColor: verdictColor(f.verdict) }}>
      <div className="rdy-head">
        <span className="rdy-title">
          <Icon name="target" size={17} style={{ color: verdictColor(f.verdict) }} />
          Exam readiness
        </span>
        {f.daysLeft != null && (
          <span className="rdy-chip" style={{ background: verdictColor(f.verdict) }}>
            {VERDICT_LABEL[f.verdict]} · {f.targetLabel} {countdown(f.daysLeft)}
          </span>
        )}
      </div>

      <div className="rdy-main">
        <div className="rdy-score">
          <span className="rdy-num" style={{ color: verdictColor(f.verdict) }}>{ready}%</span>
          <span className="rdy-num-label">ready today</span>
        </div>
        <div className="rdy-detail">
          <ReadinessBar f={f} />
          <div className="rdy-legend">
            {f.strongNow > 0 && <span><i className="dot strong" />{f.strongNow} holding</span>}
            {f.fadedNow > 0 && <span><i className="dot faded" />{f.fadedNow} faded</span>}
            {f.unseen > 0 && <span><i className="dot unseen" />{f.unseen} not met yet</span>}
          </div>
        </div>
      </div>

      <p className="rdy-headline">{f.headline}</p>
      {f.daysLeft != null && f.atRisk > 0 && f.remaining > 0 && (
        <p className="rdy-sub">
          {f.atRisk} card{f.atRisk === 1 ? '' : 's'} you&apos;ve already met need at least one more review before then —
          your due queue will bring them back.
        </p>
      )}

      {f.pace?.adjusted && (
        <p className="rdy-pace">
          <Icon name="shuffle" size={14} />
          <span><strong>Today&apos;s pace: {f.pace.budget} new cards.</strong> {f.pace.reason}</span>
        </p>
      )}

      <div className="rdy-actions">
        <Link className="btn primary" to={`/r/${f.rotationId}/flashcards`}>Study now</Link>
        {/* Don't offer a bump that fights the pacing engine: not while it's
            deliberately tapering, and not when it already raised the load. */}
        {f.extraPerDay > 0 && f.strategy !== 'consolidate' && !(f.pace?.adjusted && f.pace.budget >= f.perDayNeeded) && (
          <button className="btn" onClick={raise}>
            Raise pace to {f.perDayNeeded}/day
          </button>
        )}
        {f.verdict === 'no-target' && (
          <Link className="btn" to="/schedule">Set exam date</Link>
        )}
      </div>

      <p className="rdy-note">
        Estimated from your own review history — recall decays from each card&apos;s last review, and
        cards you&apos;ve never met count as zero.
      </p>
    </div>
  )
}

// Compact one-line version — used in the cross-rotation list on /progress.
export function ReadinessRow({ f, name, icon }) {
  return (
    <Link to={`/r/${f.rotationId}`} className="rdy-row">
      <span className="rdy-row-name">
        <Icon name={icon} size={16} style={{ color: 'var(--primary)', flex: 'none' }} />
        {name}
      </span>
      <span className="rdy-row-bar"><ReadinessBar f={f} height={8} /></span>
      <span className="rdy-row-val" style={{ color: verdictColor(f.verdict) }}>
        {pct(f.readinessNow)}%
        <span className="muted"> · {f.targetLabel} {countdown(f.daysLeft)}</span>
      </span>
    </Link>
  )
}
