import type { APIRoute } from "astro";
import { assertSameOrigin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import {
  createBlogPost,
  deleteBlogPost,
  slugExists,
  updateBlogPost,
} from "@/lib/admin";
import { slugify } from "@/lib/slugify";
import { clean, json, required, getIp, safeHttpUrl } from "@/lib/validate";

function parseBlogBody(data: Record<string, unknown>) {
  const title = clean(data.title, 200);
  let slug = clean(data.slug, 80) || slugify(title);
  slug = slugify(slug);
  const body_md = typeof data.body_md === "string" ? data.body_md.slice(0, 100000) : "";
  const status = clean(data.status, 20) === "published" ? "published" : "draft";

  return {
    title,
    slug,
    excerpt: clean(data.excerpt, 500) || null,
    body_md,
    cover_image: safeHttpUrl(data.cover_image),
    meta_title: clean(data.meta_title, 200) || null,
    meta_desc: clean(data.meta_desc, 500) || null,
    keywords: clean(data.keywords, 300) || null,
    status,
  };
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const input = parseBlogBody(data);
  if (!required(input.title)) return json({ ok: false, error: "Başlık gerekli." }, 422);
  if (!required(input.slug)) return json({ ok: false, error: "Slug gerekli." }, 422);
  if (!required(input.body_md)) return json({ ok: false, error: "Gövde metni gerekli." }, 422);

  try {
    if (await slugExists(input.slug)) {
      return json({ ok: false, error: "Bu slug zaten kullanılıyor. Farklı bir slug seçin." }, 409);
    }
    const id = await createBlogPost(input);
    await writeAuditLog({
      adminId: locals.adminId,
      action: "blog_create",
      resourceType: "blog_post",
      resourceId: id,
      ip: getIp(request),
    });
    return json({ ok: true, id });
  } catch (err) {
    console.error("[admin/blog] create hata:", err);
    return json({ ok: false, error: "Kayıt sırasında bir sorun oluştu." }, 500);
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const id = Number(data.id);
  if (!Number.isFinite(id)) return json({ ok: false, error: "Geçersiz yazı." }, 422);

  const input = parseBlogBody(data);
  if (!required(input.title)) return json({ ok: false, error: "Başlık gerekli." }, 422);
  if (!required(input.slug)) return json({ ok: false, error: "Slug gerekli." }, 422);
  if (!required(input.body_md)) return json({ ok: false, error: "Gövde metni gerekli." }, 422);

  try {
    if (await slugExists(input.slug, id)) {
      return json({ ok: false, error: "Bu slug zaten kullanılıyor. Farklı bir slug seçin." }, 409);
    }
    await updateBlogPost(id, input);
    await writeAuditLog({
      adminId: locals.adminId,
      action: "blog_update",
      resourceType: "blog_post",
      resourceId: id,
      ip: getIp(request),
    });
    return json({ ok: true, id });
  } catch (err) {
    console.error("[admin/blog] update hata:", err);
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return json({ ok: false, error: "Yazı bulunamadı." }, 404);
    }
    return json({ ok: false, error: "Kayıt sırasında bir sorun oluştu." }, 500);
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const id = Number(data.id);
  if (!Number.isFinite(id)) return json({ ok: false, error: "Geçersiz yazı." }, 422);

  try {
    const deleted = await deleteBlogPost(id);
    if (!deleted) return json({ ok: false, error: "Yazı bulunamadı." }, 404);

    await writeAuditLog({
      adminId: locals.adminId,
      action: "blog_delete",
      resourceType: "blog_post",
      resourceId: id,
      ip: getIp(request),
    });

    return json({ ok: true });
  } catch (err) {
    console.error("[admin/blog] delete hata:", err);
    return json({ ok: false, error: "Silme sırasında bir sorun oluştu." }, 500);
  }
};
