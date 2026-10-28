-- Demonstrate transaction rollback in local PostgreSQL

BEGIN;

INSERT INTO bets (id, player_id, amount, status, reference)
VALUES (900004, 501, 15.00, 'PENDING', 'QA-D2-ROLLBACK');

-- The row exists inside the transaction
SELECT id, status, amount
FROM bets
WHERE id = 900004;

-- Discard changes
ROLLBACK;

-- The row must no longer exist
SELECT COUNT(*) AS remaining_bets
FROM bets
WHERE id = 900004;
