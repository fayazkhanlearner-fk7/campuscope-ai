import { motion } from "framer-motion";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

const notifications = [
  { id: "1", type: "warning" as const, title: "Attendance Warning", message: "Your attendance in Operating Systems has dropped below 75%.", time: "2 hours ago" },
  { id: "2", type: "success" as const, title: "Attendance Marked", message: "Your attendance for Data Structures (9:02 AM) was recorded successfully.", time: "5 hours ago" },
  { id: "3", type: "info" as const, title: "Schedule Change", message: "Algorithms class on Thursday has been rescheduled to 2:00 PM.", time: "1 day ago" },
  { id: "4", type: "warning" as const, title: "Low Attendance Alert", message: "You have missed 3 consecutive classes in Database Systems.", time: "2 days ago" },
  { id: "5", type: "info" as const, title: "Report Available", message: "Your January attendance report is ready for download.", time: "5 days ago" },
];

const iconMap = { warning: AlertTriangle, success: CheckCircle, info: Info };

export default function StudentNotificationsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{notifications.length} notifications</p>
        </motion.div>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                n.type === "warning" && "bg-warning/10 text-warning",
                n.type === "success" && "bg-success/10 text-success",
                n.type === "info" && "bg-info/10 text-info"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
