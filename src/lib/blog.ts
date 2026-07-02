import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { SITE_URL } from "@/lib/site";

export interface BlogPostListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: Date | null;
}

export interface BlogPost extends BlogPostListItem {
  id: number;
  body_md: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  keywords: string | null;
  status: string;
  updated_at: Date;
}

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string;
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "b", "i", "u", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "a", "blockquote", "code", "pre", "hr",
      "table", "thead", "tbody", "tr", "th", "td", "img",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt", "class"],
  });
}

export function formatDateTR(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function fetchPublishedPosts(): Promise<BlogPostListItem[]> {
  const { query } = await import("@/lib/db");
  const result = await query<BlogPostListItem>(
    `SELECT slug, title, excerpt, published_at
     FROM blog_posts
     WHERE status = 'published'
     ORDER BY published_at DESC NULLS LAST`
  );
  return result.rows;
}

export async function fetchPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { query } = await import("@/lib/db");
  const result = await query<BlogPost>(
    `SELECT id, slug, title, excerpt, body_md, cover_image,
            meta_title, meta_desc, keywords, status, published_at, updated_at
     FROM blog_posts
     WHERE slug = $1 AND status = 'published'
     LIMIT 1`,
    [slug]
  );
  return result.rows[0] ?? null;
}

export async function fetchPublishedSlugsForSitemap(): Promise<
  { slug: string; updated_at: Date }[]
> {
  const { query } = await import("@/lib/db");
  const result = await query<{ slug: string; updated_at: Date }>(
    `SELECT slug, updated_at
     FROM blog_posts
     WHERE status = 'published'
     ORDER BY published_at DESC`
  );
  return result.rows;
}

export function buildBlogPostingSchema(post: BlogPost) {
  const description = post.meta_desc || post.excerpt || "";
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    datePublished: post.published_at?.toISOString(),
    dateModified: post.updated_at.toISOString(),
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: "Marine Emission Package",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "Marine Emission Package",
      url: SITE,
    },
  };
}

export function getPostSeoTitle(post: BlogPost): string {
  return post.meta_title || post.title;
}

export function getPostSeoDescription(post: BlogPost): string {
  return post.meta_desc || post.excerpt || "";
}
