# mepackage

Marine Emission Package — PPWR uyum danışmanlığı ve ambalaj analizi başvuru sitesi.

Astro 5 (SSR) · React island · Tailwind v4 · PostgreSQL · Render.

## Yerel çalıştırma
```bash
npm install
cp .env.example .env        # DATABASE_URL doldur, DATABASE_SSL=false (yerel Postgres)
npm run db:init             # şemayı uygula + analiz kataloğunu seed et
npm run dev                 # http://localhost:4321
```

Yerel Postgres yoksa (Docker):
```bash
docker run --name mepkg-pg -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=mepackage \
  -p 5432:5432 -d postgres:16
# .env → DATABASE_URL=postgresql://postgres:pass@localhost:5432/mepackage
```

## Prod build
```bash
npm run build
npm run start               # dist/server/entry.mjs
```

## Render'a deploy
1. Repoyu GitHub'a it.
2. Render → **New → Blueprint** → bu repoyu seç (`render.yaml` otomatik okunur).
   Web servisi + managed Postgres birlikte kurulur.
3. İlk deploy sonrası şemayı uygula: Render Shell → `npm run db:init`
   (veya lokalden `DATABASE_URL=<external-url> npm run db:init`).
4. (Opsiyonel) SMTP_HOST / SMTP_USER / SMTP_PASS / NOTIFY_TO değerlerini
   Render dashboard'dan gir → başvurular mail olarak da düşer.
5. Domain: Render → Settings → Custom Domain → `www.me-package.com`
   (GoDaddy'de CNAME). Apex `me-package.com` → www'ye yönlendir.

## Sağlık kontrolü
`GET /api/health` → `{ ok: true, db: "up" }`

## Yol haritası
Bkz. `ARCHITECTURE.md` (faz planı) ve `PROGRESS.md` (faz logları).
Şu an: **Faz 0 tamam.** Sıradaki: Faz 1 (ana sayfa + SEO temeli).
