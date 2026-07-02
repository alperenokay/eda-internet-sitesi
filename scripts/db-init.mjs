#!/usr/bin/env node
/**
 * PostgreSQL şemasını uygular (db/schema.sql).
 * Kullanım: npm run db:init
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "db", "schema.sql");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

try {
  await client.connect();
  const sql = readFileSync(schemaPath, "utf8");
  await client.query(sql);
  console.log("Şema uygulandı:", schemaPath);
} catch (err) {
  console.error("db:init hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
