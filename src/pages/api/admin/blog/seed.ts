import type { APIRoute } from "astro";
import { assertSameOrigin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { seedStaticBlogPosts } from "@/lib/blog-seed";
import { getIp, json } from "@/lib/validate";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  try {
    const result = await seedStaticBlogPosts();
    await writeAuditLog({
      adminId: locals.adminId,
      action: "blog_seed",
      resourceType: "blog_post",
      resourceId: null,
      details: result,
      ip: getIp(request),
    });
    return json({ ok: true, ...result });
  } catch (err) {
    console.error("[admin/blog/seed] hata:", err);
    return json({ ok: false, error: "İçe aktarma sırasında bir sorun oluştu." }, 500);
  }
};
