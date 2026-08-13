# QA Automation Transition Repo

## Goal

Backend-aware QA → API-first QA → Playwright Automation.

This repository is my hands-on QA automation portfolio focused on transitioning from experienced Manual QA in iGaming / Live Casino to Backend-aware QA with an Automation focus.

The project combines:

* backend/API testing fundamentals
* API-first test design
* authentication testing
* UI automation
* reusable Playwright components
* basic SQL / DB verification practice
* smoke and regression test organization

Practice application:

[Expand Testing Notes App](https://practice.expandtesting.com/notes/app)

## Tech Stack

* Node.js
* npm
* Playwright
* TypeScript
* Git / GitHub

## Current Automation Structure

```text
tests/
├── api/
│   ├── auth/
│   │   └── notes-authentication-api.spec.ts
│   └── notes/
│       └── notes-crud-notes-api.spec.ts
│
├── ui/
│   └── notes-login-ui.spec.ts
│
└── smoke/
    └── notes-app.smoke.spec.ts

pages/
└── login.page.ts

fixtures/
└── app.fixture.ts

docs/

sql/

utils/

config/
```

### `tests/api`

Contains API-level automated checks.

Current grouping:

* `auth/` — authentication and authorization-related API scenarios
* `notes/` — Notes API CRUD scenarios

API tests are kept separate from UI tests to support an API-first testing strategy and faster backend-focused feedback.

### `tests/ui`

Contains focused browser-level scenarios for user-facing functionality.

Current UI coverage includes authentication-related flows such as:

* valid login
* invalid login behavior
* authenticated state
* logout behavior

UI tests use stable Playwright locators and meaningful business assertions.

### `tests/smoke`

Contains a small set of critical P0 checks intended to quickly verify that the application is operational.

Current smoke coverage includes:

* login page availability
* valid user access to the authenticated Notes area

Smoke tests can be executed independently from the wider regression suite.

### `pages`

Contains Page Objects used to encapsulate page-specific locators and reusable UI interactions.

Current implementation:

* `LoginPage`

The Page Object handles login page mechanics while business assertions remain visible in the test specifications.

### `fixtures`

Contains custom Playwright fixtures.

Current implementation:

* `app.fixture.ts`
* provides a reusable `LoginPage` dependency to tests

This allows tests to request `loginPage` directly instead of creating `new LoginPage(page)` repeatedly.

### `docs`

Contains QA learning notes, test strategy documentation, backend/API analysis and supporting documentation.

### `sql`

Contains read-only SQL practice queries used to develop DB verification and data-consistency skills from a QA perspective.

## Environment Setup

Install project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Create a local `.env` file based on `.env.example`:

```env
TEST_EMAIL=
TEST_PASSWORD=
```

Add valid test credentials locally.

Do not commit real credentials, tokens or other secrets to the repository.

## How to Run Tests

### Run all tests

```bash
npx playwright test
```

### Run all API tests

```bash
npx playwright test tests/api
```

### Run authentication API tests

```bash
npx playwright test tests/api/auth
```

### Run Notes CRUD API tests

```bash
npx playwright test tests/api/notes
```

### Run all UI tests

```bash
npx playwright test tests/ui
```

### Run smoke tests by file

```bash
npx playwright test tests/smoke/notes-app.smoke.spec.ts
```

### Run smoke tests by tag

```bash
npx playwright test --grep @smoke
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Open Playwright HTML report

```bash
npx playwright show-report
```

## Testing Approach

The project follows a Backend-aware QA → API-first QA → Automation QA approach.

### API-first

Backend business rules and negative scenarios are primarily tested at API level where possible.

Benefits:

* faster execution
* easier debugging
* direct validation of backend behavior
* better negative-path coverage
* less dependence on browser UI

### Focused UI Automation

UI tests are used for critical user journeys and browser-level integration rather than duplicating the complete API test matrix.

Examples:

* login
* logout
* authenticated UI state
* critical application availability

### Smoke Strategy

The smoke suite contains only fast, critical P0 scenarios.

It is intentionally smaller than the regression suite and is designed to answer:

> Is the critical application flow alive and usable?

Detailed validation and negative scenarios remain in dedicated API and UI suites.

## Automation Design

The project currently uses a deliberately small automation structure without unnecessary framework complexity.

Implemented abstractions:

* feature-based API test grouping
* stable Playwright locators
* basic Page Object
* custom Playwright fixture
* reusable API helpers
* focused smoke suite

The goal is to introduce abstractions only when they solve a real readability, reuse or maintainability problem.

## QA / Backend Focus

The repository also demonstrates backend-aware QA thinking beyond browser automation:

* HTTP request / response analysis
* REST API testing
* status and response-body validation
* authentication vs authorization
* missing and invalid token scenarios
* API error assertions
* SQL verification basics
* JOIN and data-consistency reasoning
* UI / API / DB investigation mindset

## Useful Documentation

* [Terminal Navigation Commands](docs/terminal-navigation-commands.md)
* [Playwright Terminal Commands](docs/playwright-terminal-commands.md)

## Repository Principles

* API-first where backend behavior can be tested directly
* UI automation only where browser/user integration adds value
* meaningful assertions instead of click-only tests
* stable locators instead of brittle CSS/XPath selectors
* tests remain independently runnable
* no hardcoded credentials or tokens
* small reusable abstractions instead of premature framework complexity
* refactoring is performed incrementally from a green test baseline
