# GitHub + Render deploy rehberi (sagirhukuk.net)

## 1. GitHub'a kod gönderme

Proje remote: `https://github.com/alperenokay/internet-sitesi.git`

```powershell
cd "C:\Users\alper\OneDrive\Desktop\eda internet sitesi"
git add -A
git status
git commit -m "sagirhukuk.net: hukuk sitesi, CMS, blog, admin panel"
git push origin main
```

`.env` dosyası repoya gitmez (`.gitignore` içinde). Şifreler yalnızca Render panelinde kalır.

---

## 2. Render Blueprint (ilk kurulum)

1. [render.com](https://render.com) → giriş yap
2. **New +** → **Blueprint**
3. GitHub hesabını bağla, repo: `alperenokay/internet-sitesi`
4. `render.yaml` otomatik okunur; onayla

Oluşacak kaynaklar:

| Kaynak | Ad |
|---|---|
| Web servisi | `sagirhukuk` |
| PostgreSQL | `sagirhukuk-db` |

İlk deploy birkaç dakika sürer. Health check: `/api/health` → `{"ok":true,"db":"up"}`.

---

## 3. Render Shell (bir kez, zorunlu)

Deploy bittikten sonra: **sagirhukuk** servisi → **Shell**

```bash
npm run db:seed-blog
ADMIN_EMAIL=av.edasagir@sagirhukuk.net ADMIN_PASSWORD=GucluParolaBuraya npm run admin:create
```

- `db:seed-blog`: 6 statik blog yazısını DB'ye aktarır
- `admin:create`: admin panel giriş hesabı oluşturur (parolayı kendin belirle)

Admin panel: `https://SENIN-RENDER-URL.onrender.com/admin/login`

---

## 4. Ortam değişkenleri (Render Dashboard)

**sagirhukuk** → **Environment** → ekle/düzenle:

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `SESSION_SECRET` | Evet | Blueprint otomatik üretir; değiştirme |
| `DATABASE_URL` | Evet | DB'den otomatik bağlanır |
| `NOTIFY_TO` | Önerilir | `av.edasagir@sagirhukuk.net` (form bildirimi) |
| `KVKK_CONTACT_EMAIL` | Önerilir | KVKK sayfası iletişim e-postası |
| `SMTP_HOST` | Opsiyonel | E-posta bildirimi için |
| `SMTP_USER` | Opsiyonel | SMTP kullanıcı |
| `SMTP_PASS` | Opsiyonel | SMTP şifre |
| `GSC_VERIFICATION` | Opsiyonel | Google Search Console meta içeriği |

SMTP boşsa form yine DB'ye kaydedilir; yalnızca e-posta gitmez.

---

## 5. Özel domain (sagirhukuk.net)

**sagirhukuk** → **Settings** → **Custom Domains**

| Host | Tip | Hedef |
|---|---|---|
| `www.sagirhukuk.net` | CNAME | Render'ın verdiği adres (ör. `sagirhukuk.onrender.com`) |
| `sagirhukuk.net` | ALIAS / ANAME veya yönlendirme | `www` veya Render kök adresi |

DNS sağlayıcında (GoDaddy, Cloudflare vb.) kayıtları ekle. SSL Render tarafında otomatik gelir (birkaç dakika–saat).

`astro.config.mjs` içinde `site: "https://www.sagirhukuk.net"` zaten doğru.

---

## 6. Sonraki deploylar

`main` branch'e push → Render otomatik deploy eder (`autoDeploy: true`).

Her deploy'da `npm run db:setup` şemayı günceller (IF NOT EXISTS, güvenli).

---

## 7. Kontrol listesi

- [ ] `git push origin main` tamam
- [ ] Render Blueprint deploy yeşil
- [ ] `/api/health` → db up
- [ ] Shell: `db:seed-blog` + `admin:create`
- [ ] Admin giriş + içerik paneli test
- [ ] İletişim formu test (Render DB'ye yazıyor mu)
- [ ] DNS: www.sagirhukuk.net → Render
- [ ] SMTP (istersen) ayarlandı

---

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| Health 503 | DB henüz hazır değil; birkaç dk bekle veya `db:setup` loglarına bak |
| Admin giriş olmuyor | Shell'de `admin:create` tekrar çalıştır |
| Blog paneli boş | Shell'de `npm run db:seed-blog` |
| Form kaydolmuyor | Environment'ta `DATABASE_URL` dolu mu kontrol et |

Yerelde test: `npm run bug-test` (dev sunucu + Postgres açık olmalı).
