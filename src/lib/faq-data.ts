export interface FaqItem {
  question: string;
  answer: string;
}

/** Ana sayfa FAQ: görünen metin ve FAQPage schema bu kaynaktan gelir. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "PPWR nedir?",
    answer:
      "PPWR, Avrupa Birliği'nin Ambalaj ve Ambalaj Atığı Tüzüğü'dür (EU 2025/40). Ambalajın tasarımı, içeriği ve geri dönüştürülebilirliği için ortak kurallar getirir ve tüm AB'de doğrudan uygulanır.",
  },
  {
    question: "PPWR ne zaman yürürlüğe giriyor?",
    answer:
      "Tüzük 11 Şubat 2025'te yürürlüğe girdi. Yükümlülüklerin çoğu için ana uygulama tarihi 12 Ağustos 2026'dır. Bazı hükümler sonraki tarihlerde kademeli devreye girer.",
  },
  {
    question: "PPWR bizi neden ilgilendiriyor?",
    answer:
      "Avrupa'ya ambalajlı ürün gönderiyorsanız, ambalajınızın tüzüğün ölçütlerini karşılaması pazar erişiminizin şartıdır. Uygun olmayan ambalaj, ürünün AB pazarına girişini engelleyebilir.",
  },
  {
    question: "Nereden başlamalıyız?",
    answer:
      "Ambalaj portföyünüzün hızlı bir boşluk değerlendirmesiyle. Marine Emission ücretsiz ön değerlendirme sunar, ardından öncelik sıralı bir yol haritası çıkarır.",
  },
];

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

import { SITE_URL } from "@/lib/site";

export const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "PPWR Uyum Danışmanlığı ve Ambalaj Analizleri",
  provider: {
    "@type": "Organization",
    name: "Marine Emission Package",
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "Türkiye",
  },
  description:
    "Avrupa'ya ihracat yapan üreticiler için PPWR (EU 2025/40) uyum danışmanlığı ve ambalaj analiz hizmetleri.",
  serviceType: ["PPWR danışmanlık", "Ambalaj analizi", "PFAS analizi", "Ağır metal analizi"],
};
