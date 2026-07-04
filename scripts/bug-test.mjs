#!/usr/bin/env node
/**
 * Yerel bug testi: public rotalar, API, DB.
 * Kullanım: node scripts/bug-test.mjs
 */
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const BASE = process.env.BUG_TEST_BASE || "http://localhost:4321";
const results = { pass: 0, fail: 0, warn: 0, items: [] };

function log(status, name, detail = "") {
  results.items.push({ status, name, detail });
  if (status === "PASS") results.pass++;
  else if (status === "FAIL") results.fail++;
  else results.warn++;
  const icon = status === "PASS" ? "OK" : status === "FAIL" ? "FAIL" : "WARN";
  console.log(`${icon}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchStatus(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  return { status: res.status, res, body: await res.text() };
}

async function testPublicRoutes() {
  const routes = [
    ["/", 200],
    ["/blog", 200],
    ["/iletisim", 200],
    ["/kvkk", 200],
    ["/404", 404],
    ["/admin/login", 200],
    ["/sitemap.xml", 200],
    ["/api/health", 200],
  ];

  for (const [path, expected] of routes) {
    try {
      const { status, body } = await fetchStatus(path);
      if (status === expected) {
        log("PASS", `GET ${path}`, String(status));
      } else {
        log("FAIL", `GET ${path}`, `beklenen ${expected}, gelen ${status}`);
      }
      if (path === "/api/health" && !body.includes('"db":"up"')) {
        log("FAIL", "DB health", body.slice(0, 80));
      }
    } catch (err) {
      log("FAIL", `GET ${path}`, err instanceof Error ? err.message : String(err));
    }
  }
}

async function testBlogSlugs() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    log("WARN", "Blog slug testi", "DATABASE_URL yok");
    return;
  }
  const client = new pg.Client({
    connectionString: url,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const r = await client.query(
      "SELECT slug FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 10"
    );
    if (r.rows.length === 0) {
      log("WARN", "Blog yazıları", "DB'de yayınlanmış yazı yok");
    } else {
      log("PASS", "Blog DB", `${r.rows.length} yayınlanmış yazı`);
      for (const row of r.rows.slice(0, 3)) {
        const { status } = await fetchStatus(`/blog/${row.slug}`);
        if (status === 200) log("PASS", `GET /blog/${row.slug}`, "200");
        else log("FAIL", `GET /blog/${row.slug}`, String(status));
      }
    }
  } catch (err) {
    log("FAIL", "Blog DB", err instanceof Error ? err.message : String(err));
  } finally {
    await client.end();
  }
}

async function testAdminProtected() {
  try {
    const { status } = await fetchStatus("/admin");
    if (status === 200 || status === 302 || status === 307) {
      log("PASS", "GET /admin (oturumsuz)", `${status} (login yönlendirmesi beklenir)`);
    } else {
      log("WARN", "GET /admin (oturumsuz)", String(status));
    }

    const api = await fetchStatus("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "x", slug: "x", body_md: "x" }),
    });
    if (api.status === 401) log("PASS", "POST /api/admin/blog (oturumsuz)", "401");
    else log("FAIL", "POST /api/admin/blog (oturumsuz)", `beklenen 401, gelen ${api.status}`);
  } catch (err) {
    log("FAIL", "Admin koruması", err instanceof Error ? err.message : String(err));
  }
}

async function testContactValidation() {
  try {
    const noConsent = await fetchStatus("/api/iletisim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Test",
        email: "test@example.com",
        message: "Test mesaj",
        kvkk_consent: false,
      }),
    });
    if (noConsent.status === 422) log("PASS", "İletişim KVKK doğrulama", "422");
    else log("FAIL", "İletişim KVKK doğrulama", String(noConsent.status));

    const honeypot = await fetchStatus("/api/iletisim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Test",
        email: "test@example.com",
        message: "Spam",
        kvkk_consent: true,
        website: "http://spam.com",
      }),
    });
    const honeypotJson = JSON.parse(honeypot.body);
    if (honeypotJson.ok === true) log("PASS", "Honeypot (sessiz kabul)", "ok:true");
    else log("WARN", "Honeypot", honeypot.body.slice(0, 60));
  } catch (err) {
    log("FAIL", "İletişim API", err instanceof Error ? err.message : String(err));
  }
}

async function testContentKeys() {
  const keys = ["global", "home", "contact", "blog_page", "kvkk", "not_found"];
  for (const key of keys) {
    try {
      const { status } = await fetchStatus(`/admin/icerik/${key}`);
      if ([200, 302, 307].includes(status)) {
        log("PASS", `GET /admin/icerik/${key}`, String(status));
      } else {
        log("FAIL", `GET /admin/icerik/${key}`, String(status));
      }
    } catch (err) {
      log("FAIL", `GET /admin/icerik/${key}`, err instanceof Error ? err.message : String(err));
    }
  }
}

async function testInlineHtmlRender() {
  try {
    const { body, status } = await fetchStatus("/");
    if (status !== 200) {
      log("FAIL", "Ana sayfa HTML", String(status));
      return;
    }
    const checks = [
      ["lang=\"tr\"", "lang=tr"],
      ["Sağır Hukuk", "marka metni"],
      ["application/ld+json", "schema.org"],
    ];
    for (const [needle, label] of checks) {
      if (body.includes(needle)) log("PASS", `Ana sayfa: ${label}`, "var");
      else log("WARN", `Ana sayfa: ${label}`, "bulunamadı");
    }
    if (body.includes("og-default.png") && !body.includes("og-default.png HTTP")) {
      log("WARN", "og-default.png", "meta'da referans var, dosya eksik olabilir");
    }
  } catch (err) {
    log("FAIL", "Ana sayfa HTML", err instanceof Error ? err.message : String(err));
  }
}

console.log(`\nBug test — ${BASE}\n${"=".repeat(40)}\n`);
await testPublicRoutes();
await testBlogSlugs();
await testAdminProtected();
await testContactValidation();
await testContentKeys();
await testInlineHtmlRender();

console.log(`\n${"=".repeat(40)}`);
console.log(`Sonuç: ${results.pass} geçti, ${results.fail} hata, ${results.warn} uyarı`);
process.exit(results.fail > 0 ? 1 : 0);
