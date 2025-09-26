import { AuthCard } from "@/components/auth-card";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="Kami akan mengirim tautan reset password ke email Anda."
      illustration={
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            Pastikan email aktif dan cek folder spam bila belum menerima pesan.
          </p>
        </motion.div>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
