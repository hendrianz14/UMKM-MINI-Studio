"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { useState } from "react";
import { getClientAuth } from "@/lib/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email tidak valid")
});

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm() {
  const auth = getClientAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Email reset password dikirim");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim email reset password");
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}<span className="ml-2">Kirim tautan reset</span>
      </Button>
    </form>
  );
}
