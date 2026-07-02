#!/usr/bin/env node
/** Saklama süresi dolmuş başvuruları anonimleştirir. Cron: günlük/haftalık. */
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

function resolveSsl(connectionString) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (/localhost|127\.0\.0\.1/i.test(connectionString)) return false;
  return { rejectUnauthorized: false };
}

const TABLES = [
  { name: "analysis_applications", extra: ["analysis_slug", "material_type"] },
  { name: "consultancy_applications", extra: ["topic"] },
  { name: "contact_messages", extra: ["subject"] },
];

const client = new pg.Client({ connectionString: url, ssl: resolveSsl(url) });

async function anonymizeTable(table) {
  const result = await client.query(
    `SELECT id FROM ${table} WHERE deleted_at IS NULL AND retention_until IS NOT NULL AND retention_until < now()`
  );
  let count = 0;
  for (const row of result.rows) {
    const id = row.id;
    const email = `deleted-${id}@anonymized.local`;
    await client.query(
      `UPDATE ${table} SET
         full_name = '[silindi]',
         email = $2,
         phone = NULL,
         company = NULL,
         message = NULL,
         ip = NULL,
         deleted_at = now()
       WHERE id = $1`,
      [id, email]
    );
    if (table === "analysis_applications") {
      await client.query(
        `UPDATE analysis_applications SET analysis_slug = NULL, material_type = NULL WHERE id = $1`,
        [id]
      );
    } else if (table === "consultancy_applications") {
      await client.query(`UPDATE consultancy_applications SET topic = NULL WHERE id = $1`, [id]);
    } else if (table === "contact_messages") {
      await client.query(`UPDATE contact_messages SET subject = NULL WHERE id = $1`, [id]);
    }
    count += 1;
  }
  return count;
}

try {
  await client.connect();
  let total = 0;
  for (const t of TABLES) {
    const n = await anonymizeTable(t.name);
    if (n > 0) console.log(`${t.name}: ${n} kayıt anonimleştirildi`);
    total += n;
  }
  console.log(total === 0 ? "Süresi dolmuş kayıt yok." : `Toplam: ${total} kayıt.`);
} catch (err) {
  console.error("purge:retention hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
