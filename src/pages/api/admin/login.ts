import type { APIRoute } from "astro";
import { query } from "@/lib/db";
import { clean, getIp, json } from "@/lib/validate";
import {
  buildSetCookieHeader,
  checkLoginRateLimit,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const ip = getIp(request) || "unknown";
  if (!checkLoginRateLimit(ip)) {
    return json({ ok: false, error: "Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin." }, 429);
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Geçersiz istek." }, 400);
  }

  const email = clean(data.email, 160).toLowerCase();
  const password =
    typeof data.password === "string" ? data.password.slice(0, 128) : "";

  if (!email || !password) {
    return json({ ok: false, error: "E-posta veya parola hatalı." }, 401);
  }

  try {
    const result = await query<{ id: number; password_hash: string }>(
      "SELECT id, password_hash FROM admin_users WHERE lower(email) = $1 LIMIT 1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return json({ ok: false, error: "E-posta veya parola hatalı." }, 401);
    }

    const token = createSessionToken(user.id);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSetCookieHeader(token),
      },
    });
  } catch (err) {
    console.error("[admin/login] hata:", err);
    return json({ ok: false, error: "Giriş sırasında bir sorun oluştu." }, 500);
  }
};
