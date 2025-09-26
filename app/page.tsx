'use client';

import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button } from "@/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
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
    title: "Workflow Otomatis Studio",
    description: "Proses generate & edit berjalan otomatis tanpa perlu repot atur integrasi manual.",
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

const beforeAfterItems = [
  {
    title: "Produk Kuliner",
    description: "Foto meja biasa berubah jadi hero shot bergaya resto untuk feed Instagram.",
    before:
      "https://images.unsplash.com/photo-1528716292467-0b57b0d184d6?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1604908177287-429cfdc2c946?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Fashion Lokal",
    description: "Lighting dramatis dan tone biru premium untuk katalog marketplace.",
    before:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Kerajinan Tangan",
    description: "Detail tekstur lebih tajam untuk konten carousel storytelling.",
    before:
      "https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1521572163475-b290a1bca86b?auto=format&fit=crop&w=1200&q=80"
  }
];

function InteractiveHeroMockup() {
  const motionValueX = useMotionValue(0);
  const motionValueY = useMotionValue(0);
  const rotateX = useSpring(useTransform(motionValueY, [-0.5, 0.5], [14, -14]), {
    stiffness: 200,
    damping: 20
  });
  const rotateY = useSpring(useTransform(motionValueX, [-0.5, 0.5], [-18, 18]), {
    stiffness: 200,
    damping: 20
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    motionValueX.set(x / rect.width - 0.5);
    motionValueY.set(y / rect.height - 0.5);
  };

  const resetTilt = () => {
    motionValueX.set(0);
    motionValueY.set(0);
  };

  return (
    <motion.div
      className="group relative aspect-[4/3] w-full max-w-2xl rounded-[2.5rem] border border-brand/20 bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950/80 p-1 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.9)]"
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.2rem]">
        <Image
          src="https://images.unsplash.com/photo-1523365280197-f1783db9fe62?auto=format&fit=crop&w=1600&q=80"
          alt="Mockup konten UMKM"
          fill
          unoptimized
          className="object-cover brightness-[0.55] saturate-125"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/40 via-transparent to-slate-900/80" />
        <motion.div
          className="absolute -right-8 top-16 hidden w-48 rounded-2xl border border-brand/40 bg-background/80 p-4 text-sm text-muted-foreground backdrop-blur-lg md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="font-semibold text-brand-foreground">Preset Night Luxe</p>
          <p>Auto grading & caption siap posting hanya 40 detik.</p>
        </motion.div>
        <motion.div
          className="absolute left-8 bottom-8 hidden items-center gap-3 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand-foreground backdrop-blur md:flex"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Sparkles className="h-4 w-4 text-brand" />
          Mode 3D aktif
        </motion.div>
      </div>
    </motion.div>
  );
}

function BeforeAfterCard({
  before,
  after,
  title,
  description
}: {
  before: string;
  after: string;
  title: string;
  description: string;
}) {
  const [value, setValue] = useState(60);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand/20 bg-secondary/60 shadow-[0_20px_60px_-40px_rgba(37,99,235,0.95)] backdrop-blur">
      <div className="relative h-72 w-full overflow-hidden">
        <Image src={after} alt={`${title} sesudah`} fill unoptimized className="object-cover" />
        <div
          className="absolute inset-0 overflow-hidden border-r border-brand/40"
          style={{ width: `${value}%` }}
        >
          <Image src={before} alt={`${title} sebelum`} fill unoptimized className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/60" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
          Before
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-brand/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-foreground">
          After
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-brand/40 bg-background/80 px-4 py-2 backdrop-blur">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Geser</span>
          <input
            className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-muted accent-brand"
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(Number(event.target.value))}
            aria-label="Perbandingan before after"
          />
        </div>
      </div>
      <div className="space-y-2 p-6">
        <h3 className="text-lg font-semibold text-brand-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-brand/10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent_65%)] pb-24 pt-32">
          <div className="absolute -left-1/4 top-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-900/50 blur-3xl" />
          <div className="container mx-auto flex flex-col gap-16 px-4 md:flex-row md:items-center">
            <div className="space-y-8 md:w-1/2">
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Studio AI Gelap Elegan
              </motion.span>
              <motion.h1
                className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Bikin Konten Produk Estetik dengan Tone Biru Premier
              </motion.h1>
              <motion.p
                className="max-w-xl text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                UMKM MINI STUDIO menghadirkan workflow kreatif dari styling, editing 3D, hingga caption otomatis. Semua terinspirasi palet biru gelap yang memukau feed sosial dan marketplace Anda.
              </motion.p>
              <motion.div
                className="flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button asChild size="lg">
                  <Link href="/signup">Mulai Gratis</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-brand/40 bg-transparent text-brand-foreground hover:bg-brand/10">
                  <Link href="#gallery">Lihat Transformasi</Link>
                </Button>
              </motion.div>
              <motion.div
                className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="rounded-2xl border border-brand/20 bg-secondary/70 p-4">
                  <p className="font-semibold text-brand-foreground">Realtime AI Caption</p>
                  <p>Copywriting otomasi dengan tone brand yang konsisten.</p>
                </div>
                <div className="rounded-2xl border border-brand/20 bg-secondary/70 p-4">
                  <p className="font-semibold text-brand-foreground">Preset Gelap Premium</p>
                  <p>Library preset 3D & cinematic siap pakai.</p>
                </div>
              </motion.div>
            </div>
            <div className="relative flex items-center justify-center md:w-1/2">
              <InteractiveHeroMockup />
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-brand/10 bg-secondary/60 py-20 backdrop-blur">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-center text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Fitur Unggulan
            </motion.h2>
            <motion.p
              className="mt-3 text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Semua alat yang Anda butuhkan untuk menghasilkan konten produk profesional dalam satu platform.
            </motion.p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featureItems.map((feature) => (
                <Card key={feature.title} className="border-brand/20 bg-background/60 backdrop-blur">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <feature.icon className="h-6 w-6" />
                    </div>
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

        <section id="gallery" className="border-b border-brand/10 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.2),_transparent_70%)] py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-center text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Preview Before / After
            </motion.h2>
            <motion.p
              className="mt-3 text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Geser slider untuk melihat bagaimana filter biru premier dan AI retouch mengubah tampilan produk Anda.
            </motion.p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {beforeAfterItems.map((item) => (
                <BeforeAfterCard
                  key={item.title}
                  before={item.before}
                  after={item.after}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-brand/10 bg-background py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-center text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Paket Kredit Fleksibel
            </motion.h2>
            <motion.p
              className="mt-3 text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Pilih paket kredit sesuai kebutuhan kontenmu. Upgrade kapan saja.
            </motion.p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.highlight ? "border-brand/40 bg-brand/10 shadow-lg" : "border-brand/20 bg-background/70"}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.highlight && <span className="rounded-full bg-brand px-3 py-1 text-xs text-brand-foreground">Best Value</span>}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <Button asChild size="lg" variant={plan.highlight ? "default" : "outline"} className={plan.highlight ? "" : "border-brand/30 text-brand-foreground hover:bg-brand/10"}>
                      <Link href="/topup">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-brand/10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.25),_transparent_70%)] py-20">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <motion.h2
              className="max-w-3xl text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Siap memukau pelangganmu?
            </motion.h2>
            <motion.p
              className="max-w-2xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Bergabung dengan kreator UMKM lainnya dan produksi konten profesional tanpa repot studio. Mulai dari trial gratis 1x/24 jam.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <Link href="/signup">Daftar &amp; Mulai Generate</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
