-- Find settled bets for player 501
SELECT id, amount
FROM bets
WHERE player_id = 501
  AND status = 'SETTLED'
ORDER BY amount DESC;

-- Find Roulette bets with selected statuses
SELECT id, status, reference
FROM bets
WHERE status IN ('SETTLED', 'REJECTED')
  AND reference LIKE 'ROULETTE-%'
ORDER BY id DESC
LIMIT 2;

-- Find pending or rejected bets for selected players
SELECT id, player_id, status
FROM bets
WHERE (status = 'PENDING' OR status = 'REJECTED')
  AND player_id IN (501, 502)
ORDER BY id;
