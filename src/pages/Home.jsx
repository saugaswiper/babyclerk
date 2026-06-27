import { Link } from 'react-router-dom'
import { rotations } from '../data/rotations/index.js'
import { readStored } from '../lib/useLocalStorage.js'
import { countDue } from '../lib/srs.js'

export default function Home() {
  return (
    <>
      <div className="page-head">
        <h1>Pick a rotation</h1>
        <p className="sub">
          Drill flashcards, viva questions, MCQs and high-yield notes so you’re never caught out on the wards.
        </p>
      </div>

      <div className="grid">
        {rotations.map((r) => {
          const srsState = readStored(`srs:${r.id}`, {})
          const due = countDue(r.flashcards, srsState)
          return (
            <Link key={r.id} to={`/r/${r.id}`} className="card tile">
              <span className="tile-emoji">{r.emoji}</span>
              <h3>{r.name}</h3>
              <p>{r.blurb}</p>
              <div className="tile-stat">
                <span>{r.flashcards.length} cards</span>
                <span>{r.mcqs.length} MCQs</span>
                {due > 0 && <span className="due">{due} due</span>}
              </div>
            </Link>
          )
        })}
      </div>

      <p className="kbd-hint">
        Tip: start with <strong>Notes</strong> to learn, then <strong>Flashcards</strong> &amp;{' '}
        <strong>Viva</strong> to drill, then <strong>Quiz</strong> to test yourself.
      </p>
    </>
  )
}
