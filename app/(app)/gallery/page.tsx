"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import Image from "next/image";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { ArrowUpRight, Download, Trash2, Copy } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/lib/types";

type OutputsResponse = {
  items: GalleryItem[];
  nextCursor: string | null;
};

export default function GalleryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<OutputsResponse>({
    queryKey: ["outputs", { limit: 24 }],
    queryFn: () => apiFetch<OutputsResponse>("/api/outputs?limit=24")
  });

  const removeItem = async (id: string) => {
    await apiFetch(`/api/outputs/${id}`, { method: "DELETE" });
    toast.success("Item dihapus");
    queryClient.invalidateQueries({ queryKey: ["outputs", { limit: 24 }] });
  };

  const duplicateToEditor = (imageUrl: string) => {
    sessionStorage.setItem("umkm-mini-studio-edit-image", imageUrl);
    router.push("/edit?source=gallery");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Galeri Konten</CardTitle>
          <CardDescription>Kelola hasil generate dan edit, unduh atau lanjutkan editing.</CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat galeri...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items?.map((item) => {
            const title = item.title ?? "Output";
            const createdAt = item.createdAt ? formatDate(item.createdAt) : "";

            return (
              <Card key={item.id} className="overflow-hidden border-border/70">
                <div className="relative h-52 w-full">
                  <Image src={item.imageUrl} alt={title} fill className="object-cover" />
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-muted-foreground">{createdAt}</p>
                    </div>
                    <Badge variant="outline">{item.tags?.[0] ?? "AI"}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(item.imageUrl, "_blank")?.focus()}>
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Lihat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = item.imageUrl;
                        link.download = title;
                        link.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" /> Unduh
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => duplicateToEditor(item.imageUrl)}>
                      <Copy className="mr-2 h-4 w-4" /> Ke Editor
                    </Button>
                    <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
