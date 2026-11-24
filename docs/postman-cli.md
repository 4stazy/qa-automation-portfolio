# Postman API Automation — CLI Execution

## Purpose

Run the Notes API collection with data-driven test cases.
Postman is a complementary tool; Playwright + TypeScript remains
the primary automation framework.

## Prerequisites

- Postman CLI 1.94.0 or Newman 6.2.3
- Node.js 24 LTS for the validated Newman setup
- Local test credentials stored in a Git-ignored environment file
- `postman/data/notes-cases.json` with 3 test cases

## Newman

```bash
NODE_USE_SYSTEM_CA=1 newman run \
  postman/notes-api.postman_collection.json \
  -e postman/notes-qa.local.postman_environment.json \
  -d postman/data/notes-cases.json
```

## Postman CLI

```bash
postman collection run \
  postman/notes-api.postman_collection.json \
  -e postman/notes-qa.local.postman_environment.json \
  -d postman/data/notes-cases.json \
  --no-report-events
```

## Execution Evidence

| Metric     | Newman    | Postman CLI |
| ---------- | --------- | ----------- |
| Iterations | 3         | 3           |
| Requests   | 30        | 30          |
| Assertions | 57 passed | 57 passed   |
| Failures   | 0         | 0           |
| Duration   | 8.8s      | 8.9s        |

## GUI Runner Limitation

The Postman Free plan blocked importing iteration data files
in the GUI Collection Runner.

The equivalent data-driven workflow was successfully
executed through Newman and Postman CLI.

## TLS Troubleshooting (Windows)

### Problem

The initial Newman run failed with:

`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`

All 30 requests failed because Node.js could not validate
the HTTPS certificate chain.

The resulting 57 assertion failures were cascading errors,
not evidence of API defects.

### Root Cause and Resolution

The original Node.js version was v23.11.1.

We switched to portable Node.js v24.22.3 and enabled
the Windows trusted certificate store using:

`NODE_USE_SYSTEM_CA=1`

TLS connectivity was verified before rerunning Newman.

### Result

The next Newman run completed successfully:

- 3 iterations
- 30 requests passed
- 57 assertions passed
- 0 failures

SSL verification remained enabled.

Do not use `--insecure` or
`NODE_TLS_REJECT_UNAUTHORIZED=0` to bypass TLS validation
for authenticated API tests.

## Security

The local environment containing credentials is Git-ignored.
Credentials, authentication tokens and API keys must not
be committed or included in execution logs.
