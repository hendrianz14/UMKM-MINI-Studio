'use client';

import { Button } from "@/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { Sparkles, Workflow, Palette, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import Image from "next/image";

const featureItems = [
  {
    title: "Auto Caption & Hashtag Pro",
    description: "AI copywriting membuat caption profesional dengan nada merek dan hashtag siap posting.",
    icon: Sparkles
  },
  {
    title: "Template Design Siap Pakai",
    description: "Puluhan preset desain seperti Rustic Food hingga Esports-style yang dapat langsung digunakan.",
    icon: Palette
  },
  {
    title: "Integrasi Workflow n8n",
    description: "Otomasi proses kreatif Anda melalui webhook ke alur kerja n8n yang fleksibel.",
    icon: Workflow
  },
  {
    title: "Credits & Trial Fair Usage",
    description: "Kelola budget dengan paket kredit fleksibel dan trial 1x/24 jam yang adil.",
    icon: BadgeCheck
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Rp99rb",
    description: "50 credits + 5 preset favorit",
    cta: "Mulai Starter",
    highlight: false
  },
  {
    name: "Pro",
    price: "Rp249rb",
    description: "150 credits, akses template premium, caption tuner",
    cta: "Paket Pro",
    highlight: true
  },
  {
    name: "Business",
    price: "Rp699rb",
    description: "500 credits, brand kit, watermark custom, support prioritas",
    cta: "Skala Bisnis",
    highlight: false
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col gap-12 px-4 pb-16 pt-24 md:flex-row md:items-center">
          <div className="space-y-6 md:w-1/2">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ubah Foto Produk Jadi Konten Profesional Siap Viral
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              UMKM MINI STUDIO memadukan AI styling, template desain, caption otomatis, dan integrasi n8n untuk mempercepat
              produksi konten pemasaran Anda.
            </motion.p>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <Link href="/signup">Mulai Gratis</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Lihat Fitur</Link>
              </Button>
            </motion.div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand" />
                Workflow siap n8n
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand" />
                Caption & hashtag otomatis
              </div>
            </div>
          </div>
          <div className="relative md:w-1/2">
            <motion.div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-gradient-to-br from-brand/20 via-transparent to-brand/10 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1523365280197-f1783db9fe62"
                alt="Produk UMKM"
                fill
                unoptimized
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-semibold">Fitur Unggulan</h2>
            <p className="mt-3 text-center text-muted-foreground">
              Semua alat yang Anda butuhkan untuk menghasilkan konten produk profesional dalam satu platform.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featureItems.map((feature) => (
                <Card key={feature.title} className="border-border/70 bg-background/60 backdrop-blur">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className="h-10 w-10 text-brand" />
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-background py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-semibold">Paket Kredit Fleksibel</h2>
            <p className="mt-3 text-center text-muted-foreground">
              Pilih paket kredit sesuai kebutuhan kontenmu. Upgrade kapan saja.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={plan.highlight ? "border-brand shadow-lg" : "border-border"}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.highlight && <span className="rounded-full bg-brand px-3 py-1 text-xs text-brand-foreground">Best Value</span>}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <Button asChild size="lg" variant={plan.highlight ? "default" : "outline"}>
                      <Link href="/topup">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/20 py-20">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="max-w-3xl text-3xl font-semibold">Siap memukau pelangganmu?</h2>
            <p className="max-w-2xl text-muted-foreground">
              Bergabung dengan kreator UMKM lainnya dan produksi konten profesional tanpa repot studio. Mulai dari trial gratis 1x/24 jam.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Daftar & Mulai Generate</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
