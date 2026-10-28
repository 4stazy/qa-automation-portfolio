-- 1. Verify bet and its owner using INNER JOIN
SELECT b.id, b.status, p.username
FROM bets b
INNER JOIN players p ON b.player_id = p.id
WHERE b.id = 1005;

-- 2. Count bets by status
SELECT status, COUNT(*) AS bets_count
FROM bets
GROUP BY status
ORDER BY status;

-- 3. Find bets without settlement timestamp
SELECT id, status, settled_at
FROM bets
WHERE settled_at IS NULL
ORDER BY id;

-- 4. Find finalized bets with settlement timestamp
SELECT id, status, settled_at
FROM bets
WHERE settled_at IS NOT NULL
ORDER BY id;
