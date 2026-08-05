// The tutor moment: an explanation at the point of failure, not a deck-building
// tool. Grounded strictly on the card in front of the student — the stem, the
// options, the keyed answer and its existing explanation — so the model is
// clarifying material the app already ships rather than inventing new medicine.
//
// Costs the user an API call each time, so this must never fire automatically.
// See vault/Improvement-Proposals.md (P4).
import Anthropic from '@anthropic-ai/sdk'

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['correct', 'contrast', 'remember'],
  properties: {
    correct: {
      type: 'string',
      description: 'Why the correct answer is correct — name the discriminating feature. 1-2 sentences.',
    },
    contrast: {
      type: 'string',
      description:
        "Why the student's choice is wrong and what clinical picture would actually make it right; " +
        'for a flashcard, the thing this is most often confused with. 1-2 sentences.',
    },
    remember: {
      type: 'string',
      description: 'One short, concrete hook for remembering the discriminator next time. One line.',
    },
  },
}

function mcqPrompt({ rotationName, card, chosen }) {
  const opts = card.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')
  return [
    `A Canadian medical student on their ${rotationName} clerkship rotation just got this question wrong.`,
    '',
    `QUESTION: ${card.question}`,
    opts,
    `KEYED ANSWER: ${String.fromCharCode(65 + card.answer)}. ${card.options[card.answer]}`,
    card.explanation ? `EXISTING EXPLANATION: ${card.explanation}` : null,
    `THE STUDENT CHOSE: ${String.fromCharCode(65 + chosen)}. ${card.options[chosen]}`,
    '',
    'Explain the miss. Use only the material above — do not introduce facts it does not support.',
    'Be direct and specific: name the feature that discriminates the keyed answer from what they picked.',
    'No preamble, no praise, no restating the question. Keep the whole thing under 120 words.',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

function cardPrompt({ rotationName, card }) {
  return [
    `A Canadian medical student on their ${rotationName} clerkship rotation just failed to recall this flashcard.`,
    '',
    `FRONT: ${card.front}`,
    `BACK: ${card.back}`,
    '',
    'Explain what they needed to know. Use only the material above — do not introduce facts it does not support.',
    'For "contrast", give the thing this is most commonly confused with and how to tell them apart.',
    'No preamble, no praise. Keep the whole thing under 120 words.',
  ].join('\n')
}

/**
 * Explain a specific miss.
 * @param {object} o
 * @param {'mcq'|'flashcard'} o.kind
 * @param {object} o.card   the MCQ (question/options/answer/explanation) or flashcard (front/back)
 * @param {number} [o.chosen] index the student picked (MCQs only)
 * @returns {Promise<{correct: string, contrast: string, remember: string}>}
 */
export async function explainMiss({ apiKey, model, rotationName, kind, card, chosen }) {
  if (!apiKey) throw new Error('Add your Anthropic API key in Settings to use this.')
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const prompt =
    kind === 'mcq' ? mcqPrompt({ rotationName, card, chosen }) : cardPrompt({ rotationName, card })

  const response = await client.messages.create({
    model: model || 'claude-opus-4-8',
    max_tokens: 1024,
    output_config: {
      effort: 'low', // short, focused answer — no need to burn thinking here
      format: { type: 'json_schema', name: 'miss_explanation', schema: SCHEMA },
    },
    messages: [{ role: 'user', content: prompt }],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('The request was declined by the safety system.')
  }

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  try {
    return JSON.parse(text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim())
  } catch {
    throw new Error('Could not parse the explanation. Please try again.')
  }
}
