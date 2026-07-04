import type { APIRoute } from "astro";
import { assertSameOrigin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { updateContactStatus } from "@/lib/admin";
import { isApplicationStatus } from "@/lib/application-status";
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
  const status = String(data.status || "");
  const previousStatus = String(data.previous_status || "");

  if (!Number.isFinite(id)) return json({ ok: false, error: "Geçersiz kayıt." }, 422);
  if (!isApplicationStatus(status)) return json({ ok: false, error: "Geçersiz durum." }, 422);

  try {
    const updated = await updateContactStatus(id, status);
    if (!updated) return json({ ok: false, error: "Kayıt bulunamadı." }, 404);

    await writeAuditLog({
      adminId: locals.adminId,
      action: "status_update",
      resourceType: "contact",
      resourceId: id,
      details: { from: previousStatus || null, to: status },
      ip: getIp(request),
    });

    return json({ ok: true });
  } catch (err) {
    console.error("[admin/status] hata:", err);
    return json({ ok: false, error: "Durum güncellenemedi." }, 500);
  }
};
