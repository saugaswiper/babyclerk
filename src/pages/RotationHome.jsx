import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotationMerged } from '../lib/customContent.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countToday } from '../lib/scheduler.js'
import { forecastRotation, isWorthShowing } from '../lib/forecast.js'
import { ReadinessCard } from '../components/Readiness.jsx'
import Icon from '../components/Icon.jsx'

const MODES = [
  { slug: 'notes', icon: 'book', name: 'Notes', desc: 'High-yield topic notes' },
  { slug: 'flashcards', icon: 'cards', name: 'Flashcards', desc: 'Spaced-repetition recall' },
  { slug: 'viva', icon: 'chat', name: 'Viva Drills', desc: 'Tutor-style Q&A' },
  { slug: 'quiz', icon: 'check-circle', name: 'Quiz', desc: 'MCQs with explanations' },
  { slug: 'checklist', icon: 'clipboard', name: 'Prep Checklist', desc: 'Be rotation-ready' },
  { slug: 'generate', icon: 'sparkles', name: 'AI Generate', desc: 'Fresh questions on demand' },
  { slug: 'material', icon: 'book', name: 'My material', desc: 'Cards from your own textbook or notes' },
  { slug: 'import', icon: 'download', name: 'Import', desc: 'Add your own cards' },
  { slug: 'io', icon: 'image', name: 'Image Occlusion', desc: 'Make image hide-cards' },
]

export default function RotationHome() {
  const { rotationId } = useParams()
  const rotation = getRotationMerged(rotationId)

  // Bumped when the readiness card changes the daily pace, so we recompute.
  const [tick, setTick] = useState(0)
  const forecast = useMemo(
    () => (rotation ? forecastRotation(rotation.id, rotation.flashcards) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rotation?.id, tick],
  )

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const srsState = readStored(`srs:${rotation.id}`, {})
  const due = countToday(rotation.flashcards, srsState, rotation.id)

  const counts = {
    notes: rotation.notes.length,
    flashcards: rotation.flashcards.length,
    viva: rotation.viva.length,
    quiz: rotation.mcqs.length,
    checklist: rotation.checklist.length,
  }

  return (
    <>
      <div className="page-head">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="tile-ico" style={{ width: 36, height: 36 }}><Icon name={rotation.icon} size={22} /></span>
          {rotation.name}
        </h1>
        <p className="sub">{rotation.blurb}</p>
      </div>

      {isWorthShowing(forecast) && (
        <ReadinessCard f={forecast} onBudgetChange={() => setTick((t) => t + 1)} />
      )}

      <div className="grid mode-grid">
        {MODES.map((m) => (
          <Link key={m.slug} to={`/r/${rotation.id}/${m.slug}`} className="card tile mode-tile">
            <span className="ico"><Icon name={m.icon} size={22} /></span>
            <span className="meta">
              <h3>{m.name}</h3>
              <p>
                {m.desc}
                {counts[m.slug] != null && (
                  <>
                    {' · '}
                    {counts[m.slug]} {m.slug === 'flashcards' ? 'cards' : m.slug === 'quiz' ? 'Qs' : 'items'}
                    {m.slug === 'flashcards' && due > 0 ? ` · ${due} due` : ''}
                  </>
                )}
              </p>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
