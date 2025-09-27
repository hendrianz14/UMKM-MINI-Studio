# UMKM MINI STUDIO

UMKM MINI STUDIO adalah SaaS siap deploy untuk membantu pelaku UMKM mengubah foto produk menjadi konten profesional lengkap dengan caption, hashtag, dan template desain siap pakai.

## Fitur Utama

- Landing page marketing responsif dengan dark mode ready.
- Autentikasi Firebase (Email/Password & Google) dengan integrasi Firestore dan Storage.
- Dashboard proteksi kredensial dengan ringkasan kredit, trial, dan aktivitas terbaru.
- Generate konten otomatis terhubung ke workflow n8n via webhook & callback HMAC.
- Editor template dengan preset gaya (Rustic Food, Modern Minimal, Esports-style, Cafe Aesthetic).
- Galeri hasil dengan aksi lihat, unduh, duplikasi ke editor, dan hapus.
- Sistem kredit + trial 1x/24 jam dengan transaksi Firestore atomik.
- Mock top-up kredit dan struktur siap integrasi payment gateway.
- Struktur i18n sederhana (en/id) dan komponen UI berbasis shadcn/ui.
- Firebase Security Rules & contoh Firestore Indexes.
- Vitest unit test untuk util keamanan webhook dan util kredit.

## Bugfix Notes

- **Navigasi tertutup layer dekoratif** – dua elemen dekorasi hero berposisi absolut tidak memiliki `pointer-events: none` sehingga menutupi klik navbar, terutama pada viewport kecil. Lapisan hero kini diberi `pointer-events-none`, prioritas `z-0`, dan header dinaikkan ke `z-50` agar interaksi selalu lolos.【F:app/page.tsx†L210-L216】【F:components/site-header.tsx†L28-L57】
- **Menu mobile tamu tidak tersedia** – sebelum perbaikan hanya avatar pengguna login yang memunculkan Sheet. Pengunjung tanpa sesi tidak punya cara membuka menu mobile. Ditambahkan `GuestMobileNav` dengan trigger avatar sehingga menu fitur/pricing/sign-in dapat dibuka di mobile.【F:components/mobile-nav.tsx†L1-L49】【F:components/site-header.tsx†L7-L57】
- **Inisialisasi Firebase gagal saat ENV kosong** – penggunaan non-null assertion pada `lib/firebase.ts` melempar `FirebaseError: auth/invalid-api-key` dan memblokir SSR. Kini konfigurasi divalidasi, menampilkan peringatan ramah, serta memakai fallback lokal agar UI tetap render sampai variabel lingkungan diisi benar.【F:lib/firebase.ts†L1-L56】

## Cara Uji Singkat

1. `pnpm install` (sekali saja) kemudian `pnpm dev`.
2. Buka `http://localhost:3000`.
3. Klik **Sign in** di header → halaman `/signin` harus terbuka.
4. Klik **Sign up** → halaman `/signup` harus terbuka.
5. Kecilkan viewport (≤768px), klik avatar/trigger di kiri atas → Sheet mobile muncul → pilih **Sign in** → berpindah ke `/signin`.
6. Opsional: jalankan otomatisasi `pnpm exec playwright test tests/auth-navigation.spec.ts` untuk memverifikasi alur klik dasar (butuh server dev aktif).
7. Setelah login berhasil (dengan kredensial Firebase valid), akses halaman protected `/dashboard` untuk memastikan middleware mengizinkan sesi.

## Prasyarat

- Node.js 18+
- pnpm (disarankan) atau npm/yarn
- Akun Firebase + kredensial proyek
- Workflow n8n dengan webhook `N8N_WEBHOOK_URL`
- Secret Manager (GCP) untuk menyimpan `N8N_WEBHOOK_URL` dan `CALLBACK_SECRET`

## Konfigurasi Lingkungan

Buat file `.env.local` (jangan commit):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
N8N_WEBHOOK_URL=https://<host-n8n>/webhook/umkm-mini-studio
CALLBACK_SECRET=<random-64-hex>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Untuk penggunaan emulator lokal tambahkan `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`.

## Menjalankan Secara Lokal

```bash
pnpm install
pnpm dev
```

Aplikasi tersedia di `http://localhost:3000`.

### Testing & Linting

```bash
pnpm test
pnpm lint
```

#### End-to-end (Playwright)

Playwright otomatis melakukan build dan menjalankan server Next.js melalui konfigurasi `webServer`, jadi tidak perlu menyalakan server manual.

```bash
# Menjalankan seluruh e2e test tanpa login (otomatis skip yang butuh kredensial)
pnpm exec playwright test

# Opsional: verifikasi build Next.js sebelum e2e
pnpm build
```

Untuk menjalankan skenario yang membutuhkan login, set variabel lingkungan berikut sebelum memanggil Playwright:

```bash
export NEXT_PUBLIC_FIREBASE_API_KEY="<api-key>"
export CODEGEN_EMAIL="<bot-email>"
export CODEGEN_PASSWORD="<bot-password>"

pnpm exec playwright test
```

Global setup akan melakukan login headless (REST `signInWithPassword` → `POST /api/auth/session-login`) dan menyimpan cookie ke `storageState.json`. Jika variabel belum di-set, file kosong dibuat sehingga test yang diberi tanda "butuh login" otomatis di-skip.

#### CI

Contoh workflow GitHub Actions tersedia di `.github/workflows/e2e.yml`. Simpan `NEXT_PUBLIC_FIREBASE_API_KEY`, `CODEGEN_EMAIL`, dan `CODEGEN_PASSWORD` sebagai repository secrets agar skenario login berjalan di pipeline.

## Headless Login (Cara #2)

Gunakan alur login headless dengan session cookie HTTP-only untuk otomatisasi (CI, Playwright, bot).

### Variabel Lingkungan

- **Client**: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_APP_URL` (opsional).
- **Server**: gunakan salah satu: `FIREBASE_ADMIN_JSON` (string JSON service account saat lokal/dev) **atau** Workload Identity di Cloud Run tanpa env JSON.
- **CI/Runner**: `APP_URL`, `CODEGEN_EMAIL`, `CODEGEN_PASSWORD`, `NEXT_PUBLIC_FIREBASE_API_KEY`.

### Langkah uji cepat dengan cURL

```bash
API_KEY="<NEXT_PUBLIC_FIREBASE_API_KEY>"
EMAIL="<bot-email@domain>"
PASSWORD="<bot-password>"
APP_URL="http://localhost:3000"  # atau staging/prod

# 1) Ambil ID_TOKEN
ID_TOKEN=$(
  curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"returnSecureToken\":true}" | jq -r .idToken
)

# 2) Tukar ke session cookie
curl -i -c cookies.txt -X POST "$APP_URL/api/auth/session-login" \
  -H "Content-Type: application/json" \
  -d "{\"idToken\":\"$ID_TOKEN\"}"

# 3) Akses halaman protected
curl -b cookies.txt -L "$APP_URL/dashboard" -o dashboard.html

# 4) Logout
curl -b cookies.txt -X POST "$APP_URL/api/auth/session-logout"
```

### Catatan keamanan

- Cookie `secure` otomatis aktif di production (`NODE_ENV !== "development"`).
- Jangan pernah commit service account. Simpan `FIREBASE_ADMIN_JSON` di Secret Manager (prod) atau `.env.local` (lokal).

## Struktur Penting

- `app/` : Next.js App Router (landing, auth, dashboard, API routes).
- `components/` : komponen UI dan shell proteksi.
- `lib/` : util Firebase, kredensial, i18n, API helper.
- `data/` : preset template & paket kredit.
- `firebase/` : rules dan indexes.
- `tests/` : unit test vitest.

## Workflow n8n

1. Buat workflow dengan Webhook node (URL dari `N8N_WEBHOOK_URL`).
2. Terima payload:
   ```json
   {
     "jobId": "<uuid>",
     "userId": "<uid>",
     "imagePath": "https://storage.googleapis.com/...",
     "productName": "Kopi Susu",
     "description": "Highlight produk",
     "style": "modern",
     "jobType": "generate",
     "options": { "tone": 50, "luxury": 60, "templateId": "modern-minimal" },
     "callbackUrl": "https://app/api/jobs/callback"
   }
   ```
3. Setelah proses selesai, kirim POST ke `callbackUrl` dengan header `X-Callback-Signature` (HMAC SHA256 body menggunakan `CALLBACK_SECRET`):
   ```json
   {
     "jobId": "<uuid>",
     "status": "done",
     "resultImageUrl": "https://...",
     "captions": ["Caption profesional"],
     "hashtags": ["umkm", "kopi"],
     "meta": {"duration": 42}
   }
   ```

## Deploy

### Frontend + Backend (Cloud Run)

1. Build project:
   ```bash
   pnpm build
   ```
2. Buat container image menggunakan Cloud Build atau Dockerfile (optional tambahkan).
3. Deploy ke Cloud Run dengan env var (`NEXT_PUBLIC_*`, `N8N_WEBHOOK_URL`, `CALLBACK_SECRET`) terhubung ke Secret Manager.
4. Pastikan service memiliki akses ke Firebase (service account dengan role Firestore/Storage).
5. Konfigurasikan domain kustom & HTTPS.

### Alternatif Frontend di Firebase Hosting

1. Build dengan `pnpm build`.
2. Gunakan `firebase hosting:channel:deploy` atau `firebase deploy` untuk direktori `.next` hasil build (gunakan Next.js SSR adapter atau deploy ke Cloud Run untuk API).

### Secret Manager

- Simpan `CALLBACK_SECRET` dan `N8N_WEBHOOK_URL` sebagai secrets.
- Gunakan `gcloud secrets versions access` saat deploy Cloud Run atau binding langsung via UI.

## Seed & Data Awal

- Jalankan signup via UI untuk membuat user. Default kredit awal 50.
- Gunakan endpoint `POST /api/topup/mock` untuk mock top-up.

## Catatan Keamanan

- Semua API routes memverifikasi Firebase ID Token.
- Jobs hanya dibuat via backend untuk menjaga atomisitas kredit.
- Callback n8n diverifikasi dengan HMAC.
- Firestore & Storage rules membatasi akses per user.

## Known Edge Cases

- Fallback konfigurasi Firebase hanya menjaga UI tetap render; autentikasi nyata tetap membutuhkan variabel `NEXT_PUBLIC_FIREBASE_*` yang valid dan domain yang diotorisasi di Firebase Console.【F:lib/firebase.ts†L13-L56】
- Playwright global setup membutuhkan kredensial `CODEGEN_EMAIL`/`CODEGEN_PASSWORD` serta API Key Firebase untuk menjalankan tes yang mengakses dashboard. Jalankan spesifik `tests/auth-navigation.spec.ts` bila hanya ingin memverifikasi navigasi publik.【F:tests/global-setup.ts†L1-L69】【F:tests/auth-navigation.spec.ts†L1-L24】
- Tombol Google Sign-In pada halaman masuk memerlukan provider Google diaktifkan di Firebase Auth; tanpa itu Firebase akan mengembalikan error yang ditangani sebagai toast kegagalan.【F:components/forms/signin-form.tsx†L57-L86】

## Roadmap / Ekstensi

- Integrasi pembayaran riil (Midtrans/Xendit/Stripe).
- Role admin untuk manajemen preset & audit kredit.
- Rate limiting untuk endpoint job.
- Shareable public gallery & watermark brand kit lanjut.
