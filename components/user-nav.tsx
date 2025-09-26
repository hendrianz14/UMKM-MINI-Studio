"use client";

import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import Link from "next/link";
import type { User } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/ui/button";
import { useSession } from "@/lib/hooks/use-session";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Separator } from "@/ui/separator";

export function UserNav({ user }: { user: User }) {
  const { data: session } = useSession();
  const displayName = session?.displayName ?? user.displayName ?? "UMKM Creator";
  const email = session?.email ?? user.email ?? "-";
  const photoURL = session?.photoURL ?? user.photoURL ?? undefined;
  const initials = displayName?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "U";
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/generate", label: "Generate" },
      { href: "/edit", label: "Editor" },
      { href: "/gallery", label: "Gallery" },
      { href: "/settings", label: "Settings" }
    ],
    []
  );

  const handleSignOut = async () => {
    await signOut(getClientAuth());
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  if (isMobile) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={photoURL ?? undefined} alt={displayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-xl border border-border bg-background p-0">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={photoURL ?? undefined} alt={displayName ?? "Avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{displayName}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
          <nav className="flex flex-col px-2 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
                onClick={handleClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator className="mx-4" />
          <div className="px-4 py-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={photoURL ?? undefined} alt={displayName ?? "Avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{displayName}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
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
            await signOut(getClientAuth());
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
