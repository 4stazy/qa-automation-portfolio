import { test, expect } from "@playwright/test";

// to run tests: NODE_OPTIONS=--use-system-ca npx playwright test tests/integration/third-party-api.spec.ts

test("returns EUR to USD exchange rate", async ({ request }) => {
  const response = await request.get(
    "https://api.frankfurter.dev/v2/rate/eur/usd",
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.base).toBe("EUR");
  expect(responseBody.quote).toBe("USD");
  expect(typeof responseBody.rate).toBe("number");
  expect(responseBody.rate).toBeGreaterThan(0);
  expect(responseBody.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("rejects invalid currency code", async ({ request }) => {
  const response = await request.get(
    "https://api.frankfurter.dev/v2/rate/eur/abc",
  );

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody).toMatchObject({
    status: 422,
    message: "invalid currency: ABC",
  });
});
