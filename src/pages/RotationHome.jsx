import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countDue } from '../lib/srs.js'

const MODES = [
  { slug: 'notes', icon: '📖', name: 'Notes', desc: 'High-yield topic notes' },
  { slug: 'flashcards', icon: '🃏', name: 'Flashcards', desc: 'Spaced-repetition recall' },
  { slug: 'viva', icon: '🗣️', name: 'Viva Drills', desc: 'Tutor-style Q&A' },
  { slug: 'quiz', icon: '✅', name: 'Quiz', desc: 'MCQs with explanations' },
  { slug: 'checklist', icon: '📋', name: 'Prep Checklist', desc: 'Be rotation-ready' },
]

export default function RotationHome() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const srsState = readStored(`srs:${rotation.id}`, {})
  const due = countDue(rotation.flashcards, srsState)

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
        <h1>
          {rotation.emoji} {rotation.name}
        </h1>
        <p className="sub">{rotation.blurb}</p>
      </div>

      <div className="grid mode-grid">
        {MODES.map((m) => (
          <Link key={m.slug} to={`/r/${rotation.id}/${m.slug}`} className="card tile mode-tile">
            <span className="ico">{m.icon}</span>
            <span className="meta">
              <h3>{m.name}</h3>
              <p>
                {m.desc}
                {' · '}
                {counts[m.slug]} {m.slug === 'flashcards' ? 'cards' : m.slug === 'quiz' ? 'Qs' : 'items'}
                {m.slug === 'flashcards' && due > 0 ? ` · ${due} due` : ''}
              </p>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
