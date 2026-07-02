#!/usr/bin/env node
/** db/migrate-kvkk.sql uygular (mevcut DB'ler için KVKK alanları). */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = join(root, "db", "migrate-kvkk.sql");
const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

function resolveSsl(connectionString) {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return { rejectUnauthorized: false };
  if (/localhost|127\.0\.0\.1/i.test(connectionString)) return false;
  return { rejectUnauthorized: false };
}

const client = new pg.Client({ connectionString: url, ssl: resolveSsl(url) });

try {
  await client.connect();
  await client.query(readFileSync(sqlPath, "utf8"));
  console.log("KVKK migrasyonu uygulandı:", sqlPath);
} catch (err) {
  console.error("db:migrate-kvkk hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
