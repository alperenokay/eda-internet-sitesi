import { defineMiddleware } from "astro:middleware";
import { getSessionFromRequest } from "@/lib/auth";
import { applySecurityHeaders } from "@/lib/security-headers";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginApi = pathname === "/api/admin/login";
  const isLogoutApi = pathname === "/api/admin/logout";

  if (isAdminPage && !isAdminLoginPage) {
    const session = getSessionFromRequest(context.request);
    if (!session) {
      return applySecurityHeaders(context.redirect("/admin/login"));
    }
    context.locals.adminId = session.adminId;
  }

  if (isAdminApi && !isLoginApi && !isLogoutApi) {
    const session = getSessionFromRequest(context.request);
    if (!session) {
      return applySecurityHeaders(
        new Response(JSON.stringify({ ok: false, error: "Oturum gerekli." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    context.locals.adminId = session.adminId;
  }

  const response = await next();
  return applySecurityHeaders(response);
});
