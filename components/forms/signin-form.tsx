"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import Link from "next/link";
import { useState } from "react";
import { getClientAuth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter")
});

type FormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const auth = getClientAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Berhasil masuk");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      let message = "Gagal masuk. Periksa email/password Anda.";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
          message = "Email atau password salah.";
        } else if (error.code === "auth/user-not-found") {
          message = "Akun tidak ditemukan. Silakan daftar terlebih dahulu.";
        } else {
          message = error.message;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Berhasil masuk dengan Google");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Tidak dapat masuk dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="anda@umkm.com" autoComplete="email" {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between text-sm">
        <Link href="/signup" className="text-brand hover:underline">
          Belum punya akun?
        </Link>
        <Link href="/reset-password" className="text-muted-foreground hover:text-foreground">
          Lupa password
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}<span className="ml-2">Masuk</span>
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}<span className="ml-2">Masuk dengan Google</span>
      </Button>
    </form>
  );
}
