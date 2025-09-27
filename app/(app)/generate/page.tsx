"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { toast } from "sonner";
import { Upload, Sparkles, Copy } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { StudioJob } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { storage, auth } from "@/lib/firebase";

const formSchema = z.object({
  productName: z.string().min(2, "Minimal 2 karakter"),
  description: z.string().min(10, "Deskripsikan produk Anda"),
  style: z.string().min(1, "Pilih style")
});

type FormValues = z.infer<typeof formSchema>;

type JobResponse = StudioJob & {
  result?: {
    imageUrl: string;
    captions: string[];
    hashtags: string[];
  };
};

const styles = [
  { id: "rustic", label: "Rustic Food" },
  { id: "modern", label: "Modern Minimal" },
  { id: "esports", label: "Esports-style" },
  { id: "cafe", label: "Cafe Aesthetic" }
];

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [tone, setTone] = useState<number>(50);
  const [luxury, setLuxury] = useState<number>(50);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { productName: "", description: "", style: "rustic" }
  });

  const onDrop = (accepted: File[]) => {
    const image = accepted[0];
    if (!image) return;
    if (!image.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(image);
    previewUrlRef.current = objectUrl;
    setFile(image);
    setPreview(objectUrl);
    setUploadProgress(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const onSubmit = async (values: FormValues) => {
    if (!file) {
      toast.error("Unggah gambar produk terlebih dahulu");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Sesi berakhir. Silakan masuk kembali.");
      return;
    }

    try {
      const fileId = crypto.randomUUID();
      const today = new Date();
      const path = `uploads/${currentUser.uid}/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${fileId}-${file.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

      await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          (error) => {
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      }).then(async (imageUrl) => {
        const response = await apiFetch<{ jobId: string }>("/api/jobs", {
          method: "POST",
          body: JSON.stringify({
            imagePath: imageUrl,
            productName: values.productName,
            description: values.description,
            style: values.style,
            jobType: "generate",
            options: {
              tone,
              luxury
            }
          })
        });
        setJobId(response.jobId);
        toast.success("Job berhasil dikirim ke studio");
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah atau mengirim job");
    }
  };

  const { data: jobDetail } = useQuery<JobResponse>({
    queryKey: ["job", jobId],
    queryFn: () => apiFetch<JobResponse>(`/api/jobs/${jobId}`),
    enabled: Boolean(jobId),
    refetchInterval: (data) =>
      data?.status && ["done", "failed"].includes(data.status) ? false : 4000
  });

  const resultCaptions: string[] = jobDetail?.result?.captions ?? [];
  const resultHashtags: string[] = jobDetail?.result?.hashtags ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Generate Konten Produk</CardTitle>
          <CardDescription>Unggah foto produk lalu pilih style untuk diproses oleh studio otomatis kami.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition ${
              isDragActive ? "border-brand bg-brand/10" : "border-muted"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload gambar" />
            <Upload className="mb-3 h-8 w-8 text-brand" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Lepaskan file di sini" : "Tarik & letakkan gambar atau klik untuk memilih"}
            </p>
            <p className="text-xs text-muted-foreground">Maksimal 5MB. Format JPG, PNG.</p>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="mt-2 text-xs text-muted-foreground">Mengunggah {uploadProgress}%</p>
            )}
          </div>

          {preview && (
            <div className="mt-4 rounded-xl border p-3">
              <div className="relative w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={preview}
                  alt="Preview"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-contain"
                  priority
                  unoptimized
                />
              </div>
              <div className="mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Lihat Full Screen</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Preview Gambar</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full">
                      <Image
                        src={preview}
                        alt="Preview Full"
                        width={1920}
                        height={1080}
                        className="h-auto w-full object-contain"
                        priority
                        unoptimized
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="productName">Nama Produk</Label>
              <Input id="productName" placeholder="Contoh: Kopi Susu Gula Aren" {...register("productName")}
                aria-invalid={!!errors.productName}
              />
              {errors.productName && <p className="text-sm text-destructive">{errors.productName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Produk</Label>
              <Textarea id="description" rows={4} placeholder="Ceritakan highlight produk, target audience, dan platform."
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={watch("style")}
                onValueChange={(val) => setValue("style", val as FormValues["style"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.style && <p className="text-sm text-destructive">{errors.style.message}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Caption Tuner: Formal ↔ Kasual</Label>
                <input
                  id="tone"
                  type="range"
                  min={0}
                  max={100}
                  value={tone}
                  onChange={(event) => setTone(Number(event.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{tone < 50 ? "Lebih formal" : tone > 50 ? "Lebih kasual" : "Seimbang"}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="luxury">Nuansa: Simple ↔ Luxury</Label>
                <input
                  id="luxury"
                  type="range"
                  min={0}
                  max={100}
                  value={luxury}
                  onChange={(event) => setLuxury(Number(event.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{luxury < 50 ? "Lebih simple" : luxury > 50 ? "Lebih luxury" : "Seimbang"}</p>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Sparkles className="mr-2 h-4 w-4" /> Generate Konten
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-brand/40">
        <CardHeader>
          <CardTitle>Status Job</CardTitle>
          <CardDescription>Lihat progres pemrosesan dan hasil konten.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobId ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Job ID</span>
                <Badge variant="outline">{jobId}</Badge>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                Status: {jobDetail?.status ?? "waiting"}
              </div>
              {jobDetail?.result?.imageUrl && (
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={jobDetail.result.imageUrl}
                    alt="Hasil"
                    width={480}
                    height={360}
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
              {resultCaptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Caption</p>
                  {resultCaptions.map((caption) => (
                    <div key={caption} className="rounded-md border bg-muted/40 p-3 text-sm">
                      {caption}
                    </div>
                  ))}
                </div>
              )}
              {resultHashtags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Hashtag</p>
                  <div className="flex flex-wrap gap-2">
                    {resultHashtags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {jobDetail?.status === "done" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const text = `${resultCaptions.join("\n\n")}\n\n${resultHashtags.map((tag) => `#${tag}`).join(" ")}`;
                    navigator.clipboard.writeText(text);
                    toast.success("Caption & hashtag disalin");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Salin caption & hashtag
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada job aktif. Isi form untuk mulai generate.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
