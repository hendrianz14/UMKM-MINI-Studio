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
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.3),_transparent_65%)] md:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-brand/10 bg-background/60 p-10 backdrop-blur md:flex">
        <div>
          <h2 className="text-3xl font-bold text-brand-foreground">UMKM MINI STUDIO</h2>
          <p className="mt-3 max-w-md text-muted-foreground">Konten profesional untuk UMKM tanpa ribet studio.</p>
        </div>
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} UMKM MINI STUDIO</div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md border border-brand/20 bg-card/80 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.8)] backdrop-blur">
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
