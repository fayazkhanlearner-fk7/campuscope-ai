import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

const NotFound = forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate();

  return (
    <div ref={ref} className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-6xl font-bold gradient-text mb-3">404</h1>
        <p className="text-lg font-medium text-foreground mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 rounded-xl gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </button>
      </motion.div>
    </div>
  );
});

NotFound.displayName = "NotFound";

export default NotFound;
