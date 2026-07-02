import type { APIRoute } from "astro";
import { healthCheck } from "@/lib/db";
import { json } from "@/lib/validate";

export const GET: APIRoute = async () => {
  const dbUp = await healthCheck();
  if (!dbUp) {
    return json({ ok: false, db: "down" }, 503);
  }
  return json({ ok: true, db: "up" });
};
