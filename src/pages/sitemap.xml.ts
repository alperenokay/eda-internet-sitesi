import type { APIRoute } from "astro";
import { fetchPublishedSlugsForSitemap } from "@/lib/blog";

import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/danismanlik", changefreq: "monthly", priority: "0.9" },
  { path: "/analizler", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/iletisim", changefreq: "monthly", priority: "0.7" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.4" },
];

function buildUrlEntry(path: string, changefreq: string, priority: string, lastmod?: string) {
  const loc = SITE_URL + path;
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries: string[] = STATIC_ROUTES.map((route) =>
    buildUrlEntry(route.path, route.changefreq, route.priority, today)
  );

  try {
    const posts = await fetchPublishedSlugsForSitemap();
    for (const post of posts) {
      entries.push(
        buildUrlEntry(
          `/blog/${post.slug}`,
          "monthly",
          "0.6",
          post.updated_at.toISOString().slice(0, 10)
        )
      );
    }
  } catch (err) {
    console.warn("[sitemap] blog rotaları eklenemedi:", err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
