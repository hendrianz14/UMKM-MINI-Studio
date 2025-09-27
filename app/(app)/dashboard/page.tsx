"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, Clock, CreditCard, Sparkles, User as UserIcon, Calendar } from "lucide-react";

import { apiFetch } from "@/lib/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { auth } from "@/lib/firebase";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import type { StudioJob } from "@/lib/types";

export default function DashboardPage() {
  const [user, authLoading] = useAuthState(auth);
  const {
    data: profile,
    displayName,
    createdAtDate,
    lastTrialAtDate,
    loading: profileLoading,
    error
  } = useUserProfile(user ?? null);

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", { limit: 5 }],
    queryFn: () => apiFetch<{ items: StudioJob[] }>("/api/jobs?limit=5"),
    enabled: !!user
  });

  const trialAvailable = useMemo(() => {
    if (!lastTrialAtDate) return true;
    const diff = Date.now() - lastTrialAtDate.getTime();
    return diff > 24 * 60 * 60 * 1000;
  }, [lastTrialAtDate]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Memuat data dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">Silakan masuk untuk mengakses dashboard.</p>;
  }

  const credits = profile?.credits ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Selamat datang kembali, {displayName || "Creator"}</h1>
          <p className="text-muted-foreground">Kelola generate konten, template, dan galeri dari satu dashboard.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/generate">
              Generate Konten <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/edit">Buka Editor</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Gagal memuat profil: {error instanceof Error ? error.message : String(error)}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Kredit Tersedia</CardTitle>
              <CardDescription>Kredit digunakan untuk generate & edit.</CardDescription>
            </div>
            <CreditCard className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-bold">{credits}</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/topup">Top-up</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Nama Akun</CardTitle>
              <CardDescription>Profil singkat akun Anda.</CardDescription>
            </div>
            <UserIcon className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">{displayName || "Creator"}</p>
            <p className="text-muted-foreground">{profile?.email ?? user.email ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tanggal Dibuat</CardTitle>
              <CardDescription>Riwayat bergabung ke UMKM Mini Studio.</CardDescription>
            </div>
            <Calendar className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {createdAtDate ? formatDateTime(createdAtDate) : "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Status Trial</CardTitle>
              <CardDescription>1x trial setiap 24 jam.</CardDescription>
            </div>
            <Clock className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent>
            {trialAvailable ? (
              <Badge variant="default" className="bg-brand text-brand-foreground">
                Trial tersedia
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">
                Trial berikutnya tersedia setelah {lastTrialAtDate ? formatDateTime(lastTrialAtDate) : "-"}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tips Konten</CardTitle>
              <CardDescription>Gunakan Caption Pro & Template.</CardDescription>
            </div>
            <Sparkles className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coba fitur Caption Tuner untuk menyesuaikan tone formal atau kasual sesuai persona brand.
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Riwayat generate & edit terakhir.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/gallery">Lihat semua</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat aktivitas...
            </div>
          ) : jobs?.items.length ? (
            <div className="space-y-4">
              {jobs.items.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">{job.input?.productName ?? "Job"}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.type} • {job.status} • {job.createdAt ? formatDate(job.createdAt) : "-"}
                    </p>
                  </div>
                  <Badge variant={job.status === "done" ? "default" : job.status === "failed" ? "outline" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada aktivitas. Mulai generate konten pertama Anda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
