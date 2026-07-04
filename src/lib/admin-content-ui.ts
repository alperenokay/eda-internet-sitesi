import type { ContentKey } from "@/lib/content-defaults";

export type ContentGroup = "site" | "pages" | "legal" | "system";

export interface ContentGroupMeta {
  label: string;
  description: string;
}

export const CONTENT_GROUPS: Record<ContentGroup, ContentGroupMeta> = {
  site: {
    label: "Tüm sitede geçerli",
    description: "Menü, iletişim bilgileri, footer ve harita bağlantıları.",
  },
  pages: {
    label: "Sayfa metinleri",
    description: "Her sayfanın kendi başlık, metin ve buton alanları.",
  },
  legal: {
    label: "Yasal metinler",
    description: "KVKK aydınlatma metni ve benzeri sabit hukuki içerik.",
  },
  system: {
    label: "Sistem sayfaları",
    description: "Ziyaretçinin nadiren gördüğü teknik sayfalar.",
  },
};

export const CONTENT_GROUP_BY_KEY: Record<ContentKey, ContentGroup> = {
  global: "site",
  home: "pages",
  about: "pages",
  contact: "pages",
  blog_page: "pages",
  kvkk: "legal",
  not_found: "system",
};

export interface AdminSectionLink {
  id: string;
  label: string;
}

export const CONTENT_SECTION_NAV: Record<ContentKey, AdminSectionLink[]> = {
  global: [
    { id: "section-brand", label: "Marka ve iletişim" },
    { id: "section-map", label: "Harita bağlantıları" },
    { id: "section-chrome", label: "Üst ve alt alan" },
    { id: "section-header-nav", label: "Üst menü" },
    { id: "section-footer-nav", label: "Alt menü" },
  ],
  home: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-hero", label: "Sayfa başı" },
    { id: "section-principles", label: "Yaklaşım bandı" },
    { id: "section-principles-cards", label: "Yaklaşım kartları" },
    { id: "section-practice", label: "Çalışma alanları" },
    { id: "section-practice-cards", label: "Uzmanlık kartları" },
    { id: "section-posts", label: "Son yayınlar" },
    { id: "section-cta", label: "Alt iletişim bandı" },
  ],
  about: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-hero", label: "Sayfa başı" },
    { id: "section-intro", label: "Giriş metni" },
    { id: "section-blocks", label: "Bilgi kartları" },
    { id: "section-cta", label: "Alt iletişim bandı" },
  ],
  contact: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-hero", label: "Sayfa başı" },
    { id: "section-sidebar", label: "Yan bilgi paneli" },
    { id: "section-form", label: "İletişim formu" },
    { id: "section-map", label: "Harita bölümü" },
  ],
  blog_page: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-hero", label: "Sayfa başı" },
    { id: "section-list", label: "Yazı listesi" },
  ],
  kvkk: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-page", label: "Sayfa başlığı" },
    { id: "section-body", label: "Metin gövdesi" },
    { id: "section-disclaimer", label: "Alt not" },
  ],
  not_found: [
    { id: "section-seo", label: "Arama sonuçları" },
    { id: "section-message", label: "Hata metni" },
    { id: "section-buttons", label: "Yönlendirme butonları" },
  ],
};

export const CONTENT_LIST_ORDER: ContentKey[] = [
  "global",
  "home",
  "about",
  "contact",
  "blog_page",
  "kvkk",
  "not_found",
];
