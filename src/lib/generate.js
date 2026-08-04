// Generate study items on demand with the Claude API, directly from the browser.
//
// NOTE: this calls Anthropic from the browser using the user's own API key
// (stored only in their localStorage). That key is visible to anything running
// in this browser — fine for a personal study tool, not for a shared/public site.
//
// Grounded generation: when a `source` is provided, items are generated strictly
// from that text (paraphrased, with a per-item pointer to where it came from).
// Ground public/shippable content only on openly-licensed sources — see
// vault/Licensing-and-Copyright.md and vault/Content-Strategy.md.
import Anthropic from '@anthropic-ai/sdk'

const KIND_LABEL = {
  flashcards: 'flashcards (active-recall question/answer pairs)',
  viva: 'oral-exam "viva"/"pimping" questions with thorough model answers',
  mcqs: 'single-best-answer multiple-choice questions',
  cloze: 'cloze-deletion cards: one high-yield sentence each, with the key term(s) wrapped in {{double braces}}',
}

const SOURCE_LIMIT = 16000 // chars of source text fed to the model (bounds cost)

// Base item properties per kind (a `source` field is added for grounded runs).
function itemProps(kind) {
  if (kind === 'cloze') {
    return {
      required: ['topic', 'cloze'],
      properties: {
        topic: { type: 'string' },
        cloze: { type: 'string', description: 'A sentence with the key term(s) wrapped in {{double braces}}' },
      },
    }
  }
  if (kind === 'mcqs') {
    return {
      required: ['topic', 'question', 'options', 'answer', 'explanation'],
      properties: {
        topic: { type: 'string' },
        question: { type: 'string' },
        options: { type: 'array', items: { type: 'string' } },
        answer: { type: 'integer', description: '0-based index of the correct option' },
        explanation: { type: 'string' },
      },
    }
  }
  if (kind === 'viva') {
    return {
      required: ['topic', 'question', 'answer'],
      properties: {
        topic: { type: 'string' },
        question: { type: 'string' },
        answer: { type: 'string' },
      },
    }
  }
  return {
    required: ['topic', 'front', 'back'],
    properties: {
      topic: { type: 'string' },
      front: { type: 'string' },
      back: { type: 'string' },
    },
  }
}

function schemaFor(kind, grounded) {
  const { required, properties } = itemProps(kind)
  const props = { ...properties }
  if (grounded) {
    props.source = {
      type: 'string',
      description: 'Short pointer to the part of the provided source this item is based on (e.g. a heading or key phrase).',
    }
  }
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
          required, // `source` intentionally optional
          properties: props,
        },
      },
    },
  }
}

function promptFor({ rotationName, topic, kind, count, source, sourceName, truncated }) {
  const focus = topic ? `Focus specifically on: ${topic}.` : 'Cover a spread of high-yield topics for the rotation.'
  const lines = [
    `You are a senior clinician-educator helping a Canadian medical student (Queen's University) prepare for their ${rotationName} clerkship rotation and the MCCQE.`,
    `Generate exactly ${count} ${KIND_LABEL[kind]}.`,
    focus,
    'Make them high-yield, accurate, and clinically realistic — the kind of thing a tutor would ask on rounds.',
    'Prefer Canadian guidelines/terminology and SI units where relevant.',
    'For MCQs, provide 4 options with exactly one best answer and a concise explanation of why it is correct.',
    'For cloze cards, write one high-yield sentence each and wrap only the key testable term(s) in {{double braces}}.',
  ]

  if (source) {
    lines.push(
      'GROUNDING: Base every item strictly on the SOURCE below.',
      '- Use only facts supported by the source; do not add outside facts.',
      '- Paraphrase in your own words — never copy sentences verbatim.',
      `- If the source can't support ${count} strong items, generate fewer rather than inventing.`,
      '- Set each item\'s "source" field to a short pointer (a heading or key phrase) to where in the source it came from.',
      truncated ? '- Note: the source was truncated to fit; work only with what is shown.' : '',
      `SOURCE (${sourceName || 'provided material'}):`,
      '"""',
      source,
      '"""'
    )
  }

  lines.push('Return only the structured data requested.')
  return lines.filter(Boolean).join('\n')
}

export async function generateItems({ apiKey, model, rotationName, topic, kind, count, source, sourceName }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const rawSource = (source || '').trim()
  const truncated = rawSource.length > SOURCE_LIMIT
  const grounded = rawSource.length > 0
  const usableSource = truncated ? rawSource.slice(0, SOURCE_LIMIT) : rawSource

  const response = await client.messages.create({
    model: model || 'claude-opus-4-8',
    max_tokens: grounded ? 8000 : 4096,
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', name: 'study_items', schema: schemaFor(kind, grounded) },
    },
    messages: [
      {
        role: 'user',
        content: promptFor({
          rotationName,
          topic,
          kind,
          count,
          source: usableSource,
          sourceName,
          truncated,
        }),
      },
    ],
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
    const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Could not parse the response. Please try again.')
  }

  const items = parsed.items || []
  if (!items.length) throw new Error('No items were generated. Try again or adjust the topic.')
  return items
}
