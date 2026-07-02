import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function resolveSsl(): false | { rejectUnauthorized: false } {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return { rejectUnauthorized: false };

  const url = process.env.DATABASE_URL ?? "";
  if (/localhost|127\.0\.0\.1/i.test(url)) return false;

  return { rejectUnauthorized: false };
}

function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: resolveSsl(),
      max: 10,
    });
  }
  return pool;
}

export async function query<T = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
