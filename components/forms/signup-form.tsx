"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(2, "Minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Minimal 6 karakter")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"]
  });

type FormValues = z.infer<typeof formSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(user, { displayName: values.name });

      try {
        await setDoc(doc(db, "users", user.uid), {
          displayName: values.name,
          email: values.email,
          photoURL: user.photoURL ?? null,
          credits: 50,
          lastTrialAt: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (firestoreError) {
        console.error(firestoreError);
        toast.warning("Akun dibuat, namun data profil belum tersimpan. Silakan lengkapi di pengaturan setelah masuk.");
      }

      toast.success("Akun berhasil dibuat");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      let message = "Gagal membuat akun. Silakan coba lagi.";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          message = "Email sudah terdaftar. Silakan gunakan email lain atau masuk.";
        } else if (error.code === "auth/weak-password") {
          message = "Password terlalu lemah. Gunakan kombinasi minimal 6 karakter.";
        } else {
          message = error.message;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" placeholder="Nama brand" {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="anda@umkm.com" autoComplete="email" {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <p className="text-sm text-muted-foreground">
        Dengan mendaftar Anda menyetujui <Link href="#" className="text-brand hover:underline">Ketentuan Layanan</Link> kami.
      </p>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}<span className="ml-2">Buat Akun</span>
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun? <Link href="/signin" className="text-brand hover:underline">Masuk</Link>
      </p>
    </form>
  );
}
