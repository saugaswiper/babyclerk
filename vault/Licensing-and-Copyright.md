# Licensing & Copyright ⚠️

**Read this before adding, bundling, or hosting any content.** This is a launch-blocking legal boundary, not a style preference. When unsure, **ask the user before shipping** — see [[Principles]].

## The bright line
> **Never publicly host or distribute content we don't have the right to distribute.**

The app is public (GitHub Pages). Anything **bundled into the build or hosted on our servers** is effectively published to the world. Anything a **user imports into their own device/account** is theirs and private.

## Rules
| Content | Public/bundled? | Notes |
|---|---|---|
| **Original content** (ours) | ✅ yes | The shippable baseline — see [[Content-Strategy]]. |
| **Openly-licensed** (CC-BY, etc.) | ✅ yes, **with attribution** | Verify the license actually permits redistribution + our use. Keep an attribution record. |
| **UWorld / AMBOSS / commercial Q-banks** | ❌ never | Import-only, private to the user. Never bundle, never host. |
| **Third-party Anki decks** | ⚠️ depends | Only bundle if the deck's license clearly permits redistribution. Otherwise import-only. |
| **AI-generated** | ✅ (ours) but marked | Must be verifiable; don't launder copyrighted text through AI. |
| **User's own notes/imports** | ✅ private to them | Stored in their `localStorage`/account, never made public. |

## Action item: the bundled Montis deck
The baseline currently bundles the **Montis** deck (a third-party Anki deck). Before treating the app as launchable to the public, **confirm its license permits redistribution** — or replace it with an original/openly-licensed core (see [[Content-Strategy]], [[Roadmap]] Phase 2). Until confirmed, treat this as an **open risk**, logged in [[Decisions]] and [[Backlog]].

## Import stays clean
Import features (text/CSV/cloze/JSON/file, UWorld-misses) are legally fine **because the user supplies their own content and it never leaves their device/account**. Keep it that way: imported content must never be uploaded to a shared/public store or exposed to other users. (Deck *sharing* — [[Roadmap]] Phase 6 — must gate on the sharer having the right to share.)

## Privacy overlaps
User performance data and imports are personal data — handle per [[Sync-and-Accounts]] and [[Principles]] (export/delete, RLS isolation, no selling data).

Related: [[Content-Strategy]] · [[Decisions]] · [[Principles]]
