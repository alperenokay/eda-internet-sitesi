import type { APIRoute } from "astro";
import { assertSameOrigin, buildClearCookieHeader } from "@/lib/auth";
import { json } from "@/lib/validate";

export const POST: APIRoute = async ({ request }) => {
  if (!assertSameOrigin(request)) {
    return json({ ok: false, error: "Geçersiz kaynak." }, 403);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildClearCookieHeader(),
    },
  });
};
