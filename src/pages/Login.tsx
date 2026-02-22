import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";

const roles = [
  { id: "admin", label: "Admin", desc: "Full system access" },
  { id: "faculty", label: "Faculty", desc: "Class management" },
  { id: "student", label: "Student", desc: "View attendance" },
] as const;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("admin");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student") {
      navigate("/student");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img
          src={heroPattern}
          alt="Face recognition technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/60" />
        <div className="relative z-10 px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
              AttendAI
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md mx-auto leading-relaxed">
              Next-generation attendance management powered by facial recognition and artificial intelligence.
            </p>
            <div className="mt-8 flex justify-center gap-8 text-primary-foreground/70 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary-foreground">99.2%</div>
                <div>Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-foreground">2.8K+</div>
                <div>Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-foreground">50ms</div>
                <div>Detection</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AttendAI</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>

          {/* Role Selection */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`rounded-xl border px-3 py-3 text-center transition-all ${
                  role === r.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`text-sm font-semibold ${role === r.id ? "text-primary" : "text-foreground"}`}>
                  {r.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <button type="button" className="text-primary hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: Enter any credentials to explore the system
          </p>
        </motion.div>
      </div>
    </div>
  );
}
