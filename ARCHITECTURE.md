# ARCHITECTURE.md — sagirhukuk

## Amaç ve kapsam
Av. Eda Öykü Sağır, Sağır Hukuk & Danışmanlık bürosunun kurumsal web sitesi.
Asıl domain: **www.sagirhukuk.net**.

Şu anki kapsam (minimal iskelet):
- Ana sayfa (tanıtım + çalışma alanları özeti)
- Blog / yayınlar (bilgilendirme yazıları)
- İletişim sayfası + form
- KVKK aydınlatma metni
- SEO omurgası (sitemap, schema, robots)

Sonraki fazlarda eklenebilir: Hizmetler (detay sayfaları). Hakkımızda: `/hakkimizda` (CMS anahtarı `about`).

## Teknoloji kararları
| Katman | Seçim | Gerekçe |
|---|---|---|
| Framework | Astro 5, SSR (node standalone) | Tam HTML servis → SEO. |
| İnteraktif | React island (@astrojs/react) | Yalnızca iletişim formu. |
| Stil | Tailwind v4 (@tailwindcss/vite) | Token tabanlı; global.css @theme. |
| Veritabanı | PostgreSQL (pg) | İletişim formları kalıcı. |
| Backend | Astro API routes | Tek servis, tek deploy. |
| Mail | nodemailer (opsiyonel) | Form bildirimi; SMTP yoksa DB kaydı yine olur. |
| Hosting | Render (web servisi) | render.yaml blueprint. |
| Postgres (prod) | `mepackage-db` (paylaşımlı) | Render free tier 1 DB limiti; me-package `mepackage`, sagirhukuk `sagirhukuk` database adı. |

## Tasarım sistemi
Kurumsal avukatlık teması (ONAYLI iskelet evrimi):
- Zemin: sıcak kağıt tonu (`--bg`, `--bg-2`); panel: lacivert (`--panel` #0f2438).
- Vurgu: altın/bronz (`--green` token alias); botanik motif yok, adalet terazisi mührü.
- Tipografi: Cormorant Garamond (başlık), Inter (gövde). Monospace yok.

## İletişim sabitleri (site.ts)
- Marka: Sağır Hukuk & Danışmanlık
- Avukat: Av. Eda Öykü Sağır
- Adres: İsmet Kaptan Mah. Gazi Bulvarı No:83 D:801 K:8 Hasan Bozkurt İş Hanı, Konak/İzmir
- Telefon: 0541 805 55 77
- E-posta: av.edasagir@sagirhukuk.net
- Çalışma saatleri: Pazartesi–Cuma, 09:00–18:30

## Veri modeli (db/schema.sql)
Aktif kullanım: `contact_messages` (iletişim formu).
Eski me-package tabloları şemada durabilir; yeni fazlarda sadeleştirilebilir.

## Dizin yapısı
```
src/
  layouts/BaseLayout.astro
  components/Header.astro, Footer.astro, ContactForm.tsx, ui/*
  pages/
    index.astro, iletisim.astro, kvkk.astro, 404.astro
    blog/index.astro, blog/[slug].astro
    api/iletisim.ts, api/health.ts
    sitemap.xml.ts
  lib/site.ts, db.ts, mail.ts, validate.ts, kvkk.ts, rate-limit.ts, blog.ts, blog-data.ts, render-markdown.ts
  styles/global.css
db/schema.sql
render.yaml
```

## Faz yol haritası
- **Faz 0** — Minimal iskelet: domain geçişi, PPWR içerik temizliği, iletişim formu. ✅
- **Faz 1** — Blog / yayınlar (statik içerik + DB yedek). ✅
- **Faz 2** — Hakkımızda + Hizmetler sayfaları
- **Faz 3** — Deploy + domain bağlama
