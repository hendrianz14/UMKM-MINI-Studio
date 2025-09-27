"use client";

import { getClientAuth } from "@/lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";
import { useSession } from "@/lib/hooks/use-session";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const auth = getClientAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { data: session } = useSession();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const resolvedUser = useMemo(
    () =>
      isDemoMode
        ? { displayName: "Demo Creator", email: "demo@umkm-mini.studio", photoURL: null }
        : user,
    [isDemoMode, user]
  );

  useEffect(() => {
    if (!isDemoMode && !loading && !user) {
      router.replace("/signin");
    }
  }, [isDemoMode, loading, router, user]);

  if (!isDemoMode && (loading || !user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
      </div>
    );
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
            {resolvedUser && <UserNav user={resolvedUser} />}
          </nav>
          <div className="md:hidden">
            <p className="text-xs text-muted-foreground">
              {session?.displayName ?? resolvedUser?.displayName ?? "Creator"}
            </p>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  );
}
