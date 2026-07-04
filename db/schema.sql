-- Marine Emission Package — PostgreSQL şeması
-- Render PostgreSQL üzerinde çalışır. sql.js DEĞİL: başvurular kalıcı olmalı.
-- Çalıştır: psql "$DATABASE_URL" -f db/schema.sql   (veya npm run db:init)

-- =========================================================
-- Analiz kataloğu (başvuru alınacak analiz türleri)
-- =========================================================
CREATE TABLE IF NOT EXISTS analyses (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL,          -- kısa açıklama (katalog kartı)
  threshold    TEXT,                   -- eşik değeri metni, örn "PFAS ≤25 ppb / ≤250 ppb"
  category     TEXT NOT NULL DEFAULT 'ppwr',
  sort_order   INTEGER NOT NULL DEFAULT 100,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- Analiz başvuruları
-- =========================================================
CREATE TABLE IF NOT EXISTS analysis_applications (
  id            SERIAL PRIMARY KEY,
  analysis_slug TEXT,                  -- hangi analiz (analyses.slug), NULL = genel
  company       TEXT,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  message       TEXT,
  material_type TEXT,                  -- ambalaj/malzeme tipi (opsiyonel serbest metin)
  status        TEXT NOT NULL DEFAULT 'new',   -- new | contacted | quoted | quote_accepted | sample_received | payment_received | sample_in_transit | sample_at_fcc | results_ready | closed
  source        TEXT DEFAULT 'web',
  ip            TEXT,
  consent_at    TIMESTAMPTZ,
  retention_until TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analysis_app_created ON analysis_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_app_status  ON analysis_applications (status);
CREATE INDEX IF NOT EXISTS idx_analysis_app_retention ON analysis_applications (retention_until) WHERE deleted_at IS NULL;

-- =========================================================
-- Danışmanlık başvuruları
-- =========================================================
CREATE TABLE IF NOT EXISTS consultancy_applications (
  id           SERIAL PRIMARY KEY,
  company      TEXT,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  topic        TEXT,                   -- ilgi alanı: PPWR, CSRD, Green Claims, genel...
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'new',   -- CRM: application-status.ts
  source       TEXT DEFAULT 'web',
  ip           TEXT,
  consent_at   TIMESTAMPTZ,
  retention_until TIMESTAMPTZ,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consult_app_created ON consultancy_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consult_app_status  ON consultancy_applications (status);
CREATE INDEX IF NOT EXISTS idx_consult_app_retention ON consultancy_applications (retention_until) WHERE deleted_at IS NULL;

-- =========================================================
-- İletişim mesajları
-- =========================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',
  ip          TEXT,
  consent_at  TIMESTAMPTZ,
  retention_until TIMESTAMPTZ,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_retention ON contact_messages (retention_until) WHERE deleted_at IS NULL;

-- =========================================================
-- Blog (SEO'nun kalbi — DB-driven, admin panelden CRUD)
-- =========================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,                  -- meta description + kart özeti
  body_md       TEXT NOT NULL,         -- Markdown gövde
  cover_image   TEXT,
  meta_title    TEXT,                  -- <title> override (SEO)
  meta_desc     TEXT,                  -- meta description override
  keywords      TEXT,                  -- virgülle ayrılmış TR anahtar kelimeler
  status        TEXT NOT NULL DEFAULT 'draft',  -- draft | published
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_status_pub ON blog_posts (status, published_at DESC);

-- =========================================================
-- Admin kullanıcıları (blog CRUD + başvuru görüntüleme)
-- =========================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,         -- scrypt/argon2 hash (ASLA düz metin)
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- Admin audit (KVKK: erişim ve değişiklik izi)
-- =========================================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id            SERIAL PRIMARY KEY,
  admin_id      INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id   INTEGER,
  details       JSONB,
  ip            TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log (created_at DESC);

-- =========================================================
-- Site içeriği (CMS: admin panelden düzenlenen metinler)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  INTEGER REFERENCES admin_users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_site_content_updated ON site_content (updated_at DESC);

-- =========================================================
-- Seed: PPWR analiz kataloğu (readme'deki sabitlerle uyumlu)
-- =========================================================
INSERT INTO analyses (slug, title, summary, threshold, sort_order) VALUES
  ('pfas', 'PFAS Analizi',
   'Ambalajda kasıtlı eklenen PFAS ve toplam flor seviyesinin PPWR eşiklerine göre değerlendirilmesi.',
   'Bireysel ≤25 ppb · toplam ≤250 ppb · toplam flor ≤50 mg/kg', 10),
  ('agir-metal', 'Ağır Metal Analizi',
   'Kurşun, kadmiyum, cıva ve altı değerlikli krom toplamının sınır değere uygunluğu.',
   'Pb+Cd+Hg+Cr(VI) ≤100 mg/kg', 20),
  ('geri-donusturulebilirlik', 'Geri Dönüştürülebilirlik / Design for Recycling',
   'Ambalajın geri dönüştürülebilirlik derecelendirmesi ve tasarım uyum değerlendirmesi.',
   'Derecelendirme sınıfları (A–E)', 30),
  ('minimizasyon', 'Minimizasyon Değerlendirmesi',
   'Ağırlık, hacim ve katman fazlalığının minimizasyon eşiğine göre analizi.',
   'Eşik %50 · e-ticaret %40', 40),
  ('geri-donusturulmus-icerik', 'Geri Dönüştürülmüş İçerik Doğrulama Hazırlığı',
   'Plastik ambalajda geri dönüştürülmüş içerik oranının doğrulamaya hazırlanması.',
   'Zorunlu asgari oranlar (malzemeye göre)', 50),
  ('yeniden-kullanim', 'Yeniden Kullanım Hedef Analizi',
   'Nakliye/grup ambalajı için yeniden kullanım hedeflerinin durum analizi.',
   '%40 / %70 · AB içi %100', 60),
  ('doc', 'Uygunluk Beyanı (DoC) Hazırlama',
   'PPWR uygunluk beyanının hazırlanması ve saklama süresi yönetimi.',
   'Saklama 5 / 10 yıl', 70),
  ('dpp-qr', 'DPP / QR İşaretleme Hazırlığı',
   'Dijital Ürün Pasaportu ve QR işaretleme altyapısına hazırlık.',
   'public_uuid tabanlı DPP stub', 80),
  ('etiketleme', 'Etiketleme ve İşaretleme Uyumu',
   'Malzeme bileşimi ve ayrıştırma etiketlerinin PPWR uyumu.',
   'Harmonize sembol seti', 90),
  ('epr-lucid', 'EPR / LUCID Kayıt Desteği',
   'Genişletilmiş üretici sorumluluğu kaydı ve Almanya LUCID hazırlığı (temiz veri ihracı).',
   'Yalnızca temiz veri ihracı', 100),
  ('csrd-entegrasyon', 'CSRD Ambalaj-Dilimi Entegrasyonu',
   'Aynı veriyle hem PPWR hem CSRD raporlamasını besleyen entegrasyon (farklılaştırıcımız).',
   'Ambalaj-slice filtresi', 110),
  ('green-claims', 'Green Claims Doğrulama',
   'Çevresel iddiaların kanıtlanabilirlik ve yeşil aklama riski açısından değerlendirilmesi.',
   'Kanıt tabanlı iddia kontrolü', 120),
  ('ppwr-gap', 'PPWR Genel Uyum Ön Değerlendirmesi',
   'Ürün ve ambalaj portföyünüz için hızlı boşluk (gap) analizi ve yol haritası.',
   'Ücretsiz ön değerlendirme', 5)
ON CONFLICT (slug) DO NOTHING;
