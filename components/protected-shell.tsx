"use client";

import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/ensureUserProfile";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { data: profile, displayName, loading: profileLoading, error: profileError } = useUserProfile(user);
  const initRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      initRef.current = false;
      return;
    }
    if (initRef.current) return;
    initRef.current = true;
    void ensureUserProfile(user.uid, user.email ?? "", user.displayName ?? "");
  }, [user]);

  if (loading || profileLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-foreground">
            <span className="block text-sm md:hidden">UMKM MINI STUDIO</span>
            <span className="hidden md:inline-flex">
              <Logo className="text-base" />
            </span>
          </Link>
          <nav className="hidden items-center space-x-3 text-sm text-muted-foreground md:flex">
            <Link href="/generate" className="hover:text-foreground">
              Generate
            </Link>
            <Link href="/edit" className="hover:text-foreground">
              Editor
            </Link>
            <Link href="/gallery" className="hover:text-foreground">
              Galeri
            </Link>
            <Link href="/topup" className="hover:text-foreground">
              Top-up
            </Link>
          </nav>
          <UserNav
            user={user}
            profile={{
              displayName,
              email: profile?.email ?? user.email ?? null,
              photoURL: profile?.photoURL ?? user.photoURL ?? null
            }}
          />
        </div>
      </header>
      <main className="container mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-8">
        {profileError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            Gagal memuat profil: {profileError instanceof Error ? profileError.message : String(profileError)}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
