import { useParams, Link } from 'react-router-dom'
import { getRotationMerged } from '../lib/customContent.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countToday, introducedToday } from '../lib/scheduler.js'
import { rotationPlan } from '../lib/rotationPhase.js'
import { prepProgress } from '../lib/checklist.js'
import Icon from '../components/Icon.jsx'

const MODES = [
  { slug: 'notes', icon: 'book', name: 'Notes', desc: 'High-yield topic notes' },
  { slug: 'flashcards', icon: 'cards', name: 'Flashcards', desc: 'Spaced-repetition recall' },
  { slug: 'viva', icon: 'chat', name: 'Viva Drills', desc: 'Tutor-style Q&A' },
  { slug: 'quiz', icon: 'check-circle', name: 'Quiz', desc: 'MCQs with explanations' },
  { slug: 'checklist', icon: 'clipboard', name: 'Prep Checklist', desc: 'Be rotation-ready' },
  { slug: 'generate', icon: 'sparkles', name: 'AI Generate', desc: 'Fresh questions on demand' },
  { slug: 'import', icon: 'download', name: 'Import', desc: 'Add your own cards' },
  { slug: 'io', icon: 'image', name: 'Image Occlusion', desc: 'Make image hide-cards' },
]

export default function RotationHome() {
  const { rotationId } = useParams()
  const rotation = getRotationMerged(rotationId)

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
  const plan = rotationPlan(rotation.id)
  const prep = prepProgress(rotation.id, rotation.checklist)
  const newLeft = Math.max(0, plan.newLimit - introducedToday(rotation.id))

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

      {plan.phase !== 'off' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <strong>{plan.label}</strong>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.88rem' }}>
            {plan.note}{' '}
            {plan.newLimit > 0
              ? `${newLeft} of ${plan.newLimit} new card${plan.newLimit === 1 ? '' : 's'} left today.`
              : 'New cards are paused — reviews still come back on schedule.'}
          </p>
        </div>
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
                    {m.slug === 'checklist' && prep.left > 0 ? ` · ${prep.left} to do` : ''}
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
