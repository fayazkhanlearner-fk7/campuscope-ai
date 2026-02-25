import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { AIChatbot } from "./AIChatbot";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar: on mobile it's an overlay, on desktop it's fixed */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out",
          isMobile && !mobileOpen && "-translate-x-full",
          isMobile && mobileOpen && "translate-x-0"
        )}
      >
        <AppSidebar
          collapsed={isMobile ? false : collapsed}
          onToggle={() => {
            if (isMobile) setMobileOpen(false);
            else setCollapsed(!collapsed);
          }}
        />
      </div>

      {/* Mobile top bar */}
      {isMobile && (
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold gradient-text">AttendAI</span>
        </header>
      )}

      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
      <AIChatbot />
    </div>
  );
}
