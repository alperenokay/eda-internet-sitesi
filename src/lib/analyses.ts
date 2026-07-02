import { SITE_URL } from "@/lib/site";

export interface AnalysisPreview {
  slug: string;
  title: string;
  summary: string;
  threshold: string | null;
}

export interface AnalysisOption {
  slug: string;
  title: string;
}

/** DB erişilemezse kullanılan statik yedek (seed ile uyumlu, sort_order sırası). */
export const FALLBACK_ANALYSES: AnalysisPreview[] = [
  {
    slug: "ppwr-gap",
    title: "PPWR Genel Uyum Ön Değerlendirmesi",
    summary:
      "Ürün ve ambalaj portföyünüz için hızlı boşluk (gap) analizi ve yol haritası.",
    threshold: "Ücretsiz ön değerlendirme",
  },
  {
    slug: "pfas",
    title: "PFAS Analizi",
    summary:
      "Ambalajda kasıtlı eklenen PFAS ve toplam flor seviyesinin PPWR eşiklerine göre değerlendirilmesi.",
    threshold: "Bireysel ≤25 ppb · toplam ≤250 ppb · toplam flor ≤50 mg/kg",
  },
  {
    slug: "agir-metal",
    title: "Ağır Metal Analizi",
    summary:
      "Kurşun, kadmiyum, cıva ve altı değerlikli krom toplamının sınır değere uygunluğu.",
    threshold: "Pb+Cd+Hg+Cr(VI) ≤100 mg/kg",
  },
  {
    slug: "geri-donusturulebilirlik",
    title: "Geri Dönüştürülebilirlik / Design for Recycling",
    summary:
      "Ambalajın geri dönüştürülebilirlik derecelendirmesi ve tasarım uyum değerlendirmesi.",
    threshold: "Derecelendirme sınıfları (A–E)",
  },
  {
    slug: "minimizasyon",
    title: "Minimizasyon Değerlendirmesi",
    summary:
      "Ağırlık, hacim ve katman fazlalığının minimizasyon eşiğine göre analizi.",
    threshold: "Eşik %50 · e-ticaret %40",
  },
  {
    slug: "geri-donusturulmus-icerik",
    title: "Geri Dönüştürülmüş İçerik Doğrulama Hazırlığı",
    summary:
      "Plastik ambalajda geri dönüştürülmüş içerik oranının doğrulamaya hazırlanması.",
    threshold: "Zorunlu asgari oranlar (malzemeye göre)",
  },
  {
    slug: "yeniden-kullanim",
    title: "Yeniden Kullanım Hedef Analizi",
    summary:
      "Nakliye/grup ambalajı için yeniden kullanım hedeflerinin durum analizi.",
    threshold: "%40 / %70 · AB içi %100",
  },
  {
    slug: "doc",
    title: "Uygunluk Beyanı (DoC) Hazırlama",
    summary:
      "PPWR uygunluk beyanının hazırlanması ve saklama süresi yönetimi.",
    threshold: "Saklama 5 / 10 yıl",
  },
  {
    slug: "dpp-qr",
    title: "DPP / QR İşaretleme Hazırlığı",
    summary:
      "Dijital Ürün Pasaportu ve QR işaretleme altyapısına hazırlık.",
    threshold: "public_uuid tabanlı DPP stub",
  },
  {
    slug: "etiketleme",
    title: "Etiketleme ve İşaretleme Uyumu",
    summary:
      "Malzeme bileşimi ve ayrıştırma etiketlerinin PPWR uyumu.",
    threshold: "Harmonize sembol seti",
  },
  {
    slug: "epr-lucid",
    title: "EPR / LUCID Kayıt Desteği",
    summary:
      "Genişletilmiş üretici sorumluluğu kaydı ve Almanya LUCID hazırlığı (temiz veri ihracı).",
    threshold: "Yalnızca temiz veri ihracı",
  },
  {
    slug: "csrd-entegrasyon",
    title: "CSRD Ambalaj-Dilimi Entegrasyonu",
    summary:
      "Aynı veriyle hem PPWR hem CSRD raporlamasını besleyen entegrasyon (farklılaştırıcımız).",
    threshold: "Ambalaj-slice filtresi",
  },
  {
    slug: "green-claims",
    title: "Green Claims Doğrulama",
    summary:
      "Çevresel iddiaların kanıtlanabilirlik ve yeşil aklama riski açısından değerlendirilmesi.",
    threshold: "Kanıt tabanlı iddia kontrolü",
  },
];

async function fetchFromDb(limit?: number): Promise<AnalysisPreview[]> {
  const { query } = await import("@/lib/db");
  const sql = limit
    ? `SELECT slug, title, summary, threshold
       FROM analyses
       WHERE is_active = true
       ORDER BY sort_order ASC
       LIMIT $1`
    : `SELECT slug, title, summary, threshold
       FROM analyses
       WHERE is_active = true
       ORDER BY sort_order ASC`;
  const result = limit
    ? await query<AnalysisPreview>(sql, [limit])
    : await query<AnalysisPreview>(sql);
  return result.rows;
}

export async function fetchActiveAnalyses(): Promise<AnalysisPreview[]> {
  return fetchFromDb(6);
}

export async function fetchCatalogAnalyses(): Promise<AnalysisPreview[]> {
  return fetchFromDb();
}

export function toFormOptions(analyses: AnalysisPreview[]): AnalysisOption[] {
  return analyses.map(({ slug, title }) => ({ slug, title }));
}

export function buildAnalysisItemListSchema(analyses: AnalysisPreview[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PPWR Ambalaj Analizleri",
    itemListElement: analyses.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.summary,
      url: `${SITE_URL}/analizler#${item.slug}`,
    })),
  };
}
