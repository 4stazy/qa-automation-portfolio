# QA Automation Transition Repo

## Goal

Backend-aware QA -> API-first QA -> Playwright automation.

This repository is part of my transition from Senior Manual QA experience in iGaming / Live Casino to Backend-aware QA with Automation focus.

## Tech stack
- Node.js
- npm
- Playwright
- TypeScript
- 
## Project structure
- tests/api — future API tests
- tests/ui — UI tests
- pages — future Page Objects
- fixtures — future reusable test setup
- utils — helper functions
- config — project configuration helpers
- docs — learning notes and QA analysis
- 
## How to run
npm install
npx playwright install
npx playwright test
npx playwright show-report

## Useful Documentation
- [Terminal Navigation Commands](docs/terminal-navigation-commands.md)
- [Playwright Terminal Commands](docs/playwright-terminal-commands.md)

### Run Notes API tests

Create a local `.env` file based on `.env.example`:

```env
TEST_EMAIL=
TEST_PASSWORD=