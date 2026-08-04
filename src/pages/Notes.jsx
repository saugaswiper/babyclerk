import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'

export default function Notes() {
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

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — Notes</h1>
        <p className="sub">Condensed, high-yield revision for the topics you’ll be quizzed on.</p>
      </div>

      {rotation.notes.map((note) => (
        <div key={note.id} className="card note-block">
          <span className="topic-tag">{note.topic}</span>
          <h2>{note.title}</h2>
          {note.sections.map((s, i) => (
            <div key={i} className="note-section">
              <h3>{s.heading}</h3>
              <ul>
                {s.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      <div className="btn-row" style={{ justifyContent: 'center', marginTop: 8 }}>
        <Link className="btn primary" to={`/r/${rotation.id}/flashcards`}>
          Drill these as flashcards →
        </Link>
        <Link className="btn ghost" to={`/r/${rotation.id}`}>
          Back to {rotation.name}
        </Link>
      </div>
    </div>
  )
}
