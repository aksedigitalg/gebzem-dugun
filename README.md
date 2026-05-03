# GebzemDugun.com

**Gebze, Darıca, Çayırova ve Dilovası'nın yerel düğün hizmetleri marketplace platformu.**

Düğün, nişan, kına ve sünnet için hizmet veren tüm sektör firmalarını (mekan, fotoğrafçı, organizasyon, gelinlik, davetiye, vb.) tek çatı altında toplayan; çiftlerin firma karşılaştırması, fiyat teklifi alma, yorum okuma ve rezervasyon yapma yapabildiği multi-tenant marketplace.

---

## 🏗️ Teknoloji Stack

| Katman              | Teknoloji                                                    |
| ------------------- | ------------------------------------------------------------ |
| **Framework**       | Next.js 15 (App Router, RSC, Server Actions)                 |
| **Dil**             | TypeScript (strict)                                          |
| **Stil**            | Tailwind CSS 4 + shadcn/ui                                   |
| **Veritabanı**      | PostgreSQL (Supabase / Neon)                                 |
| **ORM**             | Prisma                                                       |
| **Auth**            | Auth.js v5 (NextAuth) — Credentials + Google                 |
| **Form**            | react-hook-form + zod                                        |
| **State**           | Zustand (client) + TanStack Query (server cache)             |
| **İkonlar**         | lucide-react                                                 |
| **Animasyon**       | framer-motion                                                |
| **Hosting**         | Vercel + Cloudflare R2 (CDN/medya)                           |
| **E-posta / SMS**   | Resend / Netgsm                                              |
| **Ödeme**           | iyzico / PayTR                                               |

---

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları kur

```bash
npm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp .env.example .env
```

`.env` dosyasını düzenle. Minimum gereksinimler:
- `DATABASE_URL` — PostgreSQL bağlantı string'i
- `AUTH_SECRET` — `openssl rand -base64 32` ile oluştur

### 3. Veritabanı

```bash
# Şemayı PG'ye uygula (geliştirme için)
npm run db:push

# Veya migration ile (production-ready)
npm run db:migrate

# Örnek verileri yükle
npm run db:seed
```

### 4. Geliştirme sunucusu

```bash
npm run dev
```

Tarayıcıda <http://localhost:3000> aç.

---

## 🔑 Seed sonrası örnek kullanıcılar

| Rol             | E-posta                    | Şifre         |
| --------------- | -------------------------- | ------------- |
| Süper Admin     | admin@gebzemdugun.com      | admin12345    |
| Çift            | cift@example.com           | couple12345   |
| Firma Sahibi    | firma@example.com          | firma12345    |

---

## 📁 Proje Yapısı

```
gebzem-dugun/
├── prisma/
│   ├── schema.prisma         # Veritabanı modeli
│   └── seed.ts               # Seed verileri
├── public/                   # Statik dosyalar
└── src/
    ├── app/
    │   ├── (auth)/           # giris, kayit, sifremi-unuttum
    │   ├── (marketing)/      # anasayfa, hakkimizda, yasal sayfalar
    │   ├── (dashboard)/      # hesabim, firma-paneli, admin
    │   └── api/              # API route'ları (auth, vb.)
    ├── components/
    │   ├── layout/           # Header, Footer
    │   ├── ui/               # Button, Input, Card, …
    │   ├── home/             # Anasayfa bölümleri
    │   └── shared/           # Ortak bileşenler
    ├── config/
    │   ├── site.ts           # Site genel bilgileri
    │   ├── categories.ts     # 30+ kategori tanımı
    │   └── regions.ts        # İlçe & mahalle tanımları
    ├── lib/
    │   ├── db.ts             # Prisma client
    │   ├── utils.ts          # Yardımcılar (cn, formatPrice, slugify…)
    │   └── auth-config.ts    # Edge-uyumlu auth config
    ├── auth.ts               # NextAuth ana yapılandırması
    └── middleware.ts         # Route koruması
```

---

## 🛣️ Yol Haritası

Proje 6 faz halinde geliştirilmektedir:

- **Faz 1 (Tamamlandı):** Proje iskeleti, auth, anasayfa, kategori/bölge konfigürasyonu, yasal sayfalar
- **Faz 2:** Marketplace fonksiyonları — firma profili, arama, filtreleme, yorum, teklif sistemi
- **Faz 3:** Premium üyelik, ödeme entegrasyonu (iyzico)
- **Faz 4:** Çift araçları — bütçe, davetli, checklist, geri sayım
- **Faz 5:** Detaylı analitik, blog, yerel SEO sayfaları
- **Faz 6:** Mobil uygulama (React Native), genişleme

Detaylı plan için [proje brief](./PROJECT_BRIEF.md) (gelecek).

---

## 📜 Lisans

© 2026 GebzemDugun.com — Tüm hakları saklıdır.
