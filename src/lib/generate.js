// Generate study items on demand with the Claude API, directly from the browser.
//
// NOTE: this calls Anthropic from the browser using the user's own API key
// (stored only in their localStorage). That key is visible to anything running
// in this browser — fine for a personal study tool, not for a shared/public site.
import Anthropic from '@anthropic-ai/sdk'

const KIND_LABEL = {
  flashcards: 'flashcards (active-recall question/answer pairs)',
  viva: 'oral-exam "viva"/"pimping" questions with thorough model answers',
  mcqs: 'single-best-answer multiple-choice questions',
  cloze: 'cloze-deletion cards: one high-yield sentence each, with the key term(s) wrapped in {{double braces}}',
}

function schemaFor(kind) {
  if (kind === 'cloze') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'cloze'],
            properties: {
              topic: { type: 'string' },
              cloze: { type: 'string', description: 'A sentence with the key term(s) wrapped in {{double braces}}' },
            },
          },
        },
      },
    }
  }
  if (kind === 'mcqs') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'question', 'options', 'answer', 'explanation'],
            properties: {
              topic: { type: 'string' },
              question: { type: 'string' },
              options: { type: 'array', items: { type: 'string' } },
              answer: { type: 'integer', description: '0-based index of the correct option' },
              explanation: { type: 'string' },
            },
          },
        },
      },
    }
  }
  if (kind === 'viva') {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['topic', 'question', 'answer'],
            properties: {
              topic: { type: 'string' },
              question: { type: 'string' },
              answer: { type: 'string' },
            },
          },
        },
      },
    }
  }
  // flashcards
  return {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['topic', 'front', 'back'],
          properties: {
            topic: { type: 'string' },
            front: { type: 'string' },
            back: { type: 'string' },
          },
        },
      },
    },
  }
}

function promptFor({ rotationName, topic, kind, count }) {
  const focus = topic ? `Focus specifically on: ${topic}.` : 'Cover a spread of high-yield topics for the rotation.'
  return [
    `You are a senior clinician-educator helping a Canadian medical student (Queen's University) prepare for their ${rotationName} clerkship rotation and the MCCQE.`,
    `Generate exactly ${count} ${KIND_LABEL[kind]}.`,
    focus,
    'Make them high-yield, accurate, and clinically realistic — the kind of thing a tutor would ask on rounds.',
    'Prefer Canadian guidelines/terminology and SI units where relevant.',
    'For MCQs, provide 4 options with exactly one best answer and a concise explanation of why it is correct.',
    'For cloze cards, write one high-yield sentence each and wrap only the key testable term(s) in {{double braces}}.',
    'Return only the structured data requested.',
  ].join(' ')
}

export async function generateItems({ apiKey, model, rotationName, topic, kind, count }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: model || 'claude-opus-4-8',
    max_tokens: 4096,
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', name: 'study_items', schema: schemaFor(kind) },
    },
    messages: [{ role: 'user', content: promptFor({ rotationName, topic, kind, count }) }],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('The request was declined by the safety system. Try rephrasing the topic.')
  }

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

  let parsed
  try {
    // Tolerate an accidental code fence just in case.
    const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Could not parse the response. Please try again.')
  }

  const items = parsed.items || []
  if (!items.length) throw new Error('No items were generated. Try again or adjust the topic.')
  return items
}
