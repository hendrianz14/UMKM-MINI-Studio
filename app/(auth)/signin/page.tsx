'use client';

import { AuthCard } from "@/components/auth-card";
import { SignInForm } from "@/components/forms/signin-form";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <AuthCard
      title="Masuk ke UMKM MINI STUDIO"
      description="Kelola konten produk dengan dashboard kreatif yang terintegrasi."
      illustration={
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            Akses generate, editor template, dan galeri hanya dengan beberapa klik.
          </p>
        </motion.div>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
