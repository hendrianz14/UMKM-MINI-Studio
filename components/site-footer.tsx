import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Konten profesional untuk produk UMKM hanya dalam hitungan menit. Didukung AI, template modern, dan integrasi workflow.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Produk</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/generate" className="hover:text-foreground">
                Generate Konten
              </Link>
            </li>
            <li>
              <Link href="/edit" className="hover:text-foreground">
                Editor Template
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-foreground">
                Galeri
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Dukungan</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="mailto:support@umkm-mini.studio" className="hover:text-foreground">
                Email support
              </a>
            </li>
            <li>
              <Link href="/settings" className="hover:text-foreground">
                Pengaturan Akun
              </Link>
            </li>
            <li>
              <a href="https://status.umkm-mini.studio" className="hover:text-foreground">
                Status Layanan
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UMKM MINI STUDIO. All rights reserved.
      </div>
    </footer>
  );
}
