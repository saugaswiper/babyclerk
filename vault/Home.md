# 🩺 BabyClerk — Product Vault

This is the **single source of truth** for BabyClerk. Any coding agent (or human) working on this app should read [[Agent-Guide]] first, then steer by [[Roadmap]] and [[Vision]]. Keep this vault updated as the app changes — it is the memory that survives context resets.

> 🎯 **[[Mission]] — read first, every session.** The one-screen compass that keeps the work centered.
> 📚 **[[Resources/README|Resource Library]]** — upload your own materials (curriculum, decks, inspiration, feedback) as durable, actionable context that shapes the app to your vision.

## Start here
- [[Mission]] — the one-screen anchor
- [[Vision]] — the north star and what "success" means
- [[Principles]] — the non-negotiables (product + engineering)
- [[Roadmap]] — phased plan: **Now / Next / Later**
- [[Agent-Guide]] — how to work in this repo (deploy, branch, guardrails)
- [[Backlog]] — the live prioritized task list

## Architecture
- [[Architecture]] — stack, hosting, offline model
- [[Data-Model]] — storage keys, card types, sync blob
- [[Sync-and-Accounts]] — Supabase, auth, merge strategy
- [[AI-Personalization-Engine]] — the adaptive learning system (the big bet)

## Content
- [[Content-Strategy]] — hybrid: original core + private import
- [[Licensing-and-Copyright]] — **read before adding any deck** ⚠️
- [[Rotations]] — rotation coverage + Queen's specifics

## Context library
- [[Resources/README|Resource Library]] — how to upload & structure your materials
- [[Resources/Index|Resource Index]] — catalog of everything uploaded

## Reference
- [[Features]] — catalog of shipped + planned, with status
- [[Decisions]] — decision log (ADRs)
- [[Personas]] — who we're building for
- [[Glossary]] — clerkship + app terms

## Current state (snapshot)
See [[Features]] for detail. **Shipped:** 7 rotations with Queen's notes/checklists; ~1,970 flashcards (Montis bundled) with SM-2 spaced repetition + daily new-card budget; viva drills; MCQ quizzes; notes; cross-rotation "Study Due"; full-text search; PWA (offline/installable); import (text/CSV/cloze/JSON/file); AI generation; image-occlusion creator; misses→cards; backup/restore; optional email sign-in + cloud sync; **rotation schedule + exam-date awareness on the home screen (Phase 3)**.

**The frontier** (see [[Roadmap]] Phase 4+): turn the app from a great *study tool* into an *adaptive tutor* — [[AI-Personalization-Engine]]. Next foundation: the **attempt log** (per-answer telemetry).
