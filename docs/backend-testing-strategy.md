## Validation and Response Contract Strategy

### Request validation

Each negative validation test should target one specific API contract rule.

Examples:

- wrong field type
- missing required field
- unsupported enum/business value
- invalid identifier format

For intentionally invalid payloads, typed API client methods should remain strict.
A separate raw request method may be used when a test needs to intentionally violate the normal TypeScript contract.

### Response contract validation

API tests should validate HTTP status separately from the response body.

Common error response contract:

- expected HTTP status
- `success` is `false`
- `message` exists and is a string

Reusable contract assertions can be placed in shared helpers such as
`expectApiErrorResponse()`.

Scenario-specific business expectations should remain visible in the test.

Example:

```ts
const body = await expectApiErrorResponse(response, 400);

expect(body.message).toBe("Note completed status must be boolean");
```

Avoid full JSON snapshots for API responses.

Dynamic values such as generated IDs should normally be validated by
presence, type, or relationship to previously created data rather than
hardcoded values.

### Rejected request side effects

A rejected mutation request should not modify persisted resource state.

For negative UPDATE tests:

1. Create a valid resource.
2. Send an invalid update.
3. Verify the API rejection.
4. GET the resource again.
5. Verify that the original state remains unchanged.
6. Clean up the created test data.

Current validation examples:

- `completed: "yes"` → wrong type validation
- `category: "Casino"` → unsupported category validation
