# ARCHITECTURE.md — mepackage

## Amaç ve kapsam
Marine Emission'ın PPWR alt markası. Tek işi: Türkçe PPWR aramalarında organik
görünmek ve iki tür başvuru toplamak — **danışmanlık** ve **analiz**. Yanında SEO
motoru olarak bir **blog** ve tam bir **iletişim/DB** altyapısı.

Asıl domain: **www.me-package.com** (Marine Emission Package).
Not: Domainde "ppwr" keyword'ü yok → on-page SEO (title/meta/schema/içerik) ağır çalışır.

## Teknoloji kararları
| Katman | Seçim | Gerekçe |
|---|---|---|
| Framework | Astro 5, SSR (node standalone) | Tam HTML servis → SEO. SPA'nın client-render dezavantajı yok. |
| İnteraktif | React island (@astrojs/react) | Sadece formlar. Statik içerik .astro. |
| Stil | Tailwind v4 (@tailwindcss/vite) | Token tabanlı; global.css @theme. |
| Veritabanı | PostgreSQL (pg) | Render ephemeral → sql.js başvuruları uçurur. Kalıcı DB şart. |
| Backend | Astro API routes | Ayrı Express yok → Render'da tek servis, tek deploy. |
| Mail | nodemailer (opsiyonel) | Başvuru bildirimi; SMTP yoksa sessiz geçer, DB kaydı yine olur. |
| Hosting | Render (web + managed Postgres) | render.yaml blueprint. |

## Tasarım sistemi
- Renk: petrol laciverti (ink #0a2027), brand teal (#12a294), deadline amber (#e07a2f).
- Tipografi: Space Grotesk (display), Inter (gövde), IBM Plex Mono (veri/eşik değerleri).
- İmza öğesi: regülasyon eşiklerinin mono "veri çipi" olarak gösterimi (.data-chip).
- Kliseden kaçış: cream+terracotta yok, acid-green-on-black yok.

## Regülasyon sabitleri (BİREBİR korunacak)
- PPWR (EU) 2025/40: yürürlük 11 Şub 2025, ana uygulama 12 Ağu 2026.
- PFAS: bireysel non-polimerik ≤25 ppb, toplam ≤250 ppb, toplam flor ≤50 mg/kg
  (>50 → otomatik FAIL değil, farklılaştırma tetikler).
- Ağır metal toplamı (Pb+Cd+Hg+Cr(VI)) ≤100 mg/kg.
- Minimizasyon eşiği: %50 (e-ticaret %40) — %30 DEĞİL.
- Yeniden kullanım hedefleri: %40/%70 genel nakliye, AB içi %100; boş alan %50 tavanı (Oca 2030).
- DoC saklama: 5/10 yıl. Almanya EPR sistemi: LUCID.
- CSRD = ambalaj-dilimi export filtresi (ayrı modül değil). PPWR×CSRD = farklılaştırıcı.
- EPR = yalnızca temiz veri ihracı, portal API entegrasyonu YOK.
- Advisory modüller her zaman disclaimer taşır.

## Veri modeli (db/schema.sql)
- `analyses` — analiz kataloğu (seed'li).
- `analysis_applications` — analiz başvuruları.
- `consultancy_applications` — danışmanlık başvuruları.
- `contact_messages` — iletişim.
- `blog_posts` — DB-driven blog (admin CRUD).
- `admin_users` — panel erişimi (hash'li parola).
- `admin_audit_log` — admin işlem izi (KVKK).
- Başvuru tablolarında `consent_at`, `retention_until`, `deleted_at` (KVKK).

## Dizin yapısı
```
src/
  layouts/BaseLayout.astro     # SEO omurgası (meta, OG, JSON-LD)
  components/                  # Header, Footer, (Faz'larda büyüyecek)
  pages/
    index.astro                # ana sayfa
    api/                       # basvuru-analiz, basvuru-danismanlik, iletisim, health
  lib/                         # db, mail, validate
  styles/global.css            # token sistemi
db/schema.sql                  # PostgreSQL şema + seed
scripts/db-init.mjs            # şema uygula
render.yaml                    # Render blueprint
```

## Faz yol haritası
- **Faz 0** — İskelet: Astro SSR + React + Tailwind + DB şema + form API + Render config. ✅
- **Faz 1** — Ana sayfa (gerçek hero) + SEO temeli (sitemap, schema, TR keyword yapısı).
- **Faz 2** — Analiz kataloğu sayfası + başvuru formu (island).
- **Faz 3** — Danışmanlık sayfası + iletişim sayfası + formlar.
- **Faz 4** — Blog (liste + detay, SSR) + admin panel (auth + blog CRUD + başvuru görüntüleme).
- **Faz 5 Kol A** — Deploy öncesi güvenlik denetimi, SEO, prod header'ları. ✅ (Kol B: deploy elle)
