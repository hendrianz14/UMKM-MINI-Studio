"use client";

import { useSession } from "@/lib/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { getClientAuth } from "@/lib/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";

export default function SettingsPage() {
  const { data: session } = useSession();
  const auth = getClientAuth();

  const triggerReset = async () => {
    if (!session?.email) return;
    await sendPasswordResetEmail(auth, session.email);
    toast.success("Email reset password telah dikirim");
  };

  const initials = session?.displayName?.[0]?.toUpperCase() ?? session?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>Kelola informasi akun, kredensial, dan kredit.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.photoURL ?? undefined} alt={session?.displayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{session?.displayName ?? "Creator"}</p>
              <p className="text-sm text-muted-foreground">{session?.email}</p>
              <p className="text-xs text-muted-foreground">Bergabung: {session?.createdAt ? formatDate(session.createdAt) : "-"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={triggerReset}>
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
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Kredit Tersedia</p>
            <p className="text-2xl font-bold">{session?.credits ?? 0}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Trial Terakhir</p>
            <p className="text-2xl font-bold">{session?.lastTrialAt ? formatDate(session.lastTrialAt) : "Belum digunakan"}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Integrasi n8n</p>
            <p className="text-xs text-muted-foreground">Hubungkan workflow untuk otomasi lanjutan.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
