import { test, expect } from "@playwright/test";
import { query, closeDb } from "../../db/db-client";

test.afterAll(async () => {
  await closeDb();
});

test("lab API returns seeded bet", async ({ request }) => {
  const response = await request.get(
    "http://127.0.0.1:3000/bets?reference=eq.LAB-ROULETTE-001",
  );

  expect(response.status()).toBe(200);

  const bets = await response.json();

  expect(bets).toHaveLength(1);
  expect(bets[0]).toMatchObject({
    player_id: 501,
    status: "PENDING",
    reference: "LAB-ROULETTE-001",
  });

  const betId = bets[0].id;

  const dbResult = await query(
    `SELECT id, player_id, status, reference
   FROM bets
   WHERE id = $1`,
    [betId],
  );

  expect(dbResult.rows).toHaveLength(1);

  expect(dbResult.rows[0]).toMatchObject({
    id: betId,
    player_id: 501,
    status: "PENDING",
    reference: "LAB-ROULETTE-001",
  });
});
