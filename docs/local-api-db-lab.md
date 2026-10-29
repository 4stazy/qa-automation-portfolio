# Local API + PostgreSQL Test Lab

## Purpose

Reproducible local environment for API-to-DB verification using Docker Compose, PostgreSQL 17, PostgREST and Playwright + TypeScript.

## Prerequisites

- Docker Desktop with Docker Compose
- Node.js and npm
- A local `.env` based on `.env.example`
- PostgreSQL environment variables: PGDATABASE, PGUSER, PGPASSWORD

Do not commit `.env` or real credentials.

## Start the environment

From the repository root:

```bash
docker compose up -d
docker compose ps
```

The services are accessible from the host at:

- REST API: http://127.0.0.1:3000
- PostgreSQL: 127.0.0.1:5433

On the first initialization of an empty database volume, Docker runs:

- `init/schema.sql`
- `init/postgrest-roles.sql`

## Verify the API

```bash
curl -i "http://127.0.0.1:3000/bets?reference=eq.LAB-ROULETTE-001"
```

Expected: HTTP 200 and the seeded bet.

## Run the integration smoke test

From Git Bash on Windows:

```bash
npm run typecheck
PGPORT=5433 npx playwright test tests/integration/lab-api-db-smoke.spec.ts
```

`PGPORT=5433` selects the Compose database instead of the separate D1/D2 database on port 5432.

## Stop the environment

```bash
docker compose down
```

Preserves database data in the named Docker volume.

## Reset the environment

**Destructive: deletes data in this Compose lab volume.**

```bash
docker compose down -v
docker compose up -d
```

The PostgreSQL initialization scripts recreate the schema, permissions and seed data on an empty volume.

Do not run destructive reset commands against shared or production environments.

## Scope

This is a local QA learning environment, not a production betting backend. PostgREST is exposed on localhost without application-level authentication.
