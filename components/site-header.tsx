"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { useMemo } from "react";
import { UserNav } from "./user-nav";
import { useAuthState } from "react-firebase-hooks/auth";
import { getClientAuth } from "@/lib/firebase/client";

export function SiteHeader() {
  const t = useI18n();
  const auth = getClientAuth();
  const [user] = useAuthState(auth);

  const navItems = useMemo(
    () => [
      { href: "#features", label: t["nav.features"] },
      { href: "#pricing", label: t["nav.pricing"] }
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-6">
          <Logo className="text-base sm:text-lg" />
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground transition hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          {user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/signin">{t["nav.signIn"]}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t["nav.signUp"]}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
