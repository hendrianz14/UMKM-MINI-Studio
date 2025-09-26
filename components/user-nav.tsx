"use client";

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

export function UserNav({ user }: { user: User }) {
  const { data: session } = useSession();
  const displayName = session?.displayName ?? user.displayName ?? "UMKM Creator";
  const email = session?.email ?? user.email ?? "-";
  const photoURL = session?.photoURL ?? user.photoURL ?? undefined;
  const initials = displayName?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "U";

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
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/generate">Generate</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/edit">Editor</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/gallery">Gallery</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
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
