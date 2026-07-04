import { query } from "@/lib/db";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";

export interface BlogSeedResult {
  inserted: number;
  skipped: number;
  total: number;
}

/** Statik blog yazılarını DB'ye aktarır (slug çakışmasında atlar). */
export async function seedStaticBlogPosts(): Promise<BlogSeedResult> {
  let inserted = 0;
  let skipped = 0;

  for (const post of STATIC_BLOG_POSTS) {
    const exists = await query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", [post.slug]);
    if ((exists.rowCount ?? 0) > 0) {
      skipped += 1;
      continue;
    }

    const publishedAt = new Date(post.publishedAt);
    await query(
      `INSERT INTO blog_posts
       (slug, title, excerpt, body_md, cover_image, meta_title, meta_desc, keywords, status, published_at, updated_at)
       VALUES ($1, $2, $3, $4, NULL, NULL, NULL, $5, 'published', $6, $7)`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.bodyMd,
        post.keywords,
        publishedAt,
        new Date(post.updatedAt),
      ]
    );
    inserted += 1;
  }

  return { inserted, skipped, total: STATIC_BLOG_POSTS.length };
}
