# Framework Architecture

## Current structure

```text
tests/
├── api/
├── smoke/
└── ui/

clients/
pages/
fixtures/
types/
docs/
```

## Responsibilities

- `tests/` — owns test scenarios, business intent, assertions, and cross-layer verification.
- `clients/` — owns API request mechanics and endpoint interaction.
- `pages/` — owns UI interaction mechanics through Page Objects.
- `fixtures/` — owns test dependency setup and lifecycle.
- `types/` — owns shared TypeScript data shapes used across tests and support code.
- `docs/` — owns framework and testing documentation.

## Current flow

```text
test
↓
client / page object
↓
application
```

## Current architecture smells

1. **Shared mutable authentication state**
   - Multiple API specs use the same predefined test user.
   - Logout in one parallel test invalidates tokens used by other tests.
   - This makes the suite not fully parallel-safe.
   - Planned direction: use isolated disposable users for destructive authentication scenarios.

2. **Response body is sometimes trusted before status validation**
   - Some tests access `responseBody.data` before validating the HTTP status.
   - If the API returns an auth/error response, `data` may be `undefined`, causing secondary runtime errors.
   - Planned direction: validate status/success before reading expected success payload fields.
