import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRotation } from '../data/rotations/index.js'
import { addIOCard } from '../lib/customContent.js'

// Downscale an uploaded image so it fits comfortably in localStorage.
function fileToScaledDataURL(file, maxDim = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = String(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function IOCreate() {
  const { rotationId } = useParams()
  const rotation = getRotation(rotationId)

  const [image, setImage] = useState(null)
  const [boxes, setBoxes] = useState([])
  const [draft, setDraft] = useState(null)
  const [topic, setTopic] = useState('')
  const [back, setBack] = useState('')
  const [saved, setSaved] = useState(0)
  const startRef = useRef(null)
  const wrapRef = useRef(null)

  if (!rotation) {
    return (
      <div className="empty">
        <p>Rotation not found.</p>
        <Link className="btn" to="/">Back to rotations</Link>
      </div>
    )
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(await fileToScaledDataURL(file))
    setBoxes([])
    setSaved(0)
  }

  const rel = (e) => {
    const r = wrapRef.current.getBoundingClientRect()
    return {
      x: Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1),
      y: Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1),
    }
  }

  const onDown = (e) => {
    e.preventDefault()
    startRef.current = rel(e)
    setDraft({ ...startRef.current, w: 0, h: 0 })
    wrapRef.current.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (!startRef.current) return
    const p = rel(e)
    const s = startRef.current
    setDraft({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) })
  }
  const onUp = () => {
    if (draft && draft.w > 0.02 && draft.h > 0.02) setBoxes((b) => [...b, draft])
    setDraft(null)
    startRef.current = null
  }

  const save = () => {
    if (!image || boxes.length === 0) return
    addIOCard(rotation.id, { topic: topic.trim(), image, boxes, back: back.trim() })
    setSaved((n) => n + 1)
    // reset for the next card, keep the image so you can mask another region
    setBoxes([])
    setBack('')
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>{rotation.name} — Image occlusion</h1>
        <p className="sub">Upload an image, drag to draw boxes over what you want to hide, then save.</p>
      </div>

      <div className="card">
        <label className="section-title" style={{ marginTop: 0 }}>Image</label>
        <input type="file" accept="image/*" onChange={onFile} className="text-input" />

        {image && (
          <>
            <p className="muted" style={{ fontSize: '0.85rem', margin: '10px 0' }}>
              Drag on the image to add a hide-box. {boxes.length} box{boxes.length === 1 ? '' : 'es'} so far.
            </p>
            <div
              ref={wrapRef}
              className="io-editor"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
            >
              <img src={image} alt="" draggable={false} />
              {boxes.map((b, i) => (
                <div
                  key={i}
                  className="io-box"
                  style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }}
                />
              ))}
              {draft && (
                <div
                  className="io-draft"
                  style={{ left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, width: `${draft.w * 100}%`, height: `${draft.h * 100}%` }}
                />
              )}
            </div>

            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn ghost" onClick={() => setBoxes((b) => b.slice(0, -1))} disabled={!boxes.length}>
                Undo box
              </button>
              <button className="btn ghost" onClick={() => setBoxes([])} disabled={!boxes.length}>
                Clear boxes
              </button>
            </div>

            <label className="section-title" htmlFor="io-topic">Topic (optional)</label>
            <input id="io-topic" className="text-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Brachial plexus" />

            <label className="section-title" htmlFor="io-back">Note shown on reveal (optional)</label>
            <input id="io-back" className="text-input" value={back} onChange={(e) => setBack(e.target.value)} placeholder="e.g. C5–T1 roots" />

            <div className="btn-row" style={{ marginTop: 14 }}>
              <button className="btn primary" onClick={save} disabled={boxes.length === 0}>
                Save card
              </button>
              <Link className="btn ghost" to={`/r/${rotation.id}/flashcards`}>
                Study deck
              </Link>
            </div>
            {saved > 0 && (
              <div className="explain" style={{ marginTop: 12, borderColor: 'var(--good)' }}>
                Saved {saved} card{saved === 1 ? '' : 's'} to your {rotation.name} deck. Draw more boxes on the same image for another, or upload a new image.
              </div>
            )}
          </>
        )}
      </div>

      <p className="kbd-hint">Great for anatomy, ECGs, X-rays, and algorithm diagrams. Images are stored on this device only.</p>
    </div>
  )
}
