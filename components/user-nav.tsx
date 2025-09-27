"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";
import { Separator } from "@/ui/separator";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils/cn";

type UserNavProps = {
  user: User;
  profile?: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  className?: string;
};

export function UserNav({ user, profile, className }: UserNavProps) {
  const [open, setOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/generate", label: "Generate" },
      { href: "/edit", label: "Edit" },
      { href: "/gallery", label: "Gallery" },
      { href: "/settings", label: "Settings" },
      { href: "/topup", label: "Topup" }
    ],
    []
  );

  const resolvedDisplayName =
    profile?.displayName ??
    user.displayName ??
    (user.email ? user.email.split("@")[0] ?? "UMKM Creator" : "UMKM Creator");
  const resolvedEmail = profile?.email ?? user.email ?? "-";
  const photoURL = profile?.photoURL ?? user.photoURL ?? undefined;
  const initials = resolvedDisplayName?.[0]?.toUpperCase() ?? resolvedEmail?.[0]?.toUpperCase() ?? "U";

  const handleSignOut = async () => {
    await signOut(auth);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 md:hidden"
            aria-label="Buka menu profil"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={photoURL} alt={resolvedDisplayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex h-full w-80 flex-col overflow-y-auto px-0 py-0">
          <SheetHeader className="border-b px-6 py-4 text-left">
            <SheetTitle className="text-base font-semibold">UMKM MINI STUDIO</SheetTitle>
            <p className="text-sm text-muted-foreground">{resolvedDisplayName}</p>
            <p className="text-xs text-muted-foreground">{resolvedEmail}</p>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator className="mx-4" />
          <div className="px-4 py-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative hidden h-10 w-10 rounded-full p-0 md:inline-flex">
            <Avatar className="h-9 w-9">
              <AvatarImage src={photoURL} alt={resolvedDisplayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{resolvedDisplayName}</span>
              <span className="text-xs text-muted-foreground">{resolvedEmail}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navItems.map((item) => (
            <DropdownMenuItem asChild key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async (event) => {
              event.preventDefault();
              await signOut(auth);
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
