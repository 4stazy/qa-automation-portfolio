import { test, expect } from "@playwright/test";
import { query, closeDb } from "../../db/db-client";

test.afterAll(async () => {
  await closeDb();
});

test("PostgreSQL connection responds to SELECT 1", async () => {
  const result = await query("SELECT 1 AS connection_ok");

  expect(result.rows[0].connection_ok).toBe(1);
});

test("should verify bet by exact ID", async () => {
  const betId = 1005;

  const result = await query(
    "SELECT id, player_id, amount, status FROM bets WHERE id = $1",
    [betId],
  );

  expect(result.rows).toHaveLength(1);

  expect(result.rows[0]).toMatchObject({
    id: 1005,
    player_id: 501,
    amount: "35.00",
    status: "SETTLED",
  });
});
