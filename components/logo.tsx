import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 font-semibold", className)}>
      <span className="h-8 w-8 rounded-lg bg-brand/20 ring-2 ring-brand flex items-center justify-center text-brand-foreground font-bold">
        U
      </span>
      <span>UMKM MINI STUDIO</span>
    </div>
  );
}
