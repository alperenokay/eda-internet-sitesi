#!/usr/bin/env node
/**
 * İlk admin kullanıcıyı oluşturur veya günceller.
 * Kullanım: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/admin-create.mjs
 */
import pg from "pg";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const url = process.env.DATABASE_URL;

if (!email || !password) {
  console.error("ADMIN_EMAIL ve ADMIN_PASSWORD gerekli.");
  process.exit(1);
}
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const ssl =
  process.env.DATABASE_SSL === "false"
    ? false
    : process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : /localhost|127\.0\.0\.1/i.test(url)
        ? false
        : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

try {
  await client.connect();
  const password_hash = await hashPassword(password);
  await client.query(
    `INSERT INTO admin_users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, password_hash, email.split("@")[0]]
  );
  console.log("Admin kullanıcı hazır:", email);
} catch (err) {
  console.error("admin-create hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
