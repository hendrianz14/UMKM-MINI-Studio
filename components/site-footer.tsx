import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand/10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.24),_transparent_70%)]">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Konten profesional untuk produk UMKM hanya dalam hitungan menit. Didukung AI, template modern, dan integrasi workflow.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand/80">Produk</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/generate" className="transition hover:text-brand-foreground">
                Generate Konten
              </Link>
            </li>
            <li>
              <Link href="/edit" className="transition hover:text-brand-foreground">
                Editor Template
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="transition hover:text-brand-foreground">
                Galeri
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand/80">Dukungan</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="mailto:support@umkm-mini.studio" className="transition hover:text-brand-foreground">
                Email support
              </a>
            </li>
            <li>
              <Link href="/settings" className="transition hover:text-brand-foreground">
                Pengaturan Akun
              </Link>
            </li>
            <li>
              <a href="https://status.umkm-mini.studio" className="transition hover:text-brand-foreground">
                Status Layanan
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand/10 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UMKM MINI STUDIO. All rights reserved.
      </div>
    </footer>
  );
}
