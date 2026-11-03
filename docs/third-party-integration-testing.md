# Third-Party Integration Testing

## External API

Provider: Frankfurter API v2
Base URL: https://api.frankfurter.dev/v2
Endpoint: GET /rate/{base}/{quote}
Authentication: Not required

Required path parameters:

- base
- quote

Optional query parameters:

- date
- providers

## Automated Coverage

Positive: EUR/USD returns HTTP 200 and valid rate fields.
Negative: Invalid currency ABC returns HTTP 422 and error body.

Test file: tests/integration/third-party-api.spec.ts

## Field Mapping

| External field | Internal/domain meaning |
| -------------- | ----------------------- |
| base           | Source currency         |
| quote          | Target currency         |
| rate           | Exchange rate           |
| date           | Rate date               |

## Final-State Investigation Scenario

### Scenario

An external payment provider returns HTTP 200 (success),
but the internal wallet transaction is missing.

This is a hypothetical iGaming integration scenario.

### Investigation Evidence

1. Capture providerTransactionId, internalTransactionId
   (if available), correlationId, playerId, amount,
   currency and timestamp.

2. Verify the provider response and confirm
   the meaning of its success status.

3. Investigate backend logs using correlationId:
   - outgoing provider request
   - provider response
   - response mapping
   - transaction persistence errors
   - retries, if applicable

4. Verify internal DB state using exact transaction IDs:
   - transaction exists
   - expected status and amount
   - correct playerId and currency
   - expected wallet/ledger state

5. Investigate duplicate processing or retries
   if the integration contract supports them.

### QA Conclusion

External HTTP success does not guarantee that the
internal business transaction was persisted successfully.

Final-state verification is required.

### Current Practice Limitations

Frankfurter provides exchange-rate data, not
payment transactions.

Our local PostgreSQL lab contains bets and players,
but no wallet or payment transactions.

This scenario is documented investigation design,
not an implemented integration test.
