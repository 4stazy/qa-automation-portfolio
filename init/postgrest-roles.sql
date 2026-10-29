-- Role used for local REST API requests
CREATE ROLE web_anon NOLOGIN;

GRANT web_anon TO qa_test;

GRANT USAGE ON SCHEMA public TO web_anon;

GRANT SELECT ON players TO web_anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON bets TO web_anon;

GRANT USAGE, SELECT
ON SEQUENCE bets_id_seq TO web_anon;
