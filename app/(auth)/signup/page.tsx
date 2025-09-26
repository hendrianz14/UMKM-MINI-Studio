import { AuthCard } from "@/components/auth-card";
import { SignUpForm } from "@/components/forms/signup-form";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Buat akun UMKM MINI STUDIO"
      description="Dapatkan 50 credits gratis untuk mulai eksplorasi dan trial 1x/24 jam."
      illustration={
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="rounded-lg bg-brand/10 p-3 text-sm text-brand-foreground">
            Bonus: preset template populer siap pakai untuk feeds dan marketplace Anda.
          </p>
        </motion.div>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
