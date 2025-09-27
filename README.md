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

### Mode Demo Tanpa Login

Untuk kebutuhan demo atau pengambilan screenshot tanpa kredensial Firebase, aktifkan mode demo dengan menambahkan variabel berikut
ke `.env.local`:

```
NEXT_PUBLIC_DEMO_MODE=true
```

Mode ini menyediakan sesi pengguna fiktif sehingga seluruh navigasi dashboard dapat diakses tanpa proses sign-in. Pastikan untuk menonaktifkannya pada lingkungan produksi.

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

## Roadmap / Ekstensi

- Integrasi pembayaran riil (Midtrans/Xendit/Stripe).
- Role admin untuk manajemen preset & audit kredit.
- Rate limiting untuk endpoint job.
- Shareable public gallery & watermark brand kit lanjut.
