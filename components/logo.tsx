import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 font-semibold text-brand-foreground", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ring-2 ring-inset ring-brand/70">
        <span className="text-lg font-bold text-brand">U</span>
      </span>
      <span className="tracking-wide text-foreground">UMKM MINI STUDIO</span>
    </div>
  );
}
