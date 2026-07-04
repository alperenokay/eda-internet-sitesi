#!/usr/bin/env node
/**
 * Ana sayfa liste kartlarını varsayılan metinlerle geri yükler.
 * Mevcut SEO, hero, üst etiket vb. korunur; yalnızca boşalan listeler doldurulur.
 * Kullanım: npm run db:restore-home-lists
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

const defaults = CONTENT_DEFAULTS.home;

function needsItems(storedItems, defaultItems) {
  return !Array.isArray(storedItems) || storedItems.length === 0;
}

try {
  await client.connect();

  const existing = await client.query(
    "SELECT data FROM site_content WHERE content_key = $1 LIMIT 1",
    ["home"]
  );

  const stored =
    existing.rows[0]?.data && typeof existing.rows[0].data === "object"
      ? existing.rows[0].data
      : {};

  const principles = stored.principlesSection && typeof stored.principlesSection === "object"
    ? stored.principlesSection
    : {};

  const practice = stored.practiceSection && typeof stored.practiceSection === "object"
    ? stored.practiceSection
    : {};

  const merged = {
    ...defaults,
    ...stored,
    principlesSection: {
      ...defaults.principlesSection,
      ...principles,
      eyebrow: principles.eyebrow || defaults.principlesSection.eyebrow,
      title:
        principles.title && principles.title !== principles.eyebrow
          ? principles.title
          : defaults.principlesSection.title,
      items: needsItems(principles.items, defaults.principlesSection.items)
        ? defaults.principlesSection.items
        : principles.items,
    },
    practiceSection: {
      ...defaults.practiceSection,
      ...practice,
      items: needsItems(practice.items, defaults.practiceSection.items)
        ? defaults.practiceSection.items
        : practice.items,
    },
    postsSection: {
      ...defaults.postsSection,
      ...(stored.postsSection && typeof stored.postsSection === "object" ? stored.postsSection : {}),
      eyebrow: defaults.postsSection.eyebrow,
      title: defaults.postsSection.title,
      lead: defaults.postsSection.lead,
    },
  };

  await client.query(
    `INSERT INTO site_content (content_key, data, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (content_key) DO UPDATE
     SET data = EXCLUDED.data, updated_at = now()`,
    ["home", JSON.stringify(merged)]
  );

  console.log("Ana sayfa listeleri geri yüklendi.");
  console.log("- Yaklaşım kartları:", merged.principlesSection.items.length);
  console.log("- Çalışma alanı kartları:", merged.practiceSection.items.length);
  console.log("- Üst etiket (yaklaşım):", merged.principlesSection.eyebrow);
  console.log("- Son yazılar üst etiket:", merged.postsSection.eyebrow);
} catch (err) {
  console.error("restore-home-lists hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
