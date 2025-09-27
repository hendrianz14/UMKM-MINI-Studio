"use client";

import { useState } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";

type NavItem = { href: string; label: string };

type GuestMobileNavProps = {
  navItems: NavItem[];
};

export function GuestMobileNav({ navItems }: GuestMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 md:hidden"
          aria-label="Buka menu navigasi"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-[0.65rem] font-semibold uppercase">UM</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex h-full w-72 flex-col overflow-y-auto px-0 py-0">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle className="text-base font-semibold">UMKM MINI STUDIO</SheetTitle>
          <p className="text-xs text-muted-foreground">Masuk untuk mengakses dashboard & fitur kreatif.</p>
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
        <div className="grid gap-2 px-4 py-4">
          <Button asChild size="sm" onClick={() => setOpen(false)}>
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="outline" onClick={() => setOpen(false)}>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

