# REST API Notes - Month 1 Week 2 Day 1

## Goal

The goal of this document is to explain REST API basics from a QA perspective and create an endpoint map that can later be used for API test scenarios and Playwright API automation.

This is part of my transition from Manual QA to Backend-aware QA with Automation focus.

Current focus:

```text
Backend-aware QA -> API-first QA -> Automation QA
```

---

## REST in My Words

REST API is a way for a client and backend to communicate using resources, endpoints, HTTP methods, requests, responses, status codes and usually JSON.

For QA, REST is not just a technical term. It helps me understand what the frontend asks from the backend, what business action should happen, what data should be returned, and where a bug may actually be located.

Instead of only saying:

```text
The lobby is empty.
```

A backend-aware QA should ask:

```text
Which API request loaded the lobby?
Which endpoint was called?
Which method was used?
What status code was returned?
What response body came back?
Was the issue in frontend rendering, backend logic, permissions, session, or data?
```

In iGaming / Live Casino, REST API thinking is especially useful for flows such as login, game lobby, table state, player balance, bet placement, transactions and round history.

---

## Core REST Concepts

| Concept     | Simple explanation                                                                                        | QA value                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Resource    | A business object exposed through API, for example user, game, table, bet, balance, round or transaction. | Helps understand what exactly is being tested.            |
| Endpoint    | A URL used to access a resource or action, for example `/games` or `/bets`.                               | Helps connect UI behavior with backend evidence.          |
| HTTP Method | The action type: read, create, update or delete.                                                          | Helps understand expected behavior and risk.              |
| Request     | What client sends to backend: method, URL, headers, params and body.                                      | Helps reproduce and debug issues.                         |
| Response    | What backend returns: status code, headers and body.                                                      | Helps verify actual result against expected behavior.     |
| Status Code | Numeric result of the request, for example 200, 201, 400, 401, 403, 404, 500.                             | Helps classify issues quickly.                            |
| JSON Body   | Structured request or response data.                                                                      | Helps validate fields, values, types and business result. |

---

## HTTP Methods

| Method | Purpose                                         | Example                      | QA risk                                                                         |
| ------ | ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| GET    | Read data without changing backend state.       | `GET /games`                 | Wrong data, missing data, incorrect filters, data leak.                         |
| POST   | Create a resource or trigger a business action. | `POST /bets`                 | Invalid action accepted, duplicate action, wrong validation, money state issue. |
| PUT    | Replace the full resource.                      | `PUT /profile`               | Existing data overwritten, required fields missing, unexpected full update.     |
| PATCH  | Partially update the resource.                  | `PATCH /user/preferences`    | Wrong field updated, unrelated fields changed, validation skipped.              |
| DELETE | Remove a resource or relationship.              | `DELETE /favorites/{gameId}` | Wrong item removed, permission issue, inconsistent state.                       |

---

## GET vs POST

### GET

GET is used to retrieve data.

Example:

```http
GET /games?category=live-casino
```

Expected behavior:

```text
Backend returns a list of live casino games.
The request should not change backend state.
```

QA checks:

```text
- status code is correct
- response body contains expected fields
- filters work correctly
- user sees only allowed data
- empty state is handled correctly
```

### POST

POST is used to create something or trigger a business action.

Example:

```http
POST /bets
```

Expected behavior:

```text
Backend validates the request and creates or accepts a bet only if all business rules are satisfied.
```

QA checks:

```text
- required fields are validated
- invalid values are rejected
- duplicate requests are handled correctly
- balance and game state are updated correctly
- proper error is returned for failed business rules
```

For iGaming, POST endpoints are usually higher risk than GET endpoints because they often change money, session, transaction or game state.

---

## PUT vs PATCH

PUT usually means full replacement of a resource.

Example:

```http
PUT /profile
```

If the request body does not include some fields, there is a risk that those fields may be removed or overwritten, depending on API contract.

PATCH usually means partial update.

Example:

```http
PATCH /user/preferences
```

Only selected fields should be updated.

QA rule:

```text
Always confirm expected PUT/PATCH behavior in API requirements or backend contract.
Do not assume implementation details without checking the contract.
```

---

## iGaming Endpoint Map

| Endpoint                      | Method | Resource / Action      | Purpose                                       | Happy path                                                | Negative path                                                                               | QA risk                                                                                   |
| ----------------------------- | ------ | ---------------------- | --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/login`                      | POST   | Session / auth action  | Authenticate player and create session/token. | Valid credentials return success and session/token.       | Wrong password or missing credentials should be rejected.                                   | Wrong credentials accepted, session not created, incorrect error, sensitive data exposed. |
| `/games?category=live-casino` | GET    | Games collection       | Load Live Casino lobby games.                 | Valid category returns available games.                   | Invalid category or unavailable provider returns empty list or error according to contract. | Missing games, wrong category, closed games shown, incorrect sorting/filtering.           |
| `/tables/{tableId}`           | GET    | Table item             | Load specific table state.                    | Existing table returns correct table status.              | Unknown or closed table returns correct error/state.                                        | Closed table shown as open, wrong limits, wrong dealer/table state.                       |
| `/users/{userId}/balance`     | GET    | Player balance         | Return current player balance.                | Authenticated user receives own balance.                  | User tries to access another user's balance.                                                | Data leak, stale balance, wrong currency, permission issue.                               |
| `/bets`                       | POST   | Bet action             | Place a bet for an open round/table.          | Valid bet with enough balance is accepted.                | Insufficient funds, invalid amount, closed round or duplicate request is rejected.          | Money state issue, invalid bet accepted, duplicate bet, balance not updated correctly.    |
| `/rounds/{roundId}/history`   | GET    | Round history item     | Return round result/history.                  | Existing round returns correct result for allowed player. | Unknown round or unauthorized access is rejected.                                           | Wrong round history, player data leak, missing transaction/result details.                |
| `/favorites/{gameId}`         | DELETE | Favorites relationship | Remove game from player favorites.            | Existing favorite is removed.                             | Unknown game or already removed favorite handled correctly.                                 | Wrong game removed, state not updated, inconsistent UI/API state.                         |

---

## API-first Thinking for These Flows

API-first testing is useful because many important product rules live closer to backend/API than UI.

For example, UI can show that a bet was accepted, but API-level checks can verify whether:

```text
- request payload was correct
- backend accepted or rejected the bet correctly
- expected status code was returned
- response body contains correct business status
- balance or bet state changed correctly
```

Good API-first candidates in iGaming:

```text
- login validation
- games list filters
- table availability
- balance response
- bet placement validation
- round history access
```

Good UI smoke candidates:

```text
- user can open lobby
- user can log in
- user can see balance
- user can open a game/table
```

The rule is:

```text
Backend business rules -> API tests
Critical user journey -> UI smoke tests
```

---

## Example: Lobby Flow

User action:

```text
Player opens Live Casino lobby.
```

Possible API request:

```http
GET /games?category=live-casino
```

Expected response:

```text
Status: 200
Body: list of games
Each game should have id, name, provider, category, availability/status.
```

QA risks:

```text
- game list is empty
- wrong category is returned
- unavailable games are shown
- provider filter does not work
- response is 200 but body contains wrong business data
- frontend displays wrong empty/error state
```

Possible API scenarios:

| Scenario                        | Method | Endpoint                      | Expected result                                      |
| ------------------------------- | ------ | ----------------------------- | ---------------------------------------------------- |
| Get live casino games           | GET    | `/games?category=live-casino` | 200 and list of live casino games                    |
| Get games with invalid category | GET    | `/games?category=invalid`     | Empty list or validation error depending on contract |
| Provider filter                 | GET    | `/games?provider=evolution`   | Only games from selected provider                    |
| Empty state                     | GET    | `/games?category=unavailable` | Correct empty response and UI handling               |

---

## Example: Bet Placement Flow

User action:

```text
Player places a bet on an open table.
```

Possible API request:

```http
POST /bets
```

Example request body:

```json
{
  "tableId": "blackjack-01",
  "roundId": "round-123",
  "amount": 10,
  "currency": "EUR"
}
```

Expected response:

```text
Status: 200 or 201 depending on API contract
Body contains bet id and accepted status
```

Possible response body:

```json
{
  "betId": "bet-456",
  "status": "accepted",
  "amount": 10,
  "currency": "EUR"
}
```

QA risks:

```text
- invalid amount accepted
- bet accepted after round is closed
- bet accepted with insufficient funds
- duplicate bet created after repeated request
- wrong currency accepted
- balance not updated
- unclear error returned to frontend
```

Possible API scenarios:

| Scenario                       | Method | Endpoint | Expected result                                 |
| ------------------------------ | ------ | -------- | ----------------------------------------------- |
| Valid bet                      | POST   | `/bets`  | Bet accepted                                    |
| Missing amount                 | POST   | `/bets`  | Request rejected                                |
| Amount is zero                 | POST   | `/bets`  | Request rejected                                |
| Amount is greater than balance | POST   | `/bets`  | Insufficient funds error                        |
| Closed round                   | POST   | `/bets`  | Bet rejected                                    |
| Duplicate request              | POST   | `/bets`  | No duplicate bet or expected duplicate handling |

---

## Typical QA Mistakes

```text
- Testing only UI without checking the related API request.
- Reporting only "button does not work" without endpoint, method, status and response evidence.
- Treating every 200 response as correct business behavior.
- Not defining expected status and response body before testing.
- Not separating frontend issue from backend issue.
- Ignoring negative scenarios for POST/PUT/PATCH/DELETE endpoints.
```

---

## Typical Automation QA Mistakes

```text
- Automating every backend rule through UI.
- Writing slow UI tests instead of faster API tests.
- Checking only response status without response body.
- Naming tests too generally, for example "should work".
- Hardcoding unclear test data.
- Making fragile assertions on dynamic fields.
- Automating demo API behavior without understanding real product contract.
```

---

## What I Would Automate Later

Good candidates for Playwright API tests:

```text
GET /posts/1 or similar demo endpoint
POST /posts with valid payload
GET unknown endpoint returns 404
```

Product-level future candidates:

```text
POST /login with valid credentials
POST /login with invalid credentials
GET /games with valid category
GET /balance for authenticated user
POST /bets with valid payload
POST /bets with invalid amount
```

For Week 2, I should start with simple and stable API checks:

```text
- status assertion
- required fields assertion
- selected business value assertion
- basic negative route check
```

---

## Interview-ready Answers

### What is REST API?

REST API is a way to expose resources through endpoints and HTTP methods. As QA, I use REST thinking to understand what request is sent, what backend behavior is expected, what status code and response body should be returned, and where the root cause of a bug may be.

### What is the difference between GET and POST?

GET is used to read data and should not change backend state. POST is used to create a resource or trigger a business action. In iGaming, `GET /balance` reads player balance, while `POST /bets` changes money and game state, so POST has higher risk.

### What is the difference between PUT and PATCH?

PUT usually replaces the full resource, while PATCH updates only selected fields. In real projects, I always check the API contract because implementation can differ between teams.

### Why API-first testing?

API-first testing gives faster feedback, better backend isolation, easier negative testing and less flakiness than UI-only tests. UI tests should cover critical user journeys, while backend business rules are often better covered at API level.

### How would you test POST /bets?

I would cover valid bet placement, missing required fields, invalid amount, insufficient funds, closed round, duplicate request and unauthorized access. I would validate expected status code, response body, error code/message and the business result, especially balance and bet state.

---

## Open Questions

```text
- Which status code should product API return for validation errors: 400 or 422?
- Should DELETE /favorites/{gameId} return 404 if the favorite does not exist, or should it be idempotent?
- For POST /bets, how does backend prevent duplicate requests?
- Which fields are mandatory in bet placement payload?
- Which endpoints require authentication and which require additional permission checks?
```

---

## Summary

Today I learned how to look at REST API from a QA perspective:

```text
Resource -> Endpoint -> Method -> Expected behavior -> QA risk
```

I created an endpoint map for iGaming / Live Casino flows and identified API-first testing candidates.

The main learning is that strong QA does not stop at UI symptoms. Backend-aware QA checks request, response, status code, body and business state to understand the real root cause.
