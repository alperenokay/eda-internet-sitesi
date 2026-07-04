import type { APIRoute } from "astro";
import { assertSameOrigin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { anonymizeContactMessage } from "@/lib/admin";
import { getIp, json } from "@/lib/validate";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.adminId) return json({ ok: false, error: "Oturum gerekli." }, 401);
  if (!assertSameOrigin(request)) return json({ ok: false, error: "Geçersiz kaynak." }, 403);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const id = Number(data.id);
  if (!Number.isFinite(id)) return json({ ok: false, error: "Geçersiz kayıt." }, 422);

  try {
    const deleted = await anonymizeContactMessage(id);
    if (!deleted) return json({ ok: false, error: "Kayıt bulunamadı veya zaten silinmiş." }, 404);

    await writeAuditLog({
      adminId: locals.adminId,
      action: "application_anonymize",
      resourceType: "contact",
      resourceId: id,
      ip: getIp(request),
    });

    return json({ ok: true });
  } catch (err) {
    console.error("[admin/application] silme hatası:", err);
    return json({ ok: false, error: "Silme sırasında bir sorun oluştu." }, 500);
  }
};
