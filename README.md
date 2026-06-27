# 🩺 BabyClerk

A study companion for medical clerkship rotations — so you never feel unprepared and can answer your tutor's questions every time.

Built as a fast, mobile-friendly web app. All your progress (spaced-repetition schedule, quiz scores, checklist ticks) is saved locally in your browser.

## Study modes

Each rotation gives you four ways to learn the same high-yield material:

- **📖 Notes** — condensed, structured revision per topic.
- **🃏 Flashcards** — active recall with a built-in spaced-repetition scheduler (Again / Hard / Good).
- **🗣️ Viva Drills** — tutor-style ("pimping") questions with model answers. Answer out loud, then reveal.
- **✅ Quiz** — one-best-answer MCQs with explanations and score tracking.
- **📋 Prep Checklist** — the essentials to walk into each rotation confident.

## Rotations included

Internal Medicine · Surgery · Paediatrics · Obstetrics & Gynaecology · Psychiatry · Family Medicine · Neurology

The seeded content is a **high-yield starter set** to get you going — extend it as you learn (see below).

## Run it locally

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Add or edit content

All study material lives in `src/data/rotations/`, one file per rotation. Each file is a plain JavaScript object — no build tooling knowledge needed. The shape is:

```js
{
  id: 'internal-medicine',     // unique, used in the URL
  name: 'Internal Medicine',
  emoji: '🩺',
  blurb: 'One-line description',
  checklist: ['...'],
  notes:      [{ id, title, topic, sections: [{ heading, points: ['...'] }] }],
  flashcards: [{ id, topic, front, back }],
  viva:       [{ id, topic, question, answer }],
  mcqs:       [{ id, topic, question, options: ['...'], answer: 0, explanation }],
}
```

- To **add a card/question**, append an item to the relevant array (give it a unique `id`).
- To **add a whole rotation**, create a new file in `src/data/rotations/` and import it in `src/data/rotations/index.js`.
- `answer` in `mcqs` is the **index** (0-based) of the correct option.

## Deploy (free)

The app is a static site and works on any static host.

- **GitHub Pages:** `DEPLOY_TARGET=gh-pages npm run build`, then publish `dist/`. The `base` path is preconfigured for `https://<user>.github.io/babyclerk/`.
- **Vercel / Netlify:** just `npm run build` and deploy `dist/` (base path stays `/`).

## A note on medical content

This is a revision aid built from common high-yield teaching points and uses UK-style guidance in places. **Always defer to your local guidelines, current evidence, and your seniors** for real patient care.
