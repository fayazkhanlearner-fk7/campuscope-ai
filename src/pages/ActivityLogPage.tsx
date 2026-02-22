import { motion } from "framer-motion";
import { Activity, Camera, Shield, User, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { activityLogs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  attendance: Camera,
  admin: Shield,
  auth: User,
  system: Settings,
};

export default function ActivityLogPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">System events and audit trail</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="divide-y divide-border">
          {activityLogs.map((log, i) => {
            const Icon = iconMap[log.type] || Activity;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  log.type === "attendance" && "bg-success/10 text-success",
                  log.type === "admin" && "bg-primary/10 text-primary",
                  log.type === "auth" && "bg-info/10 text-info",
                  log.type === "system" && "bg-warning/10 text-warning"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">by {log.performedBy}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
