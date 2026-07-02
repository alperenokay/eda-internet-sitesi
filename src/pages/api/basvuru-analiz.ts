import type { APIRoute } from "astro";
import { query } from "@/lib/db";
import { computeRetentionUntil } from "@/lib/kvkk";
import { notify } from "@/lib/mail";
import { isEmail, clean, required, getIp, json, hasKvkkConsent, KVKK_CONSENT_ERROR } from "@/lib/validate";
import { checkFormRateLimit } from "@/lib/rate-limit";

export const POST: APIRoute = async ({ request }) => {
  const ip = getIp(request) || "unknown";
  if (!checkFormRateLimit(ip)) {
    return json({ ok: false, error: "Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin." }, 429);
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  if (clean(data.website, 200)) {
    return json({ ok: true, message: "Başvurunuz alındı. En kısa sürede dönüş yapacağız." });
  }

  if (!hasKvkkConsent(data)) {
    return json({ ok: false, error: KVKK_CONSENT_ERROR }, 422);
  }

  const full_name = clean(data.full_name, 120);
  const email = clean(data.email, 160);
  if (!required(full_name)) return json({ ok: false, error: "Ad soyad gerekli." }, 422);
  if (!isEmail(email)) return json({ ok: false, error: "Geçerli bir e-posta girin." }, 422);

  const now = new Date();
  const retentionUntil = computeRetentionUntil(now);

  const payload = {
    analysis_slug: clean(data.analysis_slug, 80) || null,
    company: clean(data.company, 160),
    full_name,
    email,
    phone: clean(data.phone, 40),
    material_type: clean(data.material_type, 160),
    message: clean(data.message, 4000),
    ip: getIp(request),
    consent_at: now,
    retention_until: retentionUntil,
  };

  try {
    await query(
      `INSERT INTO analysis_applications
       (analysis_slug, company, full_name, email, phone, material_type, message, ip, consent_at, retention_until)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        payload.analysis_slug, payload.company, payload.full_name,
        payload.email, payload.phone, payload.material_type,
        payload.message, payload.ip, payload.consent_at, payload.retention_until,
      ]
    );
  } catch (err) {
    console.error("[analiz-basvuru] db hatası:", err);
    return json({ ok: false, error: "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." }, 500);
  }

  await notify("Yeni ANALİZ başvurusu, me-package.com", {
    Analiz: payload.analysis_slug || "genel",
    Firma: payload.company,
    "Ad Soyad": payload.full_name,
    "E-posta": payload.email,
    Telefon: payload.phone,
    Malzeme: payload.material_type,
    Mesaj: payload.message,
  });

  return json({ ok: true, message: "Başvurunuz alındı. En kısa sürede dönüş yapacağız." });
};
