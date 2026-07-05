# 🩺 BabyClerk

A study companion for medical clerkship rotations — so you never feel unprepared and can answer your tutor's questions every time. Tailored for **Queen's University (Canada)** and the **MCCQE**: Canadian guidelines and terminology (Ontario Mental Health Act, Hypertension Canada, Diabetes Canada, CCS lipids) and SI units.

Built as a fast, mobile-friendly web app. All your progress (spaced-repetition schedule, quiz scores, checklist ticks, and any cards you add) is saved locally in your browser.

## Daily use

- **▶ Study due** — one tap on the home screen runs every due card across all rotations in a single spaced-repetition session.
- **🔍 Search** — instant lookup across every flashcard, viva question, MCQ, and note (including your imported cards).
- **📱 Installable PWA** — works offline. On your phone, open the site → Share → *Add to Home Screen*; it launches like a native app with no connection needed.
- **💾 Backup** — Settings → Export backup saves all progress + imported cards to a file; Restore imports it on any device (API key excluded).

## Study modes

Each rotation gives you several ways to learn the same high-yield material:

- **📖 Notes** — condensed, structured revision per topic.
- **🃏 Flashcards** — active recall with a built-in spaced-repetition scheduler (Again / Hard / Good).
- **🗣️ Viva Drills** — tutor-style ("pimping") questions with model answers. Answer out loud, then reveal.
- **✅ Quiz** — one-best-answer MCQs with explanations and score tracking.
- **📋 Prep Checklist** — the essentials to walk into each rotation confident.
- **✨ AI Generate** — create fresh questions on demand with Claude, then save them into your deck (needs your own Anthropic API key — see below).
- **📥 Import** — bring in your own cards from Anki exports, spreadsheets (CSV/TSV), or JSON.

## Rotations included

Internal Medicine · Surgery · Paediatrics · Obstetrics & Gynaecology · Psychiatry · Family Medicine · Neurology

The seeded content is a **high-yield starter set** to get you going — extend it with the AI/Import tools or by editing the data files (see below).

## AI generation

Open **Settings** (⚙️ top-right) and paste an [Anthropic API key](https://console.anthropic.com/settings/keys). Then any rotation's **AI Generate** tab can produce new flashcards, viva questions, or MCQs (defaulting to `claude-opus-4-8`, with Sonnet/Haiku options for lower cost). Generated items are previewed before you add them.

> ⚠️ This is a static site that calls Anthropic **directly from your browser** using your key, which is stored only in your browser's local storage. That's fine for personal use on your own device — don't enter your key on a shared/public computer.

## Built-in card deck

The app ships with **~1,929 flashcards** from the **Montis Complete Clerkship** community Anki deck, bundled across Internal Medicine, Surgery, OB/GYN, Paediatrics, and Psychiatry. They're available on every device with no import step, and carry stable IDs so your spaced-repetition history survives updates. Your own edits and imports layer on top. Credit to the Montis deck authors; included here as third-party study material for personal use.

## Importing your own cards

The **Import** tab accepts:
- **Flashcards (text)** — one card per line as `front <Tab> back` (Anki's "Notes in Plain Text" export pastes straight in) or comma-separated.
- **JSON** — arrays of flashcards/viva/MCQs matching the data shapes below.

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

- **GitHub Pages (automated):** a workflow at `.github/workflows/deploy.yml` builds and deploys on every push to the dev branch (or `main`). One-time setup: repo **Settings → Pages → Source: GitHub Actions**. It builds with `DEPLOY_TARGET=gh-pages` so the `base` path matches `https://<user>.github.io/babyclerk/`.
- **GitHub Pages (manual):** `DEPLOY_TARGET=gh-pages npm run build`, then publish `dist/`.
- **Vercel / Netlify:** just `npm run build` and deploy `dist/` (base path stays `/`).

## A note on medical content

This is a revision aid built from common high-yield teaching points and uses UK-style guidance in places. **Always defer to your local guidelines, current evidence, and your seniors** for real patient care.
