// Renders the inner content of a flashcard for any card type: image-occlusion,
// cloze, or plain front/back. Used by both the per-rotation deck and Study Due.
import ImageOcclusion from './ImageOcclusion.jsx'
import { isCloze, clozeFront, clozeReveal } from '../lib/cloze.js'

export default function CardFace({ card, flipped }) {
  if (card.type === 'io' && card.image) {
    return (
      <div className="content" style={{ width: '100%' }}>
        <ImageOcclusion image={card.image} boxes={card.boxes} revealed={flipped} />
        {flipped && card.back && <p style={{ marginTop: 12 }}>{card.back}</p>}
      </div>
    )
  }
  if (isCloze(card)) {
    return (
      <div className={`content ${flipped ? 'answer' : ''}`}>
        {flipped ? clozeReveal(card.cloze) : clozeFront(card.cloze)}
      </div>
    )
  }
  return (
    <div className={`content ${flipped ? 'answer' : ''}`}>{flipped ? card.back : card.front}</div>
  )
}
