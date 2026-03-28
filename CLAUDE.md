# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An interactive flash-card style web app for learning guitar music theory. Deployed to GitHub Pages at https://lesterfan.github.io/fretboard-adventures.

## Commands

- `npm run dev` — start dev server on port 8000
- `npm run check` — run all pre-deploy checks (format, test, build). Run this before pushing.
- `npm run build` — typecheck then build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm test` — run Jest tests (uses `--experimental-vm-modules` for ESM)
- `npm run test:watch` — Jest in watch mode
- Run a single test: `node --experimental-vm-modules node_modules/jest/bin/jest.js path/to/test`

## Architecture

**Stack:** React 18 + TypeScript, Vite, MUI (Material UI 7), react-router-dom, lodash. Tests use Jest + ts-jest (ESM mode, node environment, no DOM tests).

**Routing:** `App.tsx` defines all routes. The homepage (`/`) renders `AllQuestionsCombined`, which randomly picks from the individual question pages. When adding a new question page, also add it to the `AllQuestionPages` array in `AllQuestionsCombined.tsx`.

**Question pages** (`src/pages/`): Each page (FretboardRecognition, NoteOnAString) manages its own random question state, `showAnswer` toggle, and renders a `FretboardDiagram` with `AnswerButtonList`. Pages accept an optional `onNext` callback used by `AllQuestionsCombined` to cycle question types.

**FretboardDiagram** (`src/components/FretboardDiagram.tsx`): SVG fretboard component with vertical orientation (chord diagram style). Accepts `markers` (array of positioned dots), `startFret`, `numFretsToShow`, and `highlightedStrings`. Used by both question pages.

**Music theory library** (`src/library/Library.ts`): Pure functions for note/chord/key lookups. Guitar string numbering: string 1 = high E, string 6 = low E. This is where all tests live (`__tests__/`).

**Base path:** Vite is configured with `base: "/fretboard-adventures/"` for GitHub Pages deployment.
