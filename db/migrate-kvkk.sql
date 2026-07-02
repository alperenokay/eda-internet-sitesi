-- Mevcut veritabanlarına KVKK alanları (idempotent)
-- Çalıştır: npm run db:migrate-kvkk

ALTER TABLE analysis_applications ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
ALTER TABLE analysis_applications ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ;
ALTER TABLE analysis_applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE consultancy_applications ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
ALTER TABLE consultancy_applications ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ;
ALTER TABLE consultancy_applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_analysis_app_retention ON analysis_applications (retention_until) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_consult_app_retention ON consultancy_applications (retention_until) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contact_retention ON contact_messages (retention_until) WHERE deleted_at IS NULL;

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
