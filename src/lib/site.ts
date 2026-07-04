/** Canonical site adresi (SEO, schema, sitemap). */
export const SITE_URL = "https://www.sagirhukuk.net";

/** Marka kısa adı (title suffix, og:site_name). */
export const BRAND_SHORT = "Sağır Hukuk";

/** Varsayılan KVKK / iletişim e-postası (env yoksa). */
export const DEFAULT_CONTACT_EMAIL = "av.edasagir@sagirhukuk.net";

/**
 * Statik yedek (DB/CMS kapalıyken). Canlı sitede `getSite()` / `getContent("global")` kullanın.
 * @deprecated Yeni kodda src/lib/content.ts tercih edin.
 */
export const site = {  url: SITE_URL,
  domain: "www.sagirhukuk.net",
  apexDomain: "sagirhukuk.net",
  brandShort: BRAND_SHORT,
  brandFull: "Sağır Hukuk & Danışmanlık",
  attorney: "Av. Eda Öykü Sağır",
  email: "av.edasagir@sagirhukuk.net",
  phone: "0541 805 55 77",
  address:
    "İsmet Kaptan Mah. Gazi Bulvarı No:83 D:801 K:8 Hasan Bozkurt İş Hanı, Konak/İzmir",
  /** Google Maps embed (output=embed, API anahtarı gerekmez) */
  mapEmbedUrl:
    "https://www.google.com/maps?q=Hasan+Bozkurt+%C4%B0%C5%9F+Hani+Gazi+Bulvar%C4%B1+83+Konak+%C4%B0zmir&hl=tr&z=17&output=embed",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Hasan+Bozkurt+%C4%B0%C5%9F+Hani+Gazi+Bulvar%C4%B1+No+83+Konak+%C4%B0zmir",
  workingHours: "Pazartesi–Cuma, 09:00–18:30",
  cities: ["İzmir"],
} as const;
