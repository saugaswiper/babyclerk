// Cloze-deletion cards. A card is a cloze card when it has a `cloze` string
// containing Anki-style deletions: {{c1::answer}} or {{c1::answer::hint}}.
// (Bare {{answer}} is normalised to {{c1::answer}} on import.)
const RE = /\{\{c\d+::(.*?)(?:::([^}]*?))?\}\}/g

export function isCloze(card) {
  return card && typeof card.cloze === 'string' && card.cloze.length > 0
}

// Front: hide each deletion (show its hint if provided, else […]).
export function clozeFront(text) {
  return text.replace(RE, (_m, _ans, hint) => (hint ? `[${hint}]` : '[…]'))
}

// Back / plain: reveal the answers.
export function clozeReveal(text) {
  return text.replace(RE, (_m, ans) => ans)
}

// Normalise a raw line into a cloze card body: turn bare {{x}} into {{c1::x}}.
// Returns null if the line has no {{...}} deletion.
export function normaliseCloze(line) {
  const s = line.trim()
  if (!/\{\{.+?\}\}/.test(s)) return null
  let i = 0
  return s.replace(/\{\{(.+?)\}\}/g, (_m, inner) => {
    if (/^c\d+::/.test(inner)) return `{{${inner}}}`
    i += 1
    return `{{c${i}::${inner}}}`
  })
}
