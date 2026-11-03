import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { query, closeDb } from "../../db/db-client";

test.afterAll(async () => {
  await closeDb();
});

test("creates a bet via API", async ({ request }) => {
  const reference = `LAB-AUTO-${randomUUID()}`;

  try {
    const response = await request.post("http://127.0.0.1:3000/bets", {
      headers: {
        Prefer: "return=representation",
      },
      data: {
        player_id: 501,
        amount: 25,
        status: "PENDING",
        reference,
      },
    });

    expect(response.status()).toBe(201);

    const bets = await response.json();

    expect(bets).toHaveLength(1);
    expect(bets[0]).toMatchObject({
      player_id: 501,
      amount: 25,
      status: "PENDING",
      reference,
    });

    const betId = bets[0].id;

    const dbResult = await query(
      `SELECT id, player_id, amount, status, reference
   FROM bets
   WHERE id = $1`,
      [betId],
    );

    expect(dbResult.rows).toHaveLength(1);

    const dbBet = dbResult.rows[0];

    expect(dbBet.id).toBe(betId);
    expect(dbBet.player_id).toBe(501);
    expect(Number(dbBet.amount)).toBe(25);
    expect(dbBet.status).toBe("PENDING");
    expect(dbBet.reference).toBe(reference);

    const updateResponse = await request.patch(
      `http://127.0.0.1:3000/bets?id=eq.${betId}`,
      {
        data: {
          status: "SETTLED",
          settled_at: new Date().toISOString(),
        },
      },
    );

    expect(updateResponse.status()).toBe(204);

    const updatedDbResult = await query(
      `SELECT status, settled_at
   FROM bets
   WHERE id = $1`,
      [betId],
    );

    expect(updatedDbResult.rows).toHaveLength(1);

    expect(updatedDbResult.rows[0].status).toBe("SETTLED");
    expect(updatedDbResult.rows[0].settled_at).not.toBeNull();
  } finally {
    const cleanup = await request.delete(
      `http://127.0.0.1:3000/bets?reference=eq.${reference}`,
    );

    expect(cleanup.status()).toBe(204);
  }
});

test("rejects negative bet amount without DB side effects", async ({
  request,
}) => {
  const reference = `LAB-INVALID-${randomUUID()}`;

  try {
    const response = await request.post("http://127.0.0.1:3000/bets", {
      data: {
        player_id: 501,
        amount: -25,
        status: "PENDING",
        reference,
      },
    });

    expect(response.status()).toBe(400);

    const errorBody = await response.json();
    expect(errorBody.code).toBe("23514");

    const dbResult = await query("SELECT id FROM bets WHERE reference = $1", [
      reference,
    ]);

    expect(dbResult.rows).toHaveLength(0);
  } finally {
    const cleanup = await request.delete(
      `http://127.0.0.1:3000/bets?reference=eq.${reference}`,
    );

    expect(cleanup.status()).toBe(204);
  }
});
