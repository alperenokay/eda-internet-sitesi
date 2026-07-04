#!/usr/bin/env node
/**
 * site_content tablosunu ekler (mevcut DB'ler için).
 * Kullanım: npm run db:migrate-content
 */
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

const sql = `
CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  INTEGER REFERENCES admin_users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_site_content_updated ON site_content (updated_at DESC);
`;

try {
  await client.connect();
  await client.query(sql);
  console.log("site_content tablosu hazır.");
} catch (err) {
  console.error("db:migrate-content hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
