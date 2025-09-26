"use client";

import { CREDIT_PACKAGES } from "@/data/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/ui/badge";

export default function TopupPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMockPayment = async (id: string, credits: number) => {
    try {
      setLoadingId(id);
      await apiFetch("/api/topup/mock", {
        method: "POST",
        body: JSON.stringify({ credits })
      });
      toast.success(`+${credits} kredit berhasil ditambahkan`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan kredit");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top-up Kredit</CardTitle>
          <CardDescription>Pilih paket kredit sesuai kebutuhan konten. Pembayaran mock tersedia untuk testing.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg, index) => (
          <Card key={pkg.id} className={index === 1 ? "border-brand shadow-lg" : "border-border"}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pkg.name}
                {index === 1 && <Badge variant="default">Promo</Badge>}
              </CardTitle>
              <CardDescription>{formatCurrency(pkg.price)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{pkg.credits} kredit • {pkg.bonus}</p>
              <Button
                className="w-full"
                onClick={() => handleMockPayment(pkg.id, pkg.credits)}
                disabled={loadingId === pkg.id}
              >
                {loadingId === pkg.id ? "Memproses..." : "Mark as Paid"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integrasi Pembayaran</CardTitle>
          <CardDescription>Siapkan webhook untuk Midtrans, Xendit, atau Stripe dengan struktur JSON berikut:</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`{
  "orderId": "TOPUP-123",
  "userId": "<uid>",
  "credits": 150,
  "signature": "<hmac>"
}`}
          </pre>
          <p className="mt-2 text-sm text-muted-foreground">
            Gunakan Google Secret Manager untuk menyimpan API key payment gateway dan update endpoint callback sesuai kebutuhan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
