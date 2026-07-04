/** Site içeriği varsayılanları (DB yokken veya alan eksikken kullanılır). */

export interface NavItem {
  href: string;
  label: string;
}

export interface SeoFields {
  title: string;
  description: string;
  keywords?: string;
}

export interface HeroFields {
  eyebrow: string;
  chip?: string;
  title: string;
  titleHighlight: string;
  lead: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  showTrustPanel?: boolean;
}

export interface TitleTextItem {
  title: string;
  text: string;
}

export interface GlobalContent {
  brandFull: string;
  attorney: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  mapEmbedUrl: string;
  mapsDirectionsUrl: string;
  orgDescription: string;
  headerNav: NavItem[];
  footerNav: NavItem[];
  headerCtaHref: string;
  headerCtaLabel: string;
  footerBlurb: string;
}

export interface HomeContent {
  seo: SeoFields;
  hero: HeroFields;
  principlesSection: {
    eyebrow: string;
    title: string;
    items: TitleTextItem[];
  };
  practiceSection: {
    eyebrow: string;
    title: string;
    lead: string;
    items: TitleTextItem[];
  };
  postsSection: {
    eyebrow: string;
    title: string;
    lead: string;
    buttonLabel: string;
  };
  cta: {
    title: string;
    text: string;
    buttonHref: string;
    buttonLabel: string;
  };
}

export interface ContactContent {
  seo: SeoFields;
  hero: HeroFields;
  sidebar: {
    title: string;
    labels: {
      attorney: string;
      email: string;
      phone: string;
      address: string;
      workingHours: string;
    };
  };
  formSection: {
    title: string;
  };
  form: {
    submitLabel: string;
    successMessage: string;
    consentPrefix: string;
    consentLinkLabel: string;
    consentSuffix: string;
  };
  mapSection: {
    eyebrow: string;
    title: string;
    lead: string;
    directionsLinkLabel: string;
  };
}

export interface BlogPageContent {
  seo: SeoFields;
  hero: HeroFields;
  listSection: {
    title: string;
    lead: string;
    emptyMessage: string;
  };
}

export interface KvkkContent {
  seo: SeoFields;
  pageTitle: string;
  lastUpdated: string;
  bodyMd: string;
  disclaimer: string;
}

export interface NotFoundContent {
  seo: SeoFields;
  code: string;
  title: string;
  lead: string;
  buttons: NavItem[];
}

export type ContentKey =
  | "global"
  | "home"
  | "contact"
  | "blog_page"
  | "kvkk"
  | "not_found";

export type ContentMap = {
  global: GlobalContent;
  home: HomeContent;
  contact: ContactContent;
  blog_page: BlogPageContent;
  kvkk: KvkkContent;
  not_found: NotFoundContent;
};

export const CONTENT_REGISTRY: Record<
  ContentKey,
  { label: string; description: string; publicPath?: string }
> = {
  global: {
    label: "Genel ayarlar",
    description: "Marka, iletişim, menü, footer ve harita bağlantıları.",
  },
  home: {
    label: "Ana sayfa",
    description: "Hero, yaklaşım, çalışma alanları, CTA metinleri.",
    publicPath: "/",
  },
  contact: {
    label: "İletişim",
    description: "İletişim sayfası, form metinleri ve harita bölümü.",
    publicPath: "/iletisim",
  },
  blog_page: {
    label: "Blog liste sayfası",
    description: "Blog ana sayfası SEO ve bölüm metinleri.",
    publicPath: "/blog",
  },
  kvkk: {
    label: "KVKK metni",
    description: "Aydınlatma metni (Markdown). {{brandFull}}, {{contactEmail}} gibi yer tutucular kullanılabilir.",
    publicPath: "/kvkk",
  },
  not_found: {
    label: "404 sayfası",
    description: "Sayfa bulunamadı metinleri ve butonlar.",
  },
};

const KVKK_BODY_MD = `## 1. Veri sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu: **{{brandFull}}** ({{attorney}}, {{domain}}).

KVKK başvuruları için iletişim: [{{contactEmail}}](mailto:{{contactEmail}})

## 2. İşlenen kişisel veriler

Web formları aracılığıyla aşağıdaki veriler toplanabilir:

- Kimlik / iletişim: ad soyad, e-posta, telefon (opsiyonel)
- Form içeriği: konu, mesaj
- Teknik: IP adresi, başvuru tarihi, form onay kaydı (rıza zamanı)

## 3. İşleme amaçları

- İletişim taleplerini değerlendirmek ve sizinle iletişime geçmek
- Randevu ve hukuki danışmanlık taleplerini yönetmek
- Yasal yükümlülüklerin yerine getirilmesi ve meşru menfaat kapsamında kayıt tutma
- Spam ve kötüye kullanımın önlenmesi (teknik loglar)

## 4. Hukuki sebep

Kişisel verileriniz; KVKK md. 5/2 (c) sözleşmenin kurulması veya ifası, md. 5/2 (f) meşru menfaat ve formda verdiğiniz **açık rıza** kapsamında işlenir. Rıza vermeden iletişim formu gönderilemez.

## 5. Aktarım

Veriler; barındırma (Render, PostgreSQL), opsiyonel e-posta bildirimi (SMTP sağlayıcınız) ve hizmet sunumu için zorunlu iş ortakları dışında üçüncü taraflara satılmaz. Yurt dışına aktarım, altyapı sağlayıcılarının lokasyonuna bağlı olarak söz konusu olabilir; aktarımda KVKK md. 9 hükümlerine uygun önlemler hedeflenir.

## 6. Saklama süresi

İletişim kayıtları, başvuru tarihinden itibaren **{{retentionMonths}} ay** saklanır. Süre sonunda kişisel veriler anonimleştirilir veya silinir; yasal zorunluluk varsa ilgili süre kadar muhafaza edilir.

## 7. KVKK kapsamındaki haklarınız

KVKK md. 11 uyarınca;

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse bilgi talep etme
- Amacına uygun kullanılıp kullanılmadığını öğrenme
- Eksik veya yanlış işlenmişse düzeltilmesini isteme
- KVKK md. 7 kapsamında silinmesini veya yok edilmesini isteme
- İşlemenin otomatik sistemlerle analiz edilmesine itiraz etme
- Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde tazminat talep etme

Taleplerinizi [{{contactEmail}}](mailto:{{contactEmail}}) adresine iletebilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.

## 8. Güvenlik

Veriler şifreli bağlantı (HTTPS) üzerinden iletilir; veritabanı erişimi yalnızca yetkili sistem yöneticileriyle sınırlıdır.`;

export const CONTENT_DEFAULTS: ContentMap = {
  global: {
    brandFull: "Sağır Hukuk & Danışmanlık",
    attorney: "Av. Eda Öykü Sağır",
    email: "av.edasagir@sagirhukuk.net",
    phone: "0541 805 55 77",
    address:
      "İsmet Kaptan Mah. Gazi Bulvarı No:83 D:801 K:8 Hasan Bozkurt İş Hanı, Konak/İzmir",
    workingHours: "Pazartesi–Cuma, 09:00–18:30",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Hasan+Bozkurt+%C4%B0%C5%9F+Hani+Gazi+Bulvar%C4%B1+83+Konak+%C4%B0zmir&hl=tr&z=17&output=embed",
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Hasan+Bozkurt+%C4%B0%C5%9F+Hani+Gazi+Bulvar%C4%B1+No+83+Konak+%C4%B0zmir",
    orgDescription:
      "İzmir merkezli avukatlık ve danışmanlık hizmetleri. Ceza, ticaret, medeni ve idare hukuku.",
    headerNav: [
      { href: "/blog", label: "Yazılar" },
      { href: "/iletisim", label: "İletişim" },
    ],
    footerNav: [
      { href: "/blog", label: "Yazılar" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/kvkk", label: "KVKK" },
    ],
    headerCtaHref: "/iletisim#mesaj",
    headerCtaLabel: "Randevu talebi",
    footerBlurb:
      "Av. Eda Öykü Sağır · İzmir Konak merkezli avukatlık ve danışmanlık hizmetleri. Ceza, ticaret, medeni ve idare hukuku alanlarında temsil ve danışmanlık.",
  },
  home: {
    seo: {
      title: "İzmir Avukat | Sağır Hukuk & Danışmanlık",
      description:
        "Av. Eda Öykü Sağır ile ceza, ticaret, medeni ve idare hukuku alanlarında İzmir merkezli avukatlık ve danışmanlık hizmetleri.",
      keywords:
        "İzmir avukat, avukat Eda Öykü Sağır, Sağır Hukuk, ceza avukatı İzmir, ticaret hukuku, medeni hukuk",
    },
    hero: {
      eyebrow: "İzmir · Konak",
      chip: "Av. Eda Öykü Sağır",
      title: "Hukuki süreçlerinizde yanınızdayız",
      titleHighlight: "yanınızdayız",
      lead: "Sağır Hukuk & Danışmanlık, bireysel ve kurumsal müvekkillerine ceza, ticaret, medeni ve idare hukuku alanlarında danışmanlık ve dava takibi sunar.",
      primaryHref: "/iletisim#mesaj",
      primaryLabel: "Randevu talebi",
      secondaryHref: "/blog",
      secondaryLabel: "Hukuk yazıları",
      showTrustPanel: true,
    },
    principlesSection: {
      eyebrow: "Misyon ve vizyonumuz",
      title: "Güvenilir ve ölçülü temsil",
      items: [
        { title: "Şeffaf iletişim", text: "Sürecin her aşamasında net bilgilendirme." },
        { title: "Güncel mevzuat", text: "Kanun ve içtihat değişikliklerinin takibi." },
        { title: "Çözüm odaklılık", text: "Dosyaya özel strateji ve disiplinli takip." },
      ],
    },
    practiceSection: {
      eyebrow: "Uzmanlık alanları",
      title: "Çalışma alanları",
      lead: "Temel hukuk disiplinlerinde danışmanlık ve dava takibi.",
      items: [
        {
          title: "Ceza Hukuku",
          text: "Soruşturma ve kovuşturma süreçlerinde müvekkil haklarının korunması.",
        },
        {
          title: "Ticaret ve Şirketler Hukuku",
          text: "Sözleşmeler, şirket işlemleri ve ticari uyuşmazlıklarda hukuki destek.",
        },
        {
          title: "Medeni Hukuk",
          text: "Kişiler, aile, miras ve borçlar hukuku kapsamında danışmanlık.",
        },
        {
          title: "Vergi ve İdare Hukuku",
          text: "İdari işlemlere karşı başvuru ve vergi uyuşmazlıklarında temsil.",
        },
      ],
    },
    postsSection: {
      eyebrow: "Yayınlar",
      title: "Son yazılar",
      lead: "Bilgilendirme niteliğinde hukuk metinleri.",
      buttonLabel: "Tüm yazılar",
    },
    cta: {
      title: "Hukuki destek için bize ulaşın",
      text: "Randevu veya ön görüşme talebinizi iletişim formu üzerinden iletebilirsiniz.",
      buttonHref: "/iletisim#mesaj",
      buttonLabel: "İletişim formu",
    },
  },
  contact: {
    seo: {
      title: "İletişim | Sağır Hukuk & Danışmanlık",
      description:
        "Av. Eda Öykü Sağır ile iletişime geçin. İzmir Konak ofis adresi, telefon ve iletişim formu.",
    },
    hero: {
      eyebrow: "İletişim",
      title: "Bize ulaşın",
      titleHighlight: "ulaşın",
      lead: "Randevu talebi, hukuki danışmanlık veya genel sorularınız için formu doldurun ya da doğrudan arayın.",
      primaryHref: "#mesaj",
      primaryLabel: "Forma git",
      secondaryHref: "tel:05418055577",
      secondaryLabel: "Telefon et",
      showTrustPanel: true,
    },
    sidebar: {
      title: "İletişim bilgisi",
      labels: {
        attorney: "Avukat",
        email: "E-posta",
        phone: "Telefon",
        address: "Adres",
        workingHours: "Çalışma saatleri",
      },
    },
    formSection: {
      title: "Mesaj gönderin",
    },
    form: {
      submitLabel: "Mesajı gönder",
      successMessage: "Mesajınız iletildi. Teşekkürler.",
      consentPrefix: "Kişisel Verilerin Korunması",
      consentLinkLabel: "Aydınlatma Metnini",
      consentSuffix:
        "okudum. Başvurum kapsamında kişisel verilerimin belirtilen amaçlarla işlenmesine onay veriyorum.",
    },
    mapSection: {
      eyebrow: "Konum",
      title: "Ofis konumu",
      lead: "Hasan Bozkurt İş Hanı, Konak/İzmir",
      directionsLinkLabel: "Google Maps'te yol tarifi al",
    },
  },
  blog_page: {
    seo: {
      title: "Hukuk Yazıları ve Yayınlar",
      description:
        "Ceza, medeni, ticaret ve idare hukuku alanlarında bilgilendirme yazıları. Sağır Hukuk & Danışmanlık.",
      keywords:
        "hukuk blog, avukat yazıları, boşanma, ceza hukuku, ticaret hukuku, idare hukuku, İzmir avukat",
    },
    hero: {
      eyebrow: "Yayınlar",
      title: "Hukuk yazıları ve bilgilendirme metinleri",
      titleHighlight: "bilgilendirme",
      lead: "Güncel mevzuat ve uygulama çerçevesinde, sık sorulan konulara dair genel bilgilendirme yazıları.",
      primaryHref: "/iletisim#mesaj",
      primaryLabel: "Randevu talebi",
      secondaryHref: "/iletisim",
      secondaryLabel: "İletişim",
    },
    listSection: {
      title: "Son yazılar",
      lead: "Her yazı genel bilgilendirme niteliğindedir.",
      emptyMessage:
        "Henüz yayınlanmış yazı yok. Hukuki sorularınız için iletişim formunu kullanabilirsiniz.",
    },
  },
  kvkk: {
    seo: {
      title: "Kişisel Verilerin Korunması Aydınlatma Metni",
      description:
        "sagirhukuk.net iletişim formunda toplanan kişisel verilerin işlenmesine ilişkin KVKK aydınlatma metni.",
      keywords: "KVKK, kişisel veriler, aydınlatma metni, Sağır Hukuk",
    },
    pageTitle: "Kişisel Verilerin Korunması Aydınlatma Metni",
    lastUpdated: "4 Temmuz 2026",
    bodyMd: KVKK_BODY_MD,
    disclaimer:
      "Bu metin bilgilendirme amaçlıdır; bağlayıcı hukuki görüş değildir. Güncellemeler bu sayfada yayımlanır.",
  },
  not_found: {
    seo: {
      title: "Sayfa bulunamadı",
      description: "Aradığınız sayfa bulunamadı.",
    },
    code: "404",
    title: "Sayfa bulunamadı",
    lead: "Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilir veya iletişim sayfasına gidebilirsiniz.",
    buttons: [
      { href: "/", label: "Ana sayfa" },
      { href: "/blog", label: "Yazılar" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
};

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentKey[];

export function isContentKey(value: string): value is ContentKey {
  return (CONTENT_KEYS as string[]).includes(value);
}
