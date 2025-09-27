"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { TEMPLATE_PRESETS } from "@/data/templates";
import { Badge } from "@/ui/badge";
import Image from "next/image";
import { Button } from "@/ui/button";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { useSearchParams } from "next/navigation";
import type { GalleryItem } from "@/lib/types";
import { storage } from "@/lib/firebase";

type GalleryResponse = {
  items: GalleryItem[];
  nextCursor: string | null;
};

export default function EditPage() {
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(TEMPLATE_PRESETS[0]?.id ?? null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tone, setTone] = useState(60);
  const [luxury, setLuxury] = useState(40);

  useEffect(() => {
    const prefetched = sessionStorage.getItem("umkm-mini-studio-edit-image");
    if (prefetched) {
      setSelectedImage(prefetched);
      setPreviewImage(prefetched);
      setLocalPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      sessionStorage.removeItem("umkm-mini-studio-edit-image");
    }
  }, [searchParams]);

  useEffect(
    () => () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    },
    [localPreviewUrl]
  );

  const isBlobPreview = previewImage?.startsWith("blob:") || previewImage?.startsWith("data:");

  const { data: gallery } = useQuery<GalleryResponse>({
    queryKey: ["gallery", { limit: 12 }],
    queryFn: () => apiFetch<GalleryResponse>("/api/outputs?limit=12"),
    staleTime: 1000 * 60
  });

  const onDrop = (accepted: File[]) => {
    const image = accepted[0];
    if (!image) return;
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const fileId = crypto.randomUUID();
    const today = new Date();
    const path = `uploads/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${fileId}-${image.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, image, { contentType: image.type });
    setUploading(true);
    setSelectedImage(null);
    const objectUrl = URL.createObjectURL(image);
    setPreviewImage(objectUrl);
    setLocalPreviewUrl(objectUrl);

    uploadTask.on(
      "state_changed",
      undefined,
      (error) => {
        console.error(error);
        toast.error("Gagal mengunggah gambar");
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setSelectedImage(url);
        setPreviewImage(url);
        setLocalPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return null;
        });
        toast.success("Gambar siap diedit");
        setUploading(false);
      }
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const startEditJob = async () => {
    if (!selectedTemplate) {
      toast.error("Pilih template terlebih dahulu");
      return;
    }
    if (!selectedImage) {
      toast.error("Unggah atau pilih gambar dari galeri");
      return;
    }

    try {
      const response = await apiFetch<{ jobId: string }>("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          imagePath: selectedImage,
          productName: "Template Edit",
          description: "Proses template preset",
          style: selectedTemplate,
          jobType: "edit",
          options: {
            templateId: selectedTemplate,
            tone,
            luxury
          }
        })
      });
      toast.success(`Job edit #${response.jobId} dikirim ke studio`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim job edit");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Template Design Siap Pakai</CardTitle>
          <CardDescription>Pilih template favorit lalu unggah gambar untuk diproses dengan brand kit Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {TEMPLATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedTemplate(preset.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedTemplate === preset.id ? "border-brand ring-2 ring-brand/60" : "border-muted"
                }`}
              >
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <Image src={preset.preview} alt={preset.name} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                  </div>
                  <Badge variant="secondary">{preset.category}</Badge>
                </div>
              </button>
            ))}
          </div>

          <div
            {...getRootProps()}
            className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
              isDragActive ? "border-brand bg-brand/10" : "border-muted"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-3 h-8 w-8 text-brand" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Lepaskan file di sini" : "Tarik & letakkan gambar atau klik untuk memilih"}
            </p>
            <p className="text-xs text-muted-foreground">Atau pilih dari galeri di sebelah kanan.</p>
            {uploading && <p className="mt-2 text-xs text-muted-foreground">Mengunggah...</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption Tuner</label>
              <input type="range" min={0} max={100} value={tone} onChange={(event) => setTone(Number(event.target.value))} />
              <p className="text-xs text-muted-foreground">{tone < 50 ? "Narasi formal" : tone > 50 ? "Narasi kasual" : "Seimbang"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nuansa Visual</label>
              <input
                type="range"
                min={0}
                max={100}
                value={luxury}
                onChange={(event) => setLuxury(Number(event.target.value))}
              />
              <p className="text-xs text-muted-foreground">{luxury < 50 ? "Simple" : luxury > 50 ? "Luxury" : "Seimbang"}</p>
            </div>
          </div>

          <Button type="button" onClick={startEditJob} disabled={uploading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" /> Proses Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galeri & Pratinjau</CardTitle>
          <CardDescription>Pilih gambar dari hasil sebelumnya atau lihat pratinjau.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewImage ? (
            <div className="overflow-hidden rounded-xl border bg-muted">
              <div className="relative aspect-square w-full md:aspect-video">
                {previewImage && isBlobPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewImage} alt="Terpilih" className="h-full w-full object-contain" />
                  </>
                ) : previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Terpilih"
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 600px, 100vw"
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada gambar terpilih.</p>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {gallery?.items?.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedImage(item.imageUrl);
                  setPreviewImage(item.imageUrl);
                  setLocalPreviewUrl((current) => {
                    if (current) {
                      URL.revokeObjectURL(current);
                    }
                    return null;
                  });
                }}
                className={`group overflow-hidden rounded-lg border ${selectedImage === item.imageUrl ? "border-brand" : "border-transparent"}`}
              >
                <div className="relative h-24 w-full">
                  <Image src={item.imageUrl} alt={item.title ?? "Output"} fill className="object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-2 text-left">
                  <p className="text-xs font-medium truncate">{item.title ?? "Output"}</p>
                  <p className="text-[10px] text-muted-foreground">{item.createdAt?.split("T")[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
