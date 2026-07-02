/** Canonical site adresi (SEO, schema, sitemap). */
export const SITE_URL = "https://www.me-package.com";

/** Marka kısa adı (title suffix, og:site_name). */
export const BRAND_SHORT = "mepackage";

/** Varsayılan KVKK / iletişim e-postası. */
export const DEFAULT_CONTACT_EMAIL = "info@me-package.com";

export const site = {
  url: SITE_URL,
  domain: "www.me-package.com",
  apexDomain: "me-package.com",
  brandShort: BRAND_SHORT,
  brandFull: "Marine Emission Package",
  email: "info@me-package.com",
  phone: "",
  cities: ["İstanbul", "İzmir"],
} as const;
