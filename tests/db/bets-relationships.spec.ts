import { test, expect } from "@playwright/test";
import { query, closeDb } from "../../db/db-client";
import { randomInt } from "node:crypto";

test.afterAll(async () => {
  await closeDb();
});

test("settled bet belongs to the correct player", async () => {
  const betId = 1005;

  const result = await query(
    `SELECT b.id, b.status, b.settled_at, p.username
     FROM bets b
     INNER JOIN players p ON b.player_id = p.id
     WHERE b.id = $1`,
    [betId],
  );

  expect(result.rows).toHaveLength(1);

  expect(result.rows[0]).toMatchObject({
    id: 1005,
    username: "player_501",
    status: "SETTLED",
  });

  expect(result.rows[0].settled_at).not.toBeNull();
});

test("should find exactly one bet for a reference", async () => {
  const reference = "ROULETTE-005";

  const result = await query(
    "SELECT COUNT(*) AS bet_count FROM bets WHERE reference = $1",
    [reference],
  );

  const betCount = Number(result.rows[0].bet_count);

  expect(betCount).toBe(1);
});

test("should create, verify and clean up a test bet", async () => {
  const betId = randomInt(1_000_000, 2_000_000_000);

  try {
    await query(
      `INSERT INTO bets (id, player_id, amount, status, reference)
       VALUES ($1, $2, $3, $4, $5)`,
      [betId, 501, "12.50", "PENDING", `QA-D2-${betId}`],
    );

    const result = await query(
      `SELECT b.id, b.status, p.username
       FROM bets b
       INNER JOIN players p ON b.player_id = p.id
       WHERE b.id = $1`,
      [betId],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      id: betId,
      status: "PENDING",
      username: "player_501",
    });
  } finally {
    await query("DELETE FROM bets WHERE id = $1", [betId]);
  }
});

test("should reject bet for unknown player without side effects", async () => {
  const betId = 900003;
  const invalidPlayerId = 999999;

  await expect(
    query(
      `INSERT INTO bets (id, player_id, amount, status, reference)
       VALUES ($1, $2, $3, $4, $5)`,
      [betId, invalidPlayerId, "10.00", "PENDING", "QA-D2-INVALID"],
    ),
  ).rejects.toMatchObject({
    code: "23503",
  });

  const result = await query(
    "SELECT COUNT(*) AS bet_count FROM bets WHERE id = $1",
    [betId],
  );

  expect(Number(result.rows[0].bet_count)).toBe(0);
});
