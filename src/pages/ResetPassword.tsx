import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    // Also check URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setIsRecovery(true);

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      navigate("/login");
    }
  };

  if (!isRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <button onClick={() => navigate("/login")} className="mt-4 text-primary hover:underline text-sm font-medium">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">AttendAI</span>
        </div>

        <h2 className="text-2xl font-bold text-foreground">Set new password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter your new password below</p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50"
          >
            {loading ? "Updating…" : <>Update Password <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
