# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

**Keep this file updated** when making changes that affect commands, architecture, or conventions.
It should stay concise — don't include implementation details discoverable from the code.

## What This Is

Flash-card style web app for learning guitar fretboard notes and chord inversions. Deployed to
GitHub Pages.

## Commands

- `npm run dev` — dev server on port 8000
- `npm run check` — run all pre-deploy checks (format, test, build). **Run before pushing.**
- `npm test` — Jest (uses `--experimental-vm-modules` for ESM)
- Single test: `node --experimental-vm-modules node_modules/jest/bin/jest.js path/to/test`

## Architecture

React 18 + TypeScript, Vite, MUI 7, react-router-dom, lodash. Tests: Jest + ts-jest (ESM, node env).

`App.tsx` defines routes. Homepage (`/`) renders `AllQuestionsCombined` which randomly picks
question pages. Invalid routes redirect to `/`. When adding a new page, also add it to
`AllQuestionPages` in `AllQuestionsCombined.tsx`.

Guitar string numbering: string 1 = high E, string 6 = low E. Vite base path:
`/fretboard-adventures/`.

## Question types

- **Fretboard Recognition** — identify a note at a marked fretboard position
- **Note on a String** — find all occurrences of a note on a highlighted string
- **Triad Inversions** — find a triad (major/minor/diminished) on 3 adjacent strings
- **Seventh Chord Inversions** — find a seventh chord (dominant 7/minor 7/major 7/half diminished)
  on strings 6,4,3,2
- **Minor/Major Pentatonic Scale Positions** — find a pentatonic scale box position across all 6
  strings (separate pages for minor and major)
- **Minor/Major Pentatonic Degree Identification** — given a visible pentatonic box, identify all
  notes of a specific scale degree (separate pages for minor and major)
- **Mode from Pentatonic** — given a pentatonic box, find the remaining notes to complete a mode
  (Dorian/Aeolian/Phrygian for minor, Ionian/Mixolydian/Lydian for major); user-configurable mode
  selector defaults to Ionian, Dorian, Aeolian
- **Seventh Chord Arpeggios** — find all notes of a seventh chord arpeggio (dominant 7/minor
  7/major 7/m7b5) on 2 adjacent highlighted strings within a 5-fret window

## Settings persistence

Global settings are persisted to `localStorage` under a single `"globalSettings"` key.
`settingsPersistence.ts` contains the load/save logic with per-field validation: invalid or missing
fields fall back to defaults, so adding a new setting just means extending `GlobalSettingsState`,
`DEFAULTS`, and a validation block. `GlobalSettingsContext.tsx` wires this into React state.

## Key conventions

- Question pages are simple components (no navigation props). All routes wrap them in
  `QuestionPageHost`, which keeps up to 10 past instances mounted (hidden via `display: none`) for
  back/forward navigation. History state lives in `QuestionHistoryContext`; pure reducer logic in
  `questionHistory.ts` (tested independently)
- `AnswerButtonList` consumes the history context directly for back/next — no prop threading needed
- `FretboardDiagram` is the shared SVG component — supports markers, highlighted strings, fret
  ranges
- Music theory logic lives in `Library.ts` with tests in `Library.test.ts`
- Round generation uses retry loops to guarantee all notes fit in the displayed fret window
- Seventh chord rounds additionally reject parameters where multiple inversions fit (unique answer
  required)
