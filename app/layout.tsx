import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { getMessages } from "@/lib/i18n/get-messages";
import { cookies } from "next/headers";
import { defaultLocale } from "@/lib/i18n/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMKM MINI STUDIO",
  description:
    "UMKM MINI STUDIO adalah platform SaaS untuk mengubah foto produk UMKM menjadi konten profesional siap posting dengan AI, template, dan integrasi workflow.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "UMKM MINI STUDIO",
    description:
      "Transformasi foto produk UMKM menjadi konten profesional siap pakai dengan AI styling, caption, dan template.",
    url: "https://umkm-mini-studio.example.com",
    siteName: "UMKM MINI STUDIO",
    locale: "id_ID",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "UMKM MINI STUDIO",
    description:
      "Platform kreatif untuk UMKM membuat konten produk profesional hanya dalam hitungan menit."
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = cookies().get("locale")?.value ?? defaultLocale;
  const messages = getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders messages={messages}>{children}</AppProviders>
      </body>
    </html>
  );
}
