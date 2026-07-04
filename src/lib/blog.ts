import { query } from "@/lib/db";
import { STATIC_BLOG_POSTS, type BlogPostRecord } from "@/lib/blog-data";
import { BRAND_SHORT, site } from "@/lib/site";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  category: string;
  keywords: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

interface DbBlogRow {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  keywords: string | null;
  published_at: Date;
  updated_at: Date;
}

function mapStatic(record: BlogPostRecord): BlogPost {
  return {
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    bodyMd: record.bodyMd,
    category: record.category,
    keywords: record.keywords,
    coverImage: null,
    metaTitle: null,
    metaDesc: null,
    publishedAt: new Date(record.publishedAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function mapDb(row: DbBlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    bodyMd: row.body_md,
    category: "Hukuk",
    keywords: row.keywords ?? "",
    coverImage: row.cover_image,
    metaTitle: row.meta_title,
    metaDesc: row.meta_desc,
    publishedAt: new Date(row.published_at),
    updatedAt: new Date(row.updated_at),
  };
}

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function formatDateTR(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const result = await query<DbBlogRow>(
      `SELECT slug, title, excerpt, body_md, cover_image, meta_title, meta_desc, keywords,
              published_at, updated_at
       FROM blog_posts
       WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC`
    );
    if (result.rows.length > 0) {
      return sortByDateDesc(result.rows.map(mapDb));
    }
  } catch (err) {
    console.warn("[blog] DB okunamadı, statik yedek kullanılıyor:", err);
  }
  return sortByDateDesc(STATIC_BLOG_POSTS.map(mapStatic));
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const result = await query<DbBlogRow>(
      `SELECT slug, title, excerpt, body_md, cover_image, meta_title, meta_desc, keywords,
              published_at, updated_at
       FROM blog_posts
       WHERE slug = $1 AND status = 'published' AND published_at IS NOT NULL
       LIMIT 1`,
      [slug]
    );
    if (result.rows[0]) return mapDb(result.rows[0]);
  } catch (err) {
    console.warn("[blog] slug DB okunamadı:", err);
  }
  const fallback = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
  return fallback ? mapStatic(fallback) : null;
}

export async function fetchPublishedSlugsForSitemap(): Promise<
  { slug: string; updated_at: Date }[]
> {
  try {
    const result = await query<{ slug: string; updated_at: Date }>(
      `SELECT slug, updated_at FROM blog_posts
       WHERE status = 'published' AND published_at IS NOT NULL
       ORDER BY published_at DESC`
    );
    if (result.rows.length > 0) return result.rows;
  } catch {
    /* statik yedek */
  }
  return STATIC_BLOG_POSTS.map((p) => ({
    slug: p.slug,
    updated_at: new Date(p.updatedAt),
  }));
}

export function buildBlogPostingSchema(post: BlogPost, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDesc ?? post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: site.attorney,
    },
    publisher: {
      "@type": "Organization",
      name: site.brandFull,
      alternateName: BRAND_SHORT,
    },
  };
}
