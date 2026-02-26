import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "faculty" | "student")[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = roles.some((r) => allowedRoles.includes(r));
    if (!hasAccess) return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
