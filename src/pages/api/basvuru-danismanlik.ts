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
    company: clean(data.company, 160),
    full_name,
    email,
    phone: clean(data.phone, 40),
    topic: clean(data.topic, 120),
    message: clean(data.message, 4000),
    ip: getIp(request),
    consent_at: now,
    retention_until: retentionUntil,
  };

  try {
    await query(
      `INSERT INTO consultancy_applications
       (company, full_name, email, phone, topic, message, ip, consent_at, retention_until)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        payload.company, payload.full_name, payload.email,
        payload.phone, payload.topic, payload.message, payload.ip,
        payload.consent_at, payload.retention_until,
      ]
    );
  } catch (err) {
    console.error("[danismanlik-basvuru] db hatası:", err);
    return json({ ok: false, error: "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." }, 500);
  }

  await notify("Yeni DANIŞMANLIK başvurusu, me-package.com", {
    Firma: payload.company,
    "Ad Soyad": payload.full_name,
    "E-posta": payload.email,
    Telefon: payload.phone,
    Konu: payload.topic,
    Mesaj: payload.message,
  });

  return json({ ok: true, message: "Başvurunuz alındı. En kısa sürede dönüş yapacağız." });
};
