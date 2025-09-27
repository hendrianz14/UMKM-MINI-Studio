"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { auth } from "@/lib/firebase";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { formatDate, formatDateTime } from "@/lib/utils/format";

export default function SettingsPage() {
  const [user, authLoading] = useAuthState(auth);
  const { data: profile, displayName, createdAtDate, lastTrialAtDate, loading: profileLoading, error } = useUserProfile(user);

  const handleResetPassword = async () => {
    const email = profile?.email ?? user?.email;
    if (!email) {
      toast.error("Email akun tidak tersedia.");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    toast.success("Email reset password telah dikirim");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Memuat profil...</p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">Silakan masuk untuk melihat pengaturan akun.</p>;
  }

  const initials = displayName?.[0]?.toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";
  const credits = profile?.credits ?? 0;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Gagal memuat data profil: {error instanceof Error ? error.message : String(error)}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>Kelola informasi akun, kredensial, dan kredit.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={(profile?.photoURL ?? user.photoURL) ?? undefined} alt={displayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{displayName || "Creator"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email ?? user.email ?? "-"}</p>
              <p className="text-xs text-muted-foreground">Bergabung: {createdAtDate ? formatDateTime(createdAtDate) : "-"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleResetPassword}>
              Kirim Reset Password
            </Button>
            <Button asChild>
              <Link href="/topup">Kelola Kredit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kredit</CardTitle>
          <CardDescription>Ringkasan pemakaian kredit dan trial.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Kredit Tersedia</p>
            <p className="text-2xl font-bold">{credits}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Trial Terakhir</p>
            <p className="text-2xl font-bold">
              {lastTrialAtDate ? formatDate(lastTrialAtDate) : "Belum digunakan"}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">ID Akun</p>
            <p className="break-all text-2xl font-bold">{user.uid}</p>
            <p className="text-xs text-muted-foreground">Gunakan ID ini saat butuh bantuan tim support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
