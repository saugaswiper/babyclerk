// Registry of all rotations. To add a new rotation, create a file in this folder
// following the same shape and import it here.
//
// Rotation shape:
//   { id, name, emoji, blurb, checklist: string[],
//     notes:   [{ id, title, topic, sections: [{ heading, points: string[] }] }],
//     flashcards: [{ id, topic, front, back }],
//     viva:    [{ id, topic, question, answer }],
//     mcqs:    [{ id, topic, question, options: string[], answer: number, explanation }] }

import internalMedicine from './internalMedicine.js'
import surgery from './surgery.js'
import pediatrics from './pediatrics.js'
import obgyn from './obgyn.js'
import psychiatry from './psychiatry.js'
import familyMedicine from './familyMedicine.js'
import neurology from './neurology.js'

export const rotations = [
  internalMedicine,
  surgery,
  pediatrics,
  obgyn,
  psychiatry,
  familyMedicine,
  neurology,
]

export function getRotation(id) {
  return rotations.find((r) => r.id === id)
}
