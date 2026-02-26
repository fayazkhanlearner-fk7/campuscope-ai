import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroPattern from "@/assets/hero-pattern.jpg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img src={heroPattern} alt="Face recognition" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/60" />
        <div className="relative z-10 px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-4 tracking-tight">AttendAI</h1>
            <p className="text-lg text-primary-foreground/80 max-w-md mx-auto leading-relaxed">
              Join the next generation of smart attendance management.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AttendAI</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Create account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign up to get started</p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50"
            >
              {loading ? "Creating account…" : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
