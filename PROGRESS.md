# PROGRESS.md — sagirhukuk

> KURAL: Bu dosyanın üzerine ASLA yazılmaz. Her faz sonunda EN ALTA yeni giriş eklenir.

---

## Faz 0 — İskelet (tamamlandı)

**Ne yapıldı**
- Astro 5 SSR (node standalone) + @astrojs/react + Tailwind v4 iskeleti kuruldu.
- Tasarım token sistemi (global.css): petrol laciverti / teal / amber, Space Grotesk
  + Inter + IBM Plex Mono, `.data-chip` imza öğesi.
- SEO omurgası: BaseLayout.astro (title/description/canonical/OG/Twitter/JSON-LD org,
  lang=tr, noindex opsiyonu). robots.txt + favicon.svg.
- Veritabanı: db/schema.sql (analyses seed'li, analysis_applications,
  consultancy_applications, contact_messages, blog_posts, admin_users). db.ts pool helper.
- Form backend deseni: doğrula → DB → notify() → JSON.
  - POST /api/basvuru-analiz
  - POST /api/basvuru-danismanlik
  - POST /api/iletisim
  - GET  /api/health (DB kontrol)
- Ops: .env.example, render.yaml (web + managed Postgres), .gitignore, db-init.mjs.
- Süreklilik: .cursorrules + ARCHITECTURE.md + bu PROGRESS.md.
- Placeholder ana sayfa (Faz 1'de gerçek hero ile değişecek), Header, Footer.

**Dosyalar**
package.json, astro.config.mjs, tsconfig.json, render.yaml, .env.example, .gitignore,
.cursorrules, ARCHITECTURE.md, PROGRESS.md,
src/styles/global.css, src/layouts/BaseLayout.astro,
src/components/{Header,Footer}.astro, src/pages/index.astro,
src/pages/api/{basvuru-analiz,basvuru-danismanlik,iletisim,health}.ts,
src/lib/{db,mail,validate}.ts, db/schema.sql, scripts/db-init.mjs,
public/{robots.txt,favicon.svg}

**Bilinen eksikler / sonraki faza devir**
- Gerçek hero yok (placeholder). → Faz 1.
- sitemap.xml dinamik route'u yok. → Faz 1.
- Analiz/danışmanlık/iletişim SAYFALARI (form island'lar) yok, sadece API var. → Faz 2–3.
- Blog liste/detay ve admin panel yok. → Faz 4.
- og-default.png henüz üretilmedi (BaseLayout referans veriyor).
- Rate-limit / spam koruması (honeypot) formlara eklenecek. → Faz 2.

**Not**
- Regülasyon sabitleri readme + ARCHITECTURE ile birebir. Değiştirilmeyecek.

---

## Faz 1 — Ana sayfa + SEO temeli (tamamlandı)

**Ne yapıldı**
- Placeholder ana sayfa gerçek hero ve dönüşüm akışıyla değiştirildi.
- Bileşenler: Hero, ThresholdStrip (.data-chip imza), WhyNow (ana uygulama
  geri sayımı), PathCards, AnalysisPreview (DB + statik yedek), Differentiator,
  Faq, Cta.
- SEO: benzersiz title/description/keywords, FAQPage + Service JSON-LD
  (FAQ metni schema ile tek kaynaktan: faq-data.ts).
- Dinamik sitemap: GET /sitemap.xml (5 statik rota, Faz 4 blog yorumu hazır).
- FAQ ve regülasyon eşikleri ARCHITECTURE sabitleriyle uyumlu.

**Dosyalar**
src/components/{Hero,ThresholdStrip,WhyNow,PathCards,AnalysisPreview,Differentiator,Faq,Cta}.astro,
src/pages/index.astro, src/pages/sitemap.xml.ts,
src/lib/{faq-data,analyses}.ts

**Bilinen eksikler / sonraki faza devir**
- /danismanlik, /analizler, /blog, /iletisim sayfaları henüz yok (404 normal). → Faz 2–3.
- og-default.png henüz üretilmedi.
- Rate-limit / honeypot formlara eklenecek. → Faz 2.

---

## Faz 2 — Analiz kataloğu + başvuru formu (tamamlandı)

**Ne yapıldı**
- `/analizler` SSR katalog sayfası: DB'den tüm aktif analizler (sort_order),
  DB kapalıyken statik yedek liste.
- `AnalysisCard`: slug anchor derin link, threshold data-chip, başvuru linki
  (`?analiz=<slug>#basvuru`).
- `AnalysisForm` React island (`client:visible`): controlled form, URL'den analiz
  seçimi, client + sunucu honeypot, çift gönderim engeli, erişilebilir label'lar.
- ItemList JSON-LD (gerçek katalog başlık/açıklama).
- `ppwr-gap` kartı hafif teal vurgu (gradyan yok).

**Dosyalar**
src/pages/analizler.astro, src/components/{AnalysisCard.astro,AnalysisForm.tsx},
src/lib/analyses.ts (genişletildi), src/pages/api/basvuru-analiz.ts (honeypot)

**Bilinen eksikler / sonraki faza devir**
- /danismanlik, /blog, /iletisim sayfaları henüz yok. → Faz 3.
- og-default.png henüz üretilmedi.
- Rate-limit (honeypot tamam, rate-limit Faz 3'e kalabilir).

---

## Faz 3 — Danışmanlık + iletişim sayfaları + ortak form (tamamlandı)

**Ne yapıldı**
- Ortak form altyapısı: `useFormSubmit` hook, `FormStatus`, `HoneypotField`,
  `validateClient`, `formStyles`. AnalysisForm refactor edildi.
- `/danismanlik`: konu listesi, süreç adımları, konumlandırma notu, ConsultancyForm,
  Service JSON-LD, advisory disclaimer.
- `/iletisim`: site.ts sabitleri (boş e-posta/telefon gösterilmez), ContactForm.
- `/blog`: minimal stub (header/footer 404 engeli, Faz 4'te DB blog gelecek).
- Üç API endpoint'inde honeypot (website alanı).

**Dosyalar**
src/pages/{danismanlik,iletisim,blog}.astro,
src/components/{ConsultancyForm,ContactForm}.tsx,
src/components/form/{useFormSubmit,FormStatus,HoneypotField,formStyles,validateClient}.ts(x),
src/lib/{site,consultancy-schema}.ts,
src/pages/api/{basvuru-danismanlik,iletisim}.ts (honeypot)

**Bilinen eksikler / sonraki faza devir**
- site.ts e-posta/telefon boş (Alperen dolduracak).
- Blog içerik/admin panel yok. → Faz 4.
- og-default.png henüz üretilmedi.
- Rate-limit henüz yok.

---

## Faz 4a — Public blog (tamamlandı)

**Ne yapıldı**
- `/blog` liste (`blog/index.astro`) ve `/blog/[slug]` detay (SSR, DB-driven).
- `marked` ile Markdown render, token tabanlı `.prose` stili.
- PostCard, BlogPosting JSON-LD, boş durum metni (davet niteliğinde).
- `404.astro` + NotFoundContent; taslak/olmayan slug 404.
- sitemap.xml yayınlanmış yazıları içeriyor; opsiyonel `rss.xml.ts` eklendi.
- Faz 3 `blog.astro` stub kaldırıldı.

**Dosyalar**
src/lib/blog.ts, src/styles/prose.css, src/components/blog/PostCard.astro,
src/components/NotFoundContent.astro, src/pages/blog/{index,[slug]}.astro,
src/pages/404.astro, src/pages/rss.xml.ts, src/pages/sitemap.xml.ts (güncellendi)

---

## Faz 4b — Admin paneli (tamamlandı)

**Ne yapıldı**
- Oturum: scrypt parola hash, HMAC-imzalı cookie, middleware ile `/admin` koruması.
- Admin: özet, blog CRUD (liste/yeni/düzenle/sil), başvuru görüntüleme ve durum güncelleme.
- API: `/api/admin/{login,logout,blog,status}`; Origin kontrolü, login rate-limit.
- `scripts/admin-create.mjs` + `npm run admin:create`.
- AdminLayout noindex, public header/footer yok.

**Dosyalar**
src/lib/{auth,admin,slugify}.ts, src/middleware.ts, src/layouts/AdminLayout.astro,
src/pages/admin/**, src/pages/api/admin/**, src/components/admin/AdminBlogForm.astro,
scripts/admin-create.mjs, .env.example (ADMIN notları)

**Bilinen eksikler / sonraki faza devir**
- site.ts e-posta/telefon boş (Alperen dolduracak).
- og-default.png henüz üretilmedi.
- Rate-limit yalnızca login'de; genel API rate-limit yok.
- Canlı deploy + domain: Faz 5.

---

## Faz 3.5 — Tasarım revizyonu (tamamlandı)

**Ne yapıldı**
- Yeniden kullanılabilir UI primitifleri: PageHero, Section, Eyebrow, Card, ProcessSteps,
  DeadlinePanel, CtaBand, DarkDifferentiator, Container, ButtonLink.
- `/danismanlik` referans düzenine getirildi: iki kolonlu hero + deadline paneli, 2x2 kart
  grid (PPWR data-chip'li), görsel süreç adımları, dark farklılaştırıcı, CtaBand, form grid.
- Ana sayfa, `/analizler`, `/iletisim` aynı bileşenlerle yükseltildi; max-w-6xl konteyner,
  kart hover, sticky header.
- Metin/copy korundu; yalnızca düzen ve görsel hiyerarşi değişti.

**Dosyalar**
src/components/ui/*, src/lib/deadline.ts, src/styles/global.css (ui-card, process-steps),
src/pages/{danismanlik,analizler,iletisim}.astro, src/components/{Hero,ThresholdStrip,
WhyNow,PathCards,AnalysisPreview,Differentiator,Cta,Faq,AnalysisCard,Header,Footer}.astro

---

## Tasarım yönü: dieline (tamamlandı)

**Ne yapıldı**
- Palet ve token güncellendi: soğuk kağıt (`--surface`, `--surface-2`), `--blue-line`,
  keskin köşe yarıçapı (2–4px), cream/terracotta yok.
- Mono (IBM Plex Mono) yükseltildi: eyebrow `INDEKS  ETİKET` deseni, spec-chip ve data-chip
  köşesiz kenarlıklı; ölçü/eşik/tarih mono.
- Yeniden kullanılabilir motif bileşenleri: DielineBlueprint, RegistrationMark, RulerDivider,
  FluteTexture, ResinTriangle, DielineSquare, HeroBackdrop.
- Ana sayfa: dieline hero arka planı, registration köşeleri, cetvel ayraçları, instrument
  readout deadline paneli, spec-strip eşik bandı, flute'lu koyu farklılaştırıcı, koyu footer.
- `/danismanlik`, `/analizler`, `/iletisim` aynı görsel dile taşındı (hero backdrop, ruler,
  spec chip'ler, keskin kartlar).
- Metin/copy değiştirilmedi; yalnızca görsel kimlik, doku, tipografi rolleri.

**Dosyalar**
src/styles/global.css, src/components/ui/motifs/*, src/components/ui/{PageHero,DeadlinePanel,
Eyebrow,Section,Card,ProcessSteps,CtaBand,DarkDifferentiator,HeroBackdrop}.astro,
src/components/{Header,Footer,ThresholdStrip,WhyNow,PathCards,Faq}.astro,
src/pages/{danismanlik,analizler,iletisim}.astro

**Doğrulama**
- `npm run build` hatasız
- `grep -rn "—" src/` temiz (görünen metin)

---

## Onaylı tasarım uygulandı (tamamlandı)

**Ne yapıldı**
- Kilitli palet (.cursorrules 5a): mavi zemin (`--bg`, `--bg-2`), yeşil vurgu (`--green`,
  `--leaf`, `--wash`), koyu panel (`--panel` #123c3e). IBM Plex Mono tamamen kaldırıldı.
- Yeniden kullanılabilir bileşenler: Eyebrow, Chip, ButtonLink, CountdownPanel (metin solda,
  SproutBox sağda), Section, botanik SVG'ler (HeroBotanic, SingleLeaf, LeafPattern,
  RecycleLoop, BrandLeaf, SproutBox, Botanic).
- Ana sayfa ONAYLI-TASARIM.html ile eşlendi: hero botanik + yeşil ışıma, countdown paneli,
  eşik değerleri soft band, koyu farklılaştırıcı band, panel footer.
- `/danismanlik`, `/analizler`, `/iletisim`, `/blog` aynı dile taşındı; form island
  mantığı korundu. Dieline/mono motifleri silindi.

**Dosyalar**
src/styles/{global,prose}.css, src/components/ui/{PageHero,CountdownPanel,Chip,Section,
Card,Eyebrow,ButtonLink,DarkDifferentiator,Botanic,botanic/*,Container}.astro,
src/components/{Header,Footer,Hero,ThresholdStrip,WhyNow,PathCards,Faq,AnalysisPreview}.astro,
src/pages/{danismanlik,analizler,iletisim,blog/**}.astro, src/layouts/BaseLayout.astro

**Doğrulama**
- `npm run build` hatasız
- `grep -rni "plex mono|monospace|IBM Plex" src/` boş
- Görünen metinde em dash yok

---

## React form jsxDEV hatası düzeltildi (tamamlandı)

**Sorun**
- `/analizler` ve diğer form sayfalarında `Uncaught TypeError: jsxDEV is not a function`
- Vite, `react/jsx-dev-runtime` modülünü production stub ile önbelleğe almıştı (`jsxDEV = void 0`)

**Çözüm**
- `scripts/dev.mjs`: dev başlamadan `NODE_ENV=development` zorlanır
- `astro.config.mjs`: `vite.resolve.dedupe` ve `optimizeDeps.include` (react jsx runtime)
- `node_modules/.vite` önbelleği temizlendi

**Doğrulama**
- `npm run build` hatasız
- Yeniden oluşturulan `.vite/deps/react_jsx-dev-runtime.js` içinde `exports.jsxDEV` fonksiyon

---

## Yerel form DB hatası düzeltildi (tamamlandı)

**Sorun**
- Analiz formu: "Kayıt sırasında bir sorun oluştu" (500)
- Yerel Postgres SSL desteklemez; dev sunucusu `DATABASE_SSL=false` okumadan SSL ile bağlanıyordu

**Çözüm**
- `scripts/dev.mjs`: `.env` yüklemesi (`loadEnv`) eklendi
- `src/lib/db.ts`: `localhost` / `127.0.0.1` için otomatik SSL kapalı

**Doğrulama**
- `POST /api/basvuru-analiz` → 200, kayıt `analysis_applications` tablosunda

---

## Admin: blog sil/düzenle + başvuru CRM (tamamlandı)

**Blog**
- Liste: Düzenle, Sitede gör (yayında), Sil
- Düzenle sayfası: yayınlanmış yazılar düzenlenebilir; Sil butonu mevcut

**Başvuru CRM** (`/admin/basvurular`)
- Durumlar: Yeni, İletişime geçildi, Fiyat verildi, Fiyat kabul edildi, Numune teslim alındı,
  Ödeme alındı, Numune navlungoda, Numune FCC'de, Sonuç çıktı, Kapatıldı
- Dropdown ile durum güncelleme + süreç chip'leri (analiz, danışmanlık, iletişim)

**Dosyalar**
src/lib/application-status.ts, src/components/admin/AdminApplicationCard.astro,
src/pages/admin/{basvurular,blog/index}.astro, src/pages/api/admin/status.ts

**Doğrulama**
- `npm run build` hatasız

---

## KVKK uyumu (tamamlandı)

**Yapılanlar**
- `/kvkk` aydınlatma metni (veri sorumlusu, amaç, hukuki sebep, saklama, haklar)
- Tüm formlarda zorunlu KVKK onay checkbox'ı (istemci + sunucu doğrulama)
- DB: `consent_at`, `retention_until`, `deleted_at`; `admin_audit_log` tablosu
- Admin: başvuru anonimleştirme, durum değişikliği ve blog silme audit log
- `npm run purge:retention`: saklama süresi dolan kayıtları anonimleştirir
- Footer + sitemap `/kvkk` linki

**Komutlar**
- `npm run db:migrate-kvkk` (mevcut DB)
- `npm run purge:retention` (cron önerilir)

**Env**
- `KVKK_CONTACT_EMAIL`, `DATA_RETENTION_MONTHS` (varsayılan 24 ay)

**Doğrulama**
- `npm run build` hatasız
- Görünen metinde em dash yok

---

## Faz 5 Kol A: Deploy öncesi güvenlik + SEO + prod (tamamlandı)

### Güvenlik denetimi (yönetim rotaları)

| Rota | Auth | Origin | Metot | Durum |
|------|------|--------|-------|-------|
| `/admin/*` (login hariç) | middleware redirect | n/a | GET | OK |
| `POST /api/admin/login` | public | n/a | POST | OK + rate limit |
| `POST /api/admin/logout` | public | assertSameOrigin | POST | OK (düzeltildi) |
| `POST/PUT/DELETE /api/admin/blog` | middleware 401 | assertSameOrigin | POST/PUT/DELETE | OK + audit |
| `POST /api/admin/status` | middleware 401 | assertSameOrigin | POST | OK + audit |
| `POST /api/admin/application` | middleware 401 | assertSameOrigin | POST | OK + audit |

- Oturumsuz `/api/admin/*` (login/logout hariç) → 401
- Public API'ler yalnızca published blog / form kaydı; taslak/CRM sızdırmıyor
- Blog markdown: DOMPurify sanitize (stored XSS kapatıldı)
- Form API: IP rate limit (10/saat)
- Login parola max 128 karakter
- Kapak görseli yalnızca http/https URL

### Prod sağlamlaştırma
- `middleware.ts`: X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS (prod)
- CSP bilinçli eklenmedi (inline script/style kırılmasın)

### SEO
- Public sayfalar: benzersiz title/description/canonical
- sitemap: tüm public rotalar + yayınlanmış blog
- robots.txt: /admin, /api disallow
- BaseLayout: `GSC_VERIFICATION` env
- og:image mutlak URL

### Env (.env.example + render.yaml)
DATABASE_URL, DATABASE_SSL, SESSION_SECRET, ADMIN_*, SMTP_*, NOTIFY_TO, KVKK_*, DATA_RETENTION_MONTHS, GSC_VERIFICATION, SMTP_PORT

### Doğrulama
- `npm run build` hatasız
- Prod smoke: public 200, admin redirect, API 401, güvenlik header'ları OK
- grep temiz (em dash yalnız CSS yorumu)

### Kol B notu
- `public/og-default.png` repoda yok; deploy öncesi eklenmeli
---

## Faz 5 Kol A: Deploy öncesi güvenlik + SEO + prod (tamamlandı)

### Güvenlik denetimi (yönetim rotaları)

| Rota | Auth | Origin | Metot | Durum |
|------|------|--------|-------|-------|
| `/admin/*` (login hariç) | middleware redirect | n/a | GET | OK |
| `POST /api/admin/login` | public | n/a | POST | OK + rate limit |
| `POST /api/admin/logout` | public | assertSameOrigin | POST | OK (düzeltildi) |
| `POST/PUT/DELETE /api/admin/blog` | middleware 401 | assertSameOrigin | POST/PUT/DELETE | OK + audit |
| `POST /api/admin/status` | middleware 401 | assertSameOrigin | POST | OK + audit |
| `POST /api/admin/application` | middleware 401 | assertSameOrigin | POST | OK + audit |

- Oturumsuz `/api/admin/*` (login/logout hariç) → 401
- Public API'ler yalnızca published blog / form kaydı; taslak/CRM sızdırmıyor
- Blog markdown: DOMPurify sanitize (stored XSS kapatıldı)
- Form API: IP rate limit (10/saat)
- Login parola max 128 karakter
- Kapak görseli yalnızca http/https URL

### Prod sağlamlaştırma
- `middleware.ts`: X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS (prod)
- CSP bilinçli eklenmedi (inline script/style kırılmasın)

### SEO
- Public sayfalar: benzersiz title/description/canonical
- sitemap: tüm public rotalar + yayınlanmış blog
- robots.txt: /admin, /api disallow
- BaseLayout: `GSC_VERIFICATION` env
- og:image mutlak URL

### Env (.env.example + render.yaml)
DATABASE_URL, DATABASE_SSL, SESSION_SECRET, ADMIN_*, SMTP_*, NOTIFY_TO, KVKK_*, DATA_RETENTION_MONTHS, GSC_VERIFICATION, SMTP_PORT

### Doğrulama
- `npm run build` hatasız
- Prod smoke: public 200, admin redirect, API 401, güvenlik header'ları OK
- grep temiz (em dash yalnız CSS yorumu)

### Kol B notu
- `public/og-default.png` repoda yok; deploy öncesi eklenmeli

---

## Domain me-package.com + Spacemail SMTP (tamamlandı)

**Domain**
- Canonical `https://www.me-package.com` (`src/lib/site.ts` merkezi `SITE_URL`)
- Eski tiresiz alan adı kodda kalmadı; marka adı `mepackage` aynı

**İletişim**
- `site.ts` email: `info@me-package.com` (iletişim sayfasında görünür)

**SMTP (.env.example, Spacemail)**
- `mail.spacemail.com:465`, user `info@me-package.com`, NOTIFY_TO `lab@me-package.com`
- `mail.ts`: port 465 için `secure: true`

**Doğrulama**
- Eski domain grep temiz (src, config, docs)
- `npm run build` hatasız

---

## Faz 0 — sagirhukuk.net geçişi (minimal iskelet, tamamlandı)

**Ne yapıldı**
- me-package.com PPWR içeriği kaldırıldı: analizler, danışmanlık, blog, admin paneli ve ilgili API/bileşenler.
- Domain ve marka `sagirhukuk.net` / Sağır Hukuk & Danışmanlık olarak güncellendi (`site.ts`, BaseLayout schema, robots, sitemap).
- Minimal public yapı: ana sayfa (hero + çalışma alanları + CTA), iletişim formu, KVKK, 404.
- Header/Footer sadeleştirildi; metin logo (BrandLeaf) kullanıldı.
- Admin middleware kaldırıldı; güvenlik header'ları korundu.

**Dosyalar**
src/lib/site.ts, src/pages/{index,iletisim,kvkk}.astro, src/layouts/BaseLayout.astro,
src/components/{Header,Footer,NotFoundContent}.astro, src/components/ui/{Logo,PageHero}.astro,
src/middleware.ts, astro.config.mjs, package.json, render.yaml, .env.example, ARCHITECTURE.md

**Bilinen eksikler / sonraki faza devir**
- Hakkımızda, Hizmetler sayfaları yok.
- og-default.png repoda yok.
- DB şeması eski me-package tablolarını içeriyor (contact_messages aktif).

**Doğrulama**
- `npm run build` (faz sonunda)
- Görünen metinde em dash yok

---

## Faz 1 — Blog / yayınlar (tamamlandı)

**Ne yapıldı**
- `/blog` liste ve `/blog/[slug]` detay sayfaları eklendi (SSR).
- 6 bilgilendirme yazısı: anlaşmalı boşanma, çekişmeli boşanma, ceza savunma hakları,
  limited şirket kuruluşu, idari dava süresi, saklı pay (`blog-data.ts`).
- DB varsa `blog_posts` okunur; yoksa statik yedek. Markdown + DOMPurify render.
- BlogPosting JSON-LD, sitemap blog rotaları, ana sayfada son 3 yazı.
- Header/Footer menüsüne "Yazılar" eklendi.

**Dosyalar**
src/lib/{blog,blog-data,render-markdown}.ts, src/components/blog/PostCard.astro,
src/pages/blog/{index,[slug]}.astro, src/pages/{index,sitemap.xml}.ts (güncellendi),
src/components/{Header,Footer,NotFoundContent}.astro

**Doğrulama**
- `npm run build` hatasız
- Görünen metinde em dash yok

---

## Admin paneli geri yüklendi (tamamlandı)

**Neden kaldırılmıştı:** sagirhukuk.net geçişinde "içeriği sil, çok kısıtlı iskelet" talimatıyla blog/admin birlikte temizlenmişti.

**Ne yapıldı**
- `/admin` oturum, blog CRUD, iletişim mesajları CRM geri eklendi.
- PPWR analiz/danışmanlık başvuru ekranları kaldırıldı; yalnızca `contact_messages` + `blog_posts`.
- Durum pipeline: Yeni, İletişime geçildi, Randevu verildi, Dosya takibi, Kapatıldı.

**Komut:** `npm run admin:create` (SESSION_SECRET + DATABASE_URL gerekli)

---

## Hukuk sitesi tasarım uyarlaması (tamamlandı)

**Ne yapıldı**
- ONAYLI iskelet korundu; palet avukatlık temasına çekildi: lacivert panel, altın vurgu, sıcak kağıt zemin.
- Botanik motifler kaldırıldı; LawSeal (terazi mührü), HeroTrustPanel, grid desenli hero.
- Tipografi: Cormorant Garamond başlık + Inter gövde.
- Ana sayfa: güven paneli, yaklaşım bandı, numaralı çalışma alanı kartları, koyu CTA bandı.
- Header/footer kurumsal düzen; iletişim sayfasında trust paneli.

**Doğrulama**
- `npm run build` hatasız

---

## Site içeriği CMS (tamamlandı)

**Ne yapıldı**
- `site_content` tablosu (JSONB): admin panelden düzenlenebilir metinler.
- `/admin/icerik` listesi ve `/admin/icerik/[key]` düzenleme formları.
- `PUT /api/admin/content` kayıt + audit log.
- Anahtarlar: `global`, `home`, `contact`, `blog_page`, `kvkk`, `not_found`.
- Public sayfalar `getContent()` / `getSite()` ile DB + varsayılan birleşimi kullanır.
- Blog yazıları mevcut `/admin/blog` CRUD ile kalır.

**Komutlar**
- Yeni DB: `npm run db:init`
- Mevcut DB: `npm run db:migrate-content`

**Dosyalar**
src/lib/{content,content-defaults}.ts, src/pages/admin/icerik/, src/pages/api/admin/content.ts,
**Doğrulama**
- `npm run build` hatasız
- Görünen metinde em dash yok

---

## Blog paneli: içe aktarma ve biçimlendirme (tamamlandı)

**Ne yapıldı**
- 6 statik blog yazısı DB'ye aktarıldı (`npm run db:seed-blog` veya admin panelde «Statik yazıları içe aktar»).
- Blog ve KVKK düzenleyicisine font (Inter / Cormorant), punto (14–24 pt) ve renk araç çubuğu eklendi.
- Seçili metne `<span style="...">` ile biçim uygulanır; sitede güvenli şekilde render edilir.

**Doğrulama**
- `npm run build` hatasız

---

## Render: paylaşımlı PostgreSQL (mepackage-db + sagirhukuk DB)

**Neden:** Render ücretsiz planda hesap başına yalnızca 1 Postgres; iki site de canlı kalacak.

**Karar**
- `render.yaml` artık `sagirhukuk-db` oluşturmaz.
- me-package: `mepackage-db` / database `mepackage`
- sagirhukuk: aynı sunucu / database `sagirhukuk`, `DATABASE_URL` Environment'ta elle (`.../sagirhukuk`)

**Adımlar:** DEPLOY.md §2 (`CREATE DATABASE sagirhukuk` + URL sonu `/sagirhukuk`)

---

## Faz: Hakkımızda sayfası ve menü (Yayınlar)

**Tarih:** 2026-07-05

**Yapılanlar**
- Header menüsü: "Yazılar" → "Yayınlar", yeni "Hakkımızda" (`/hakkimizda`)
- `src/pages/hakkimizda.astro`, CMS anahtarı `about`, admin form bloğu
- `content-defaults.ts`: about içeriği, blog/not_found SEO ve buton metinleri
- `sitemap.xml.ts`: `/hakkimizda`
- `scripts/patch-global-nav.mjs` + `npm run db:patch-nav` (canlı DB menüsü onarımı)

**Canlıda menü güncellemesi:** Railway Shell'de bir kez `npm run db:patch-nav`

**Doğrulama:** `npm run build` hatasız

---

## Faz: Admin paneli kullanılabilirlik

**Tarih:** 2026-07-05

**Yapılanlar**
- Menü etiketleri: İçerik → Sayfa metinleri, Blog → Yayınlar
- İçerik listesi gruplandı (tüm site / sayfalar / yasal / sistem)
- Düzenleme sayfasında sol bölüm menüsü (sayfa içi atlama)
- Her form bölümünde "Sitede: ..." konum açıklaması
- Teknik etiketler sadeleştirildi (Hero, Eyebrow, SEO → Türkçe)
- Özet sayfasında açıklamalı kısayol kartları
- `src/lib/admin-content-ui.ts`, `AdminSection.astro`, `AdminContentSidebar.astro`

**Doğrulama:** `npm run build` hatasız

---

## Faz: Hukuki arka plan figürleri

**Tarih:** 2026-07-05

**Yapılanlar**
- `src/components/ui/law/`: terazi, sütun, çekiç, kitap, defne, `LawBackground.astro`
- Hero, Section, CtaBand, Footer ve sayfa zemininde dekoratif figürler
- Koyu bölümlerde altın ton, açık zeminlerde lacivert çizgi; metin okunabilirliği korunur

**Doğrulama:** `npm run build` hatasız

---

## Faz: Arka plan figürleri geri alındı

**Tarih:** 2026-07-05

**Neden:** Parşömen çerçeve ve dekoratif figürler istenen estetikte olmadı.

**Yapılanlar**
- Layout ve stiller `8de93f4` öncesi sade haline döndürüldü
- `LawBackground`, parşömen çerçeve ve ek figür bileşenleri kaldırıldı
- Logo mührü (`LawSeal`) korundu

**Doğrulama:** `npm run build` hatasız

---

## Faz: Yan gutter hukuki dekor (v2)

**Tarih:** 2026-07-05

**Yapılanlar**
- `LawDecorLayer`: 3 kolon, 3 terazi, 3 tokmak, 3 kalem; yan gutter'da sabit konum
- İçerik alanı (1360px) dışında; tek opaklık, z-index dekor 1 / içerik 2
- Logo mührü değiştirilmedi; 1280px altında dekor gizli

**Doğrulama:** `npm run build` hatasız

