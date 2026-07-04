#!/usr/bin/env node
/**
 * Statik blog yazılarını PostgreSQL'e aktarır.
 * Kullanım: npm run db:seed-blog
 */
import pg from "pg";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { STATIC_BLOG_POSTS } = await import(
  pathToFileURL(join(root, "src/lib/blog-data.ts")).href
);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

let inserted = 0;
let skipped = 0;

try {
  await client.connect();

  for (const post of STATIC_BLOG_POSTS) {
    const exists = await client.query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", [post.slug]);
    if (exists.rowCount > 0) {
      skipped += 1;
      continue;
    }

    await client.query(
      `INSERT INTO blog_posts
       (slug, title, excerpt, body_md, cover_image, meta_title, meta_desc, keywords, status, published_at, updated_at)
       VALUES ($1, $2, $3, $4, NULL, NULL, NULL, $5, 'published', $6, $7)`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.bodyMd,
        post.keywords,
        new Date(post.publishedAt),
        new Date(post.updatedAt),
      ]
    );
    inserted += 1;
  }

  console.log(
    `Blog seed tamam: ${inserted} eklendi, ${skipped} zaten vardı (toplam ${STATIC_BLOG_POSTS.length}).`
  );
} catch (err) {
  console.error("db:seed-blog hatası:", err);
  process.exit(1);
} finally {
  await client.end();
}
