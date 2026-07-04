#!/usr/bin/env node
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const adminUrl = url.replace(/\/[^/?]+(\?|$)/, "/postgres$1");
const client = new pg.Client({
  connectionString: adminUrl,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

try {
  await client.connect();
  const dbName = new URL(url.replace("postgresql://", "http://")).pathname.slice(1);
  const check = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (check.rows.length === 0) {
    await client.query(`CREATE DATABASE ${dbName.replace(/[^a-zA-Z0-9_]/g, "")}`);
    console.log("Veritabanı oluşturuldu:", dbName);
  } else {
    console.log("Veritabanı zaten var:", dbName);
  }
} catch (err) {
  console.error("ensure-db hatası:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
