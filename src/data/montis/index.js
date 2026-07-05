// Montis Complete Clerkship — a community Anki deck, bundled as built-in
// flashcards (~1,929 cards). Cards carry stable content-hash IDs so your
// spaced-repetition history survives app updates.
//
// Credit: the Montis Complete Clerkship deck (community-shared). This content
// is third-party study material included for personal study use.
import internalMedicine from './internal-medicine.json'
import surgery from './surgery.json'
import obgyn from './obgyn.json'
import pediatrics from './pediatrics.json'
import psychiatry from './psychiatry.json'

const MONTIS = {
  'internal-medicine': internalMedicine,
  surgery,
  obgyn,
  pediatrics,
  psychiatry,
}

export function montisCards(rotationId) {
  return MONTIS[rotationId] || []
}
