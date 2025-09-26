import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

export function AuthCard({
  title,
  description,
  illustration,
  children
}: {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-gradient-to-br from-background via-background to-brand/5 md:grid-cols-2">
      <div className="hidden flex-col justify-between border-r bg-background p-10 md:flex">
        <div>
          <h2 className="text-3xl font-bold text-brand">UMKM MINI STUDIO</h2>
          <p className="mt-3 max-w-md text-muted-foreground">Konten profesional untuk UMKM tanpa ribet studio.</p>
        </div>
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} UMKM MINI STUDIO</div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md border-border/70">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            {illustration}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
