# Day 01 - Client-server architecture and request/response lifecycle

## Flow diagram

Browser -> API -> Service / Business Logic -> DB -> Response -> Browser

## Explanation

The UI is only the entry point. Real business logic usually lives behind API endpoints and services.

Example: in a login flow, the browser sends a POST /login request. The backend validates credentials, creates a session or token, and returns a response with status code, body, headers, and cookies if needed.

## QA risks

1. UI shows generic error, but backend returns 401, 403, or 500.
2. Frontend sends incorrect request payload.
3. Backend accepts invalid data.
4. Session or token is not created after successful login.
5. Response contains sensitive data.

## API scenarios

### Positive
1. Successful login
2. Get profile after login
3. Get games list
4. Get bet history
5. Place valid bet

### Negative
1. Login with wrong password
2. Login with missing password
3. Get profile without token/session
4. Access another user's data
5. Place bet with amount greater than balance
6. Place bet with negative amount
7. Place bet on closed table
8. Duplicate bet request