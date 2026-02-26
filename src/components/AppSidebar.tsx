import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Shield,
  Bell,
  Activity,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const adminLinks = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Attendance", icon: Camera, path: "/attendance" },
  { title: "Students", icon: Users, path: "/students" },
  { title: "Faculty", icon: UserCog, path: "/faculty" },
  { title: "Classes", icon: BookOpen, path: "/classes" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Activity Log", icon: Activity, path: "/activity" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const studentLinks = [
  { title: "My Dashboard", icon: LayoutDashboard, path: "/student" },
  { title: "My Attendance", icon: GraduationCap, path: "/student/attendance" },
  { title: "Notifications", icon: Bell, path: "/student/notifications" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, signOut } = useAuth();

  const isAdmin = roles.includes("admin") || roles.includes("faculty");
  const links = isAdmin ? adminLinks : studentLinks;
  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const roleLabel = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : "User";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ background: "var(--gradient-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-bg">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">
              AttendAI
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">
              Smart Attendance
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <link.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{link.title}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">
                {roleLabel}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={async () => { await signOut(); navigate("/login"); }}
              className="text-sidebar-foreground/60 hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle - hidden on mobile */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <svg
          className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
}
