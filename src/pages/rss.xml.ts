import type { APIRoute } from "astro";
import { fetchPublishedPosts } from "@/lib/blog";
import { BRAND_SHORT, SITE_URL } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  let posts: Awaited<ReturnType<typeof fetchPublishedPosts>> = [];

  try {
    posts = await fetchPublishedPosts();
  } catch (err) {
    console.warn("[rss] blog yazıları alınamadı:", err);
  }

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date().toUTCString();
      const description = escapeXml(post.excerpt || "");
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>PPWR Blog · ${BRAND_SHORT}</title>
    <link>${SITE_URL}/blog</link>
    <description>PPWR uyumu ve ambalaj analizleri üzerine Türkçe yazılar.</description>
    <language>tr</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
