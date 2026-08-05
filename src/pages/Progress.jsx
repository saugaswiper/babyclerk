import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rotations, getRotation } from '../data/rotations/index.js'
import { getAttempts, summarize } from '../lib/attempts.js'
import { weakTopics } from '../lib/mastery.js'
import { getApiKey, getModel } from '../lib/settings.js'
import { generateItems } from '../lib/generate.js'
import { appendCustom, getRotationMerged } from '../lib/customContent.js'
import { forecastAll, isWorthShowing } from '../lib/forecast.js'
import { ReadinessRow } from '../components/Readiness.jsx'
import Icon from '../components/Icon.jsx'

function pct(correct, n) {
  return n ? Math.round((correct / n) * 100) : 0
}
function accColor(p) {
  if (p >= 80) return 'var(--primary)'
  if (p >= 60) return 'var(--warning, #d97706)'
  return 'var(--danger)'
}
function rotationName(id) {
  return getRotation(id)?.name || id
}
function TrendMark({ trend }) {
  if (trend === 'improving')
    return <Icon name="trend-up" size={15} title="Improving" style={{ color: 'var(--good)', verticalAlign: '-2px' }} />
  if (trend === 'declining')
    return <Icon name="trend-down" size={15} title="Slipping" style={{ color: 'var(--danger)', verticalAlign: '-2px' }} />
  return null
}

export default function Progress() {
  const attempts = getAttempts()
  const { byRotation, total } = summarize(attempts)
  const weak = weakTopics(attempts, { min: 3, limit: 8 })

  const [busyKey, setBusyKey] = useState(null)
  const [drillMsg, setDrillMsg] = useState(null)
  const hasKey = !!getApiKey()

  async function drill(t) {
    const key = `${t.rotation}-${t.topic}`
    setBusyKey(key)
    setDrillMsg(null)
    try {
      const items = await generateItems({
        apiKey: getApiKey(),
        model: getModel(),
        rotationName: rotationName(t.rotation),
        topic: t.topic,
        kind: 'flashcards',
        count: 5,
      })
      appendCustom(t.rotation, 'flashcards', items)
      setDrillMsg({ rotation: t.rotation, text: `Added ${items.length} fresh ${t.topic} card${items.length === 1 ? '' : 's'} to ${rotationName(t.rotation)}.` })
    } catch (e) {
      setDrillMsg({ error: true, text: e?.message || 'Generation failed — check your API key in Settings.' })
    } finally {
      setBusyKey(null)
    }
  }

  const overallCorrect = attempts.reduce((n, a) => n + (a.correct ? 1 : 0), 0)
  const overallPct = pct(overallCorrect, total)

  // Exam readiness across every rotation that has something to count down to.
  const decks = rotations.map((r) => ({ id: r.id, cards: getRotationMerged(r.id).flashcards }))
  const forecasts = forecastAll(decks).filter(isWorthShowing)
  const readinessSection = forecasts.length > 0 && (
    <div className="card" style={{ marginBottom: 16 }}>
      <label className="section-title" style={{ marginTop: 0 }}>Exam readiness</label>
      <div className="rdy-rows">
        {forecasts.map((f) => {
          const r = getRotation(f.rotationId)
          return <ReadinessRow key={f.rotationId} f={f} name={r?.name || f.rotationId} icon={r?.icon} />
        })}
      </div>
      <p className="muted" style={{ fontSize: '0.8rem', margin: '10px 0 0' }}>
        Projected from your review history — how much you&apos;d recall today, and whether your daily
        pace covers the deck in time. Open a rotation for the full picture.
      </p>
    </div>
  )

  // Rotations in their canonical order, only those with attempts.
  const rows = rotations
    .map((r) => ({ id: r.id, name: r.name, icon: r.icon, e: byRotation[r.id] }))
    .filter((r) => r.e && r.e.n > 0)

  if (total === 0) {
    return (
      <div className="study-shell">
        <div className="page-head">
          <h1>Your progress</h1>
          <p className="sub">Answer some flashcards and quizzes and this page fills in — it tracks how you do per rotation and surfaces your weakest topics so you know exactly where to focus.</p>
        </div>
        {readinessSection}
        <div className="card result-card">
          <div className="big"><Icon name="seedling" size={52} strokeWidth={1.6} /></div>
          <h2>Nothing tracked yet</h2>
          <p className="muted">Start a flashcard session or a quiz and come back.</p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 14 }}>
            <Link className="btn primary" to="/study">Study due now</Link>
            <Link className="btn" to="/">Pick a rotation</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>Your progress</h1>
        <p className="sub">Based on {total} answered question{total === 1 ? '' : 's'}. This is the data your future weak-area coaching will run on.</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 800, color: accColor(overallPct) }}>{overallPct}%</span>
          <span className="muted">overall accuracy · {overallCorrect}/{total} correct</span>
        </div>
      </div>

      {readinessSection}

      {weak.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <label className="section-title" style={{ marginTop: 0 }}>Focus here — your weakest topics</label>
          <ul className="weak-list">
            {weak.map((t) => {
              const p = Math.round(t.wAcc * 100)
              const key = `${t.rotation}-${t.topic}`
              return (
                <li key={key}>
                  <div className="weak-item">
                    <span className="weak-topic">
                      {t.topic} <TrendMark trend={t.trend} />
                    </span>
                    <span className="weak-meta">
                      <Link to={`/r/${t.rotation}/flashcards`} className="muted" title={`Study ${rotationName(t.rotation)}`}>
                        {rotationName(t.rotation)}
                      </Link>
                      <span style={{ color: accColor(p), fontWeight: 700 }}>{p}%</span>
                      {hasKey && (
                        <button className="btn ghost weak-drill" disabled={!!busyKey} onClick={() => drill(t)}>
                          {busyKey === key ? 'Generating…' : 'Drill'}
                        </button>
                      )}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          {drillMsg && (
            <div className="explain" style={{ marginTop: 10, borderColor: drillMsg.error ? 'var(--danger)' : 'var(--primary)' }}>
              {drillMsg.text}{' '}
              {!drillMsg.error && (
                <Link to={`/r/${drillMsg.rotation}/flashcards`} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  Study now →
                </Link>
              )}
            </div>
          )}
          <p className="muted" style={{ fontSize: '0.8rem', margin: '10px 0 0' }}>
            {hasKey ? (
              'Drill generates 5 fresh AI cards on that topic (your API key) and adds them to the deck — so your weakest areas turn into practice.'
            ) : (
              <>
                Add your Anthropic API key in{' '}
                <Link to="/settings" style={{ color: 'var(--primary)', fontWeight: 700 }}>Settings</Link>{' '}
                to generate targeted practice from your weak spots.
              </>
            )}{' '}
            Recency-weighted; only topics answered ≥3 times are ranked. ↑ improving · ↓ slipping.
          </p>
        </div>
      )}

      <div className="card">
        <label className="section-title" style={{ marginTop: 0 }}>Accuracy by rotation</label>
        {rows.map((r) => {
          const p = pct(r.e.correct, r.e.n)
          return (
            <Link key={r.id} to={`/r/${r.id}`} className="acc-row">
              <span className="acc-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name={r.icon} size={16} style={{ color: 'var(--primary)', flex: 'none' }} />
                {r.name}
              </span>
              <span className="acc-bar">
                <span style={{ width: `${p}%`, background: accColor(p) }} />
              </span>
              <span className="acc-val">{p}% <span className="muted">({r.e.n})</span></span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
