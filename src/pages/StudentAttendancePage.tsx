import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { studentAttendanceCalendar, studentStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function StudentAttendancePage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">My Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed attendance record</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">February 2026</h3>
            <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Download className="h-3.5 w-3.5" /> Download Report
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {studentAttendanceCalendar.map((day) => (
              <div
                key={day.day}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  day.status === "present" && "bg-success/10 text-success",
                  day.status === "absent" && "bg-destructive/10 text-destructive",
                  day.status === "late" && "bg-warning/10 text-warning",
                  day.status === "weekend" && "bg-muted/50 text-muted-foreground/40"
                )}
              >
                {day.day}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Present</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Absent</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Late</div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-card-foreground">Summary</h3>
          {[
            { label: "Total Classes", value: studentStats.totalClasses },
            { label: "Attended", value: studentStats.attended },
            { label: "Percentage", value: `${studentStats.percentage}%` },
            { label: "Current Streak", value: `${studentStats.streak} days` },
            { label: "Class Rank", value: `#${studentStats.rank}` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-card-foreground">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
