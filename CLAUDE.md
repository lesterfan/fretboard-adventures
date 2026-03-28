# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Flash-card style web app for learning guitar fretboard notes. Deployed to GitHub Pages.

## Commands

- `npm run dev` — dev server on port 8000
- `npm run check` — run all pre-deploy checks (format, test, build). **Run before pushing.**
- `npm test` — Jest (uses `--experimental-vm-modules` for ESM)
- Single test: `node --experimental-vm-modules node_modules/jest/bin/jest.js path/to/test`

## Architecture

React 18 + TypeScript, Vite, MUI 7, react-router-dom, lodash. Tests: Jest + ts-jest (ESM, node env).

`App.tsx` defines routes. Homepage (`/`) renders `AllQuestionsCombined` which randomly picks question pages. When adding a new page, also add it to `AllQuestionPages` in `AllQuestionsCombined.tsx`.

Guitar string numbering: string 1 = high E, string 6 = low E. Vite base path: `/fretboard-adventures/`.
