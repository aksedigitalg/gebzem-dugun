# Gebzem Düğün — Mimari, Geliştirme ve Operasyon Rehberi

> Bu dosya hem _human_ ekibe hem de Claude Code gibi AI asistanlarına projenin tamamını anlatır.
> Yeni bir konuşma açtığında **bu dosyayı oku** — projenin tüm karar geçmişi burada.

---

## 1. Vizyon & İş Modeli

**Gebzem Düğün**, Gebze, Darıca, Çayırova, Dilovası ve çevre ilçelerde evlenecek çiftleri sektörün doğrulanmış firmalarıyla buluşturan **multi-tenant marketplace** platformudur.

### B2C tarafı (Çiftler)
- Ücretsiz hesap, ücretsiz teklif gönderimi
- Firma karşılaştırma, gerçek müşteri yorumu, mesajlaşma
- Düğün araçları: bütçe, davetli, checklist, geri sayım

### B2B tarafı (Firmalar)
- 4 üyelik paketi: **FREE / STANDARD / PREMIUM / PRO**
- Profil, galeri, paket, müsaitlik takvimi yönetimi
- Teklif kutusu, mesajlaşma, analitik

### Coğrafi Kapsam
- **Birincil:** Gebze, Darıca, Çayırova, Dilovası
- **İkincil:** Tuzla, Pendik
- **Üçüncül:** İzmit, Körfez, Gölcük, Kandıra, Karamürsel, Başiskele, Kartepe

---

## 2. Teknik Stack

| Katman | Teknoloji | Notu |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC, Server Actions) | React 19 |
| Dil | TypeScript (strict) | `noUncheckedIndexedAccess: true` |
| Stil | **Tailwind CSS 4** (CSS-first config) + shadcn/ui | Tema: gül kurusu + zeytin yeşili |
| Font | **Google Sans Flex** (OFL) | Google Fonts CSS API |
| Veritabanı | **PostgreSQL** (Supabase managed) | `aws-1-eu-central-1` (Frankfurt) |
| ORM | **Prisma 6.19** | Schema: `prisma/schema.prisma` |
| Auth | **Auth.js v5 (NextAuth 5 beta)** | Credentials + Google OAuth, JWT strategy, 30g session |
| Hash | bcryptjs | rounds 12 |
| Storage | **Supabase Storage** | Buckets: firm-media, avatars, review-photos, firm-documents, blog |
| Sanitize | **isomorphic-dompurify** | Server-side HTML temizleme |
| Validation | **zod** | Form + server action input |
| Forms | react-hook-form + useActionState | React 19 hook'u |
| State | Zustand (client) + TanStack Query (server cache, opsiyonel) | Polling tabanlı chat |
| İkonlar | lucide-react | |
| Animasyon | framer-motion | |
| E-posta | Resend (planlı) | RESEND_API_KEY ile |
| SMS | Netgsm (planlı) | |
| Ödeme | iyzico (planlı) | sandbox-api.iyzipay.com |
| Hosting | **Vercel** (FRA region) | Otomatik deploy GitHub'tan |

---

## 3. Kullanıcı Rolleri & Yetki Akışı

### Roller
| Rol | Tanım | Erişebilir alan |
|---|---|---|
| `COUPLE` | Düğün hazırlığı yapan çift | `/hesabim/*` |
| `FIRM_OWNER` | Firma sahibi | `/firma-paneli/*` |
| `FIRM_STAFF` | Firma ekibi | `/firma-paneli/*` (sahibinin yetki verdiği) |
| `ADMIN` | Platform admin | `/admin/panel/*` |
| `SUPER_ADMIN` | Üst düzey admin | Tümü + sistem ayarları |

### Login akışı (rol bazlı kapılar)
- `/cift` → çift girişi (varsayılan "Giriş Yap" hedefi)
- `/cift/kayit` → çift kaydı
- `/isletme` → işletme girişi
- `/isletme/kayit` → işletme kaydı
- `/admin` → admin girişi (sitenin hiçbir yerinden link yok, robots.txt'de blok)

**Server-side rol kontrolü:** Her giriş aksiyonu kullanıcının rolünü `allowedRoles[]` ile karşılaştırır. Çift hesabıyla `/isletme`'den giriş yapmaya çalışmak hata verir ("Bu giriş ekranı seçtiğiniz hesap türü için uygun değil").

---

## 4. Proje Yapısı

```
gebzem-dugun/
├── prisma/
│   ├── schema.prisma          # Tüm veritabanı modeli
│   └── seed.ts                # 36 örnek firma + kullanıcı + bölge + kategori
├── public/
└── src/
    ├── app/
    │   ├── (auth)/            # /cift, /cift/kayit, /isletme, /isletme/kayit, /admin, /sifremi-unuttum
    │   ├── (marketing)/       # Anasayfa, /firma/[slug], /kategori, /bolge, hakkimizda, kvkk vs.
    │   ├── (dashboard)/       # /hesabim, /firma-paneli, /admin/panel
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handlers
    │   │   ├── notifications/route.ts        # Bell polling endpoint
    │   │   ├── conversation/[id]/messages    # Chat polling endpoint
    │   │   └── firm/[slug]/gallery           # Galeri refresh
    │   ├── globals.css        # Tailwind v4 tema
    │   ├── layout.tsx         # Root + SessionProvider + font preload
    │   ├── page.tsx (yok)     # Anasayfa marketing route group altında
    │   ├── robots.ts          # /admin, /api blok
    │   └── sitemap.ts         # ~1500+ URL (kategori × ilçe × mahalle)
    ├── auth.ts                # NextAuth main config (Credentials + bcrypt + Prisma adapter)
    ├── middleware.ts          # Edge middleware (auth-config'i kullanır)
    ├── components/
    │   ├── ui/                # Button, Input, Card, Badge, DropdownMenu, ...
    │   ├── layout/            # Header (session-aware), Footer, NotificationBell, UserMenu
    │   ├── home/              # Hero, CategoryGrid, FeaturedFirms, HowItWorks, Regions, ToolsSection, CtaFirm
    │   ├── shared/            # FirmCard, FirmCardSkeleton
    │   ├── firm/              # InquiryButton (modal), MessageButton, FirmGallery (lightbox)
    │   ├── chat/              # ChatThread (polling 5sn)
    │   ├── dashboard/         # DashboardShell, StatCard
    │   └── auth/              # SessionProvider wrapper
    ├── config/
    │   ├── site.ts            # Site config (name, url, email, social)
    │   ├── categories.ts      # 36 kategori (icon, group, slug)
    │   └── regions.ts         # 13 ilçe + 22 mahalle
    ├── lib/
    │   ├── db.ts              # Prisma singleton
    │   ├── utils.ts           # cn, formatPrice, slugify, relativeTime
    │   ├── auth-config.ts     # Edge-uyumlu (OAuth + middleware authz)
    │   ├── auth-guards.ts     # requireAuth/requireRole/requireFirmOwnership
    │   ├── sanitize.ts        # DOMPurify wrapper'ları
    │   ├── rate-limit.ts      # In-memory sliding window
    │   ├── audit.ts           # AuditLog yazıcı
    │   ├── notify.ts          # Notification creator
    │   ├── firm.ts            # firmCardSelect, getFirmsByCategory, getFirmBySlug...
    │   ├── supabase/
    │   │   ├── client.ts      # Browser SSR client
    │   │   ├── server.ts      # Server + service-role client
    │   │   └── storage.ts     # uploadFile, deleteFile, BUCKETS
    │   └── actions/
    │       ├── inquiry.ts     # createInquiry, respondInquiry
    │       ├── message.ts     # sendMessage, markRead
    │       ├── firm.ts        # updateProfile, uploadGallery, upsertService, moderate
    │       └── notification.ts
    └── types/
        └── next-auth.d.ts     # Session.user.role tip genişletmesi
```

---

## 5. Veritabanı Şeması (özet)

30+ tablo. Ana modeller:

- **User** — id, email, role, status, weddingDate, partnerName...
- **Account / Session / VerificationToken** — Auth.js
- **Firm** — slug, name, description, contact, address, district, neighborhood, serviceAreas[], membershipType, status, isVerified, isFeatured, ownerId
- **FirmStaff / FirmDocument** — Çoklu yetkili + onay belgeleri
- **Category / FirmCategory** — Bir firma birden fazla kategoride olabilir; isPrimary flag
- **Service / Package** — Firma hizmetleri (price min/max, unit, duration)
- **GalleryItem / VideoItem** — Görsel medyalar
- **Review / ReviewPhoto / ReviewVote** — Yorum sistemi (status: PENDING/APPROVED/REJECTED/FLAGGED)
- **Inquiry** — Teklif istekleri (status: NEW/READ/RESPONDED/CONVERTED/REJECTED/EXPIRED)
- **Conversation / Message** — Couple ↔ Firm sohbet (`unreadCount`, `readAt`, `deletedAt` soft-delete)
- **Favorite / Booking / Availability** — Favoriler ve takvim
- **FAQ / Announcement** — Firmaya ait SSS ve kampanya
- **BudgetItem / Guest / ChecklistItem** — Çift araçları
- **BlogPost** — CMS
- **Notification** — Bildirim (kind enum: INQUIRY_NEW, MESSAGE_NEW, REVIEW_NEW, FIRM_APPROVED ...)
- **Subscription / Payment** — Premium üyelik
- **AuditLog** — Production-grade: userId, actorRole, impersonatorId, action, resource, resourceId, status, before, after, ip, userAgent, requestId
- **Region / Setting** — Coğrafya ve sistem ayarları

Detay için `prisma/schema.prisma`'yı oku.

---

## 6. Güvenlik Modeli

### Authorization Helpers (`src/lib/auth-guards.ts`)

```ts
await requireAuth();                                  // Oturum şart
await requireRole("ADMIN", "SUPER_ADMIN");            // Belirli rol
await requireFirmOwnership(slug);                     // Firma sahibi (admin override edebilir)
await requireConversationAccess(conversationId);     // Konuşma katılımcısı
```

**Kural:** Server action'ın ilk satırı bu fonksiyonlardan biri olmalı. Middleware tek başına yeterli değil — server action'lar POST endpoint'idir, sayfadan bağımsız çağrılabilir.

### IDOR önleme

Her sahiplik kontrolü, `WHERE` cümleciğinde atomik şekilde yapılır:

```ts
const firm = await db.firm.findFirst({
  where: { slug, ownerId: session.user.id }, // sahiplik WHERE'da
});
```

Asla `findUnique({where:{slug}})` + sonradan JS check yapılmıyor.

### Rate Limiting (`src/lib/rate-limit.ts`)

In-memory sliding-window limiter. Vercel Node serverless container ömrü kadar yaşar — kötü niyetli login spam'ine karşı yeterli koruma. Production trafiği büyüyünce **Upstash Redis** ile değiştirilmeli (Aynı API).

Ön tanımlı limitler:
- `login` — dakikada 5
- `signup` — dakikada 3
- `inquiry` — saatte 10
- `message` — dakikada 60
- `contactForm` — dakikada 3

### XSS / HTML Sanitization (`src/lib/sanitize.ts`)

`isomorphic-dompurify` kullanılıyor. `description` gibi HTML alanlar `sanitizeRichText()` ile temizlenir. İzin verilen taglar: `p, b, i, em, strong, ul, ol, li, h2-h4, a, blockquote`. URL whitelist: `https?, mailto, tel, /`.

Mesaj/yorum gibi düz metinler `sanitizeText(text, maxLen)` ile (HTML tamamen strip).

### CSRF

Auth.js v5 default CSRF token mekanizması (`/api/auth/csrf`) tüm form submission'larda kullanılır. Server Actions için Next.js'in built-in koruması var.

### Input Validation

Tüm formlar + server action'lar **zod schema** ile parse edilir. `safeParse` → field-level error.

### Audit Logging (`src/lib/audit.ts`)

Production-grade alan setiyle (before/after, status, IP, UA, requestId, impersonatorId). Tüm admin moderasyon, firma profil güncellemesi, galeri upload/delete, hizmet CRUD, mesaj gönderimi, teklif yanıtı kaydedilir.

Index: `(resource, resourceId, createdAt DESC)` — "Bu firmayla ilgili tüm hareketler" sorgusu hızlı.

### Auth.js Edge / Node Split

`src/lib/auth-config.ts` (edge-uyumlu): Sadece OAuth provider'lar + `authorized()` callback. Middleware bu config'i kullanır.

`src/auth.ts` (Node-only): PrismaAdapter + Credentials provider + bcrypt. Sadece server action / route handler'larda kullanılır.

### Security Headers (`next.config.ts`)

```ts
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### Secrets

**Asla** kaynak kodunda değil. `.env` dosyası `.gitignore`'da. Vercel'de Encrypted Environment Variables.

---

## 7. Auth Akışı (E2E)

### Login (örn. çift)
1. Kullanıcı `/cift` → form submit
2. `signinCoupleAction` server action:
   - Rate limit (`memoryRateLimit("login:" + ip, 5, 60s)`)
   - zod validation
   - `db.user.findUnique({email})` → rol kontrolü (`COUPLE` mü?)
   - `signIn("credentials", { email, password, redirectTo: "/hesabim" })`
3. Auth.js Credentials provider `authorize()` → bcrypt karşılaştırma → user objesi
4. JWT cookie set + 302 redirect
5. Client `useSession()` hook'u oturumu yakalar
6. Header'daki "Giriş Yap" butonu → kullanıcı dropdown menü ile değişir

### Logout
- Header → avatar tıkla → "Çıkış Yap" → `signOut({ callbackUrl: "/" })`
- Mobile drawer'dan da aynı akış

### Onay süreci (firma)
- `signupFirmAction` ile kayıt → `status: ACTIVE` (otomatik aktif, ileride PENDING'e çekilebilir)
- Admin `/admin/firmalar/[id]` → `moderateFirmAction` ile APPROVE/REJECT/SUSPEND
- Bildirim (`Notification` kind: `FIRM_APPROVED`/`FIRM_REJECTED`)

---

## 8. Mesajlaşma Sistemi

### Schema
- `Conversation { userId, firmId, lastMessageAt, unreadCount }`
- `Message { conversationId, senderId, receiverId, content, isRead, readAt, deletedAt, attachments }`

### Akış
1. Çift firma sayfasında "Mesaj Gönder" → `sendMessageAction({ firmId, content })`
2. `Conversation.upsert({ userId_firmId })` → idempotent
3. `Message.create` → `Conversation.lastMessageAt` + `unreadCount` güncellenir
4. Alıcıya `Notification` (`kind: MESSAGE_NEW`) yazılır

### UI
- `ChatThread` component — 5 saniyede bir `/api/conversation/[id]/messages` poll'lar
- `document.hidden` ise polling pause
- Mesaj balonu sahibe göre sağ/sol hizalı, read receipt (`✓✓`)
- Mount edilince `markConversationReadAction` → mesaj `isRead: true`, `unreadCount: 0`

### Production'a geçerken
Polling işe yarıyor ama trafik artarsa **Supabase Realtime** veya **Pusher**'a geçilebilir. Schema değişmez.

---

## 9. Bildirim Sistemi

### Schema
```
Notification { id, userId, kind enum, title, body, link?, meta?, isRead, readAt, createdAt }
```

### UI
- Header'da bell ikonu (sadece authenticated kullanıcılar görür)
- Açılınca `/api/notifications` çağrısı → 30sn'de bir auto-refresh
- Unread count badge
- Tıklayınca `markNotificationReadAction` + `link`'e yönlendir
- Tüm bildirimler: `/hesabim/bildirimler`

### Tetikleyiciler
- `INQUIRY_NEW` → firma sahibi
- `INQUIRY_RESPONDED` → çift
- `MESSAGE_NEW` → alıcı
- `REVIEW_NEW` → firma sahibi
- `FIRM_APPROVED` / `FIRM_REJECTED` → firma sahibi
- `ADMIN_BROADCAST` → toplu duyuru

---

## 10. Public Sayfalar (SEO)

### Statik üretim (`generateStaticParams`)
- `/kategori/[slug]` — 36 sayfa
- `/kategori/[slug]/[ilce]` — 36 × ~6 ilçe = 216 sayfa
- `/bolge/[slug]` — 13 sayfa

### Dinamik
- `/firma/[slug]` — DB'den okur, 60sn cache (default)

### JSON-LD Schema
- Anasayfa: `WebSite` + `Organization` + `BreadcrumbList`
- Kategori: `CollectionPage` + `ItemList`
- Firma profili: `LocalBusiness` (içinde `AggregateRating`, `Review`, `PostalAddress`, `GeoCoordinates`)
- Bölge: `Place`

### Sitemap
`src/app/sitemap.ts` — statik route'lar + 36 kategori + 13 ilçe + 36×~6 kategori×ilçe + mahalle long-tail. Toplam ~1500+ URL.

---

## 11. Storage (Supabase)

### Buckets (lib/supabase/storage.ts)
- `firm-media` — public, firma logo/cover/galeri
- `avatars` — public, kullanıcı avatar
- `review-photos` — public, yorum fotoğrafları
- `firm-documents` — **private**, vergi levhası gibi belgeler (signed URL ile erişilir)
- `blog` — public, blog kapakları

### Upload akışı
1. Server action FormData'dan `File` alır
2. `requireFirmOwnership` ile yetki
3. MIME + size validation (max 8 MB image)
4. `uploadFile` → service-role key ile `{slug}/gallery/{timestamp}-{filename}.ext` path'e
5. Public URL DB'de saklanır (`GalleryItem.url`)
6. `audit("GALLERY_UPLOAD", ...)` kayıt

### RLS Politikaları (öneri)
Service role bypass ediyor şu an, ama browser tarafından yapılacak doğrudan upload'lar için RLS gerekecek:

```sql
create policy "firm-media public read" on storage.objects
  for select using (bucket_id = 'firm-media');

create policy "firm owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'firm-media'
    and exists (
      select 1 from "Firm" f
      where f.slug = (storage.foldername(name))[1]
        and f."ownerId" = auth.uid()
    )
  );
```

---

## 12. Geliştirme Akışı

### İlk kurulum
```bash
git clone https://github.com/aksedigitalg/gebzem-dugun.git
cd gebzem-dugun
npm install
cp .env.example .env
# .env içine Supabase + AUTH_SECRET değerlerini gir
npm run db:push        # Şemayı Supabase'e gönder
npm run db:seed        # 36 firma + kullanıcı seed
npm run dev            # http://localhost:3000
```

### Komutlar
| Komut | Anlam |
|---|---|
| `npm run dev` | Dev sunucusu (3000) |
| `npm run build` | Production build (lokal) |
| `npm run start` | Build sonrası çalıştır |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Prisma client üret |
| `npm run db:push` | Schema'yı PG'ye uygula (geliştirme) |
| `npm run db:migrate` | Migration oluştur (production) |
| `npm run db:studio` | Prisma Studio aç |
| `npm run db:seed` | Seed çalıştır |

### Test hesapları (seed)
| Rol | E-posta | Şifre |
|---|---|---|
| Süper Admin | `admin@gebzemdugun.com` | `admin12345` |
| Çift | `cift@example.com` | `couple12345` |
| Firma Sahibi | `firma@example.com` | `firma12345` |
| Her kategorinin firma sahibi | `firma-{kategori-slug}@gebzemdugun.com` | `firma12345` |

---

## 13. Deployment (Vercel)

### Bağlantı
- GitHub repo: `https://github.com/aksedigitalg/gebzem-dugun`
- Vercel proje: `gebzem-dugun`
- Production URL: `https://gebzem-dugun.vercel.app` (custom domain `gebzemdugun.com` bağlanacak)
- Region: `fra1` (Frankfurt — Supabase'le aynı)
- Build: `prisma generate && next build`

### Env vars (Vercel'de Encrypted)
```
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL          # pooled, port 6543
DIRECT_URL            # direct, port 5432
AUTH_SECRET
AUTH_TRUST_HOST
```

Opsiyonel: `GOOGLE_CLIENT_ID/SECRET, RESEND_API_KEY, IYZICO_*`.

### CI/CD
Her `git push origin main` → Vercel otomatik production deploy. Build ortalama **45-60 saniye**.

### Domain bağlama
Vercel Dashboard → Project Settings → Domains → `gebzemdugun.com` ekle. DNS A/CNAME ayarlarını domain sağlayıcıdan yap (Vercel rehberi gösterir).

---

## 14. Yapılan İşin Tam Listesi (kronolojik)

### v0.1 — Skelet (Faz 1)
- Next.js 15 + TS strict + Tailwind v4 + Prisma + NextAuth v5 kuruldu
- Tema: gül kurusu + zeytin yeşili + altın
- Anasayfa, marketing sayfaları (hakkımızda, nasıl çalışır, iletişim, KVKK, gizlilik, kullanım şartları, çerez)
- Footer + sitemap (1500+ URL)
- 30+ Prisma modeli
- Vercel + Supabase entegrasyonu
- GitHub'a push, Vercel'e auto-deploy

### v0.2 — Auth restructure
- Login route'ları `/cift`, `/isletme`, `/admin` olarak ayrıldı
- `/admin` sitenin hiçbir yerinden link verilmiyor (robots blok)
- Rol bazlı server-side authz (kapı kontrolü)
- Çift + işletme + admin kayıt + giriş + logout

### v0.3 — Session-aware UI
- `<SessionProvider>` root'a eklendi
- Header artık session-aware: avatar, dropdown, çıkış
- Mobile drawer da session-aware
- Notification bell + 30sn polling

### v0.4 — Brand & font
- Logo "Gebzem Düğün" (Türkçe karakterli)
- Font: **Google Sans Flex** (OFL — legal Google Sans alternatifi)
- Stok Unsplash görselleri kaldırıldı
- Featured firms placeholder'a dönüştürüldü

### v0.5 — Marketplace çekirdeği (BU SÜRÜM)
- **36 örnek firma** — her kategoride 1, gerçekçi Türkçe veri
- **Firma profil sayfası** `/firma/[slug]` — hero, hakkında, galeri (lightbox), hizmetler, paketler, yorumlar, SSS, sticky aksiyon paneli, JSON-LD LocalBusiness
- **Kategori listeleme** `/kategori/[slug]` + `/kategori/[slug]/[ilce]` — SSG, filtreleme, breadcrumb, SEO içerik
- **Bölge sayfası** `/bolge/[slug]` — kategoriye göre filtrele
- **Teklif (Inquiry) sistemi** — modal form, anonim kullanıcı için lazy guest user, rate-limit, bildirim
- **Mesajlaşma sistemi** — chat thread, 5sn polling, read receipt, soft-delete, sanitize
- **Notification sistemi** — bell + dropdown + tam sayfa, 8 trigger
- **Firma dashboard** — overview (stats, son teklifler/mesajlar/yorumlar), profilim (full edit), galeri (upload/delete), hizmetlerim (CRUD), teklifler + detay/yanıt, mesajlar + chat, üyelik banner
- **Çift dashboard** — overview, tekliflerim, mesajlar, bildirimler
- **Admin paneli** — overview (stats + son hareket), firma listesi (filter), firma detay + moderasyon (onay/red/askı/öne çıkar/doğrulan), audit log
- **Güvenlik** — auth-guards, rate-limit, sanitize, audit (production-grade alanlar), IDOR-safe Prisma sorguları
- **CRM-style dashboard shell** — sidebar nav (badge'li), stat cards, breadcrumb

### Henüz yapılmadı (Faz 2 / v0.6+)
- Yorum yazma akışı (sadece okuma var)
- Müsaitlik takvimi UI
- Bütçe / davetli / checklist (çift araçları) UI
- Premium üyelik + iyzico ödeme entegrasyonu
- E-posta tetikleyicileri (Resend) — kayıt onay, teklif bildirimi
- SMS bildirimi (Netgsm)
- Blog modülü
- Storage RLS policies (şu an service-role bypass)
- Upstash Redis rate-limit (in-memory yerine)
- Real-time chat (Supabase Realtime / Pusher) — şu an polling
- Image optimization fully (next/image migration — şu an `<img>` ile)

---

## 15. Sık Karşılaşılan Sorunlar

### "Login bug — giriş yaptıktan sonra hala 'Giriş Yap' görünüyor"
**Çözüldü v0.3'te.** SessionProvider + useSession hook'u eklendi.

### "Edge runtime error — bcrypt cannot be loaded in middleware"
**Çözüm:** `auth-config.ts` (edge) ile `auth.ts` (Node) ayrımı — Credentials provider yalnızca `auth.ts`'de.

### "Prisma EPERM error rename query_engine.dll.node.tmp"
**Çözüm:** `taskkill //F //IM node.exe` ile node processlerini kapat, sonra `npx prisma generate`.

### "Build hatası: layout exports anything other than Component/metadata"
**Çözüm:** Layout dosyasından server action export'u kaldır, ayrı dosyaya taşı.

### "useFormState is deprecated"
**Çözüm:** React 19'da `useActionState` from "react" kullan.

---

## 16. Karar Geçmişi (önemli mimari seçimler)

| Karar | Neden |
|---|---|
| Auth.js v5 (Credentials) — Clerk değil | Self-hosted, dış servis bağımlılığı yok |
| JWT session strategy | Edge middleware'de DB hit etmemek için |
| In-memory rate limit | İlk sürüm; trafik artınca Upstash'a geç |
| Polling chat (5sn) | Supabase Realtime için JWT minting katmanı gerekecekti; MVP için fazla |
| Prisma + service role write | RLS henüz yok; service role ile yazıp DB seviyesinde validate ediyoruz |
| Tailwind v4 CSS-first | Daha az config, daha hızlı dev |
| 36 kategori × 1 firma seed | Boş site izlenimi vermesin; gerçek firmalar onaylandıkça yer alacak |
| `(auth)` `(marketing)` `(dashboard)` route group'ları | Layout izolasyonu; auth pages'in kendi minimalist layout'u var |

---

## 17. Bir Sonraki Sürüm İçin Yapılacaklar

1. **Yorum yazma akışı** — `/firma/[slug]/yorum-yaz` + sadece doğrulanmış müşteri (Inquiry CONVERTED durumundan sonra) yorum yazabilir
2. **Müsaitlik takvimi UI** — firma için tarih bloklama, çift için "bu tarih müsait mi?" widget'ı
3. **Bütçe + davetli + checklist** araçları
4. **iyzico** sandbox ödeme akışı + Subscription model
5. **Resend** e-posta template'leri (kayıt onay, teklif bildirimi, parola sıfırlama)
6. **Storage RLS** policy'leri uygulanması
7. **Upstash** rate-limit'e geç
8. **next/image** migration — tüm `<img>` etiketlerini değiştir
9. **Real-time chat** — Supabase Realtime
10. **Blog modülü** — admin CMS + public

---

> **Bu doküman live bir kaynaktır. Yeni feature eklendiğinde bu dosyayı güncelle.**
