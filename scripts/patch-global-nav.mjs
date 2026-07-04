#!/usr/bin/env node
/**
 * Header/footer menüsünü günceller (Yayınlar + Hakkımızda).
 * Kullanım: npm run db:patch-nav
 */
import pg from "pg";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { CONTENT_DEFAULTS } = await import(
  pathToFileURL(join(root, "src/lib/content-defaults.ts")).href
);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

const navDefaults = {
  headerNav: CONTENT_DEFAULTS.global.headerNav,
  footerNav: CONTENT_DEFAULTS.global.footerNav,
};

try {
  await client.connect();
  const existing = await client.query(
    "SELECT data FROM site_content WHERE content_key = $1 LIMIT 1",
    ["global"]
  );
  const stored =
    existing.rows[0]?.data && typeof existing.rows[0].data === "object"
      ? existing.rows[0].data
      : {};

  const merged = {
    ...CONTENT_DEFAULTS.global,
    ...stored,
    headerNav: navDefaults.headerNav,
    footerNav: navDefaults.footerNav,
  };

  await client.query(
    `INSERT INTO site_content (content_key, data, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (content_key) DO UPDATE
     SET data = EXCLUDED.data, updated_at = now()`,
    ["global", JSON.stringify(merged)]
  );

  console.log("Menü güncellendi:");
  for (const item of merged.headerNav) {
    console.log(`- ${item.label} → ${item.href}`);
  }
} catch (err) {
  console.error("patch-global-nav hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
