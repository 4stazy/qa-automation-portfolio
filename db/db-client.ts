import { Pool } from "pg";

const pool = new Pool();

export function query(text: string, params: unknown[] = []) {
  return pool.query(text, params);
}

export async function closeDb(): Promise<void> {
  await pool.end();
}
