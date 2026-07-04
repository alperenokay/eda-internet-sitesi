# sagirhukuk

Sağır Hukuk & Danışmanlık — Av. Eda Öykü Sağır kurumsal web sitesi ([sagirhukuk.net](https://www.sagirhukuk.net)).

## Geliştirme (yerel)

```bash
npm install
cp .env.example .env
# PostgreSQL çalışır durumda olmalı
npm run db:setup
npm run db:seed-blog
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create
npm run dev
```

Tarayıcı: `http://localhost:4321` · Admin: `/admin/login`

## Deploy (GitHub + Render)

Ayrıntılı adımlar: **[DEPLOY.md](./DEPLOY.md)**

Kısa özet:

1. `git push origin main`
2. Render → New → Blueprint → repo seç → `render.yaml`
3. Shell: `npm run db:seed-blog` ve `npm run admin:create`
4. Domain: `www.sagirhukuk.net` CNAME → Render

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run db:setup` | Şema + CMS tablosu |
| `npm run db:seed-blog` | Statik blog yazılarını DB'ye aktar |
| `npm run admin:create` | Admin hesabı oluştur |
| `npm run bug-test` | Yerel smoke test |

## Public sayfalar

- `/` ana sayfa (CMS)
- `/blog` blog + admin CRUD
- `/iletisim` form + harita
- `/kvkk` aydınlatma metni (CMS)
- `/admin` yönetim paneli (noindex)
