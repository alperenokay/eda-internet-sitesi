import type { APIRoute } from "astro";
import { assertSameOrigin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import {
  getContent,
  mergeContent,
  parseContentKey,
  saveContent,
} from "@/lib/content";
import { CONTENT_DEFAULTS, type ContentKey } from "@/lib/content-defaults";
import { clean, getIp, json, safeHttpUrl } from "@/lib/validate";

function sanitizeContentData(key: ContentKey, data: unknown): unknown {
  if (!data || typeof data !== "object") return CONTENT_DEFAULTS[key];

  const merged = mergeContent(CONTENT_DEFAULTS[key], data);

  if (key === "global") {
    const g = merged as (typeof CONTENT_DEFAULTS)["global"];
    return {
      ...g,
      brandFull: clean(g.brandFull, 120),
      attorney: clean(g.attorney, 120),
      email: clean(g.email, 120),
      phone: clean(g.phone, 40),
      address: clean(g.address, 300),
      workingHours: clean(g.workingHours, 120),
      mapEmbedUrl: safeHttpUrl(g.mapEmbedUrl) ?? CONTENT_DEFAULTS.global.mapEmbedUrl,
      mapsDirectionsUrl: safeHttpUrl(g.mapsDirectionsUrl) ?? CONTENT_DEFAULTS.global.mapsDirectionsUrl,
      orgDescription: clean(g.orgDescription, 500),
      headerCtaHref: clean(g.headerCtaHref, 200),
      headerCtaLabel: clean(g.headerCtaLabel, 80),
      footerBlurb: clean(g.footerBlurb, 600),
      headerNav: sanitizeNav(g.headerNav),
      footerNav: sanitizeNav(g.footerNav),
    };
  }

  if (key === "kvkk") {
    const k = merged as (typeof CONTENT_DEFAULTS)["kvkk"];
    return {
      ...k,
      seo: sanitizeSeo(k.seo),
      pageTitle: clean(k.pageTitle, 200),
      lastUpdated: clean(k.lastUpdated, 80),
      bodyMd: typeof k.bodyMd === "string" ? k.bodyMd.slice(0, 50000) : CONTENT_DEFAULTS.kvkk.bodyMd,
      disclaimer: clean(k.disclaimer, 500),
    };
  }

  return merged;
}

function sanitizeSeo(seo: { title: string; description: string; keywords?: string }) {
  return {
    title: clean(seo.title, 200),
    description: clean(seo.description, 500),
    keywords: clean(seo.keywords, 300) || undefined,
  };
}

function sanitizeNav(items: { href: string; label: string }[]) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      href: clean(item.href, 200),
      label: clean(item.label, 80),
    }))
    .filter((item) => item.href && item.label)
    .slice(0, 12);
}

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const key = parseContentKey(typeof body.key === "string" ? body.key : undefined);
  if (!key) return json({ ok: false, error: "Geçersiz içerik anahtarı." }, 422);

  const sanitized = sanitizeContentData(key, body.data);

  try {
    await saveContent(key, sanitized, locals.adminId);
    await writeAuditLog({
      adminId: locals.adminId,
      action: "content_update",
      resourceType: "site_content",
      resourceId: null,
      details: { content_key: key },
      ip: getIp(request),
    });
    const saved = await getContent(key);
    return json({ ok: true, data: saved });
  } catch (err) {
    console.error("[admin/content] kayıt hatası:", err);
    return json({ ok: false, error: "Kayıt sırasında bir sorun oluştu." }, 500);
  }
};
