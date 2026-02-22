import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  Calendar,
  Award,
  AlertTriangle,
  Download,
  Flame,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { studentStats, studentAttendanceCalendar, monthlyTrend } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const isAtRisk = studentStats.percentage < 75;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Alex Johnson</p>
        </motion.div>
      </div>

      {/* Warning Banner */}
      {isAtRisk && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        >
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Attendance Warning</p>
            <p className="text-xs text-muted-foreground">
              Your attendance is below 75%. You may be ineligible for exams.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Attendance"
          value={`${studentStats.percentage}%`}
          icon={GraduationCap}
          variant={studentStats.percentage >= 75 ? "success" : "destructive"}
          subtitle={`${studentStats.attended}/${studentStats.totalClasses} classes`}
        />
        <StatCard
          title="Current Streak"
          value={`${studentStats.streak} days`}
          icon={Flame}
          variant="primary"
        />
        <StatCard
          title="Class Rank"
          value={`#${studentStats.rank}`}
          icon={Award}
          variant="default"
          subtitle="Out of 65 students"
        />
        <StatCard
          title="This Month"
          value="87%"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 5.2, positive: true }}
        />
      </div>

      {/* Attendance Calendar + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">February 2026</h3>
            <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {studentAttendanceCalendar.map((day) => (
              <div
                key={day.day}
                className={cn(
                  "flex h-10 items-center justify-center rounded-lg text-xs font-medium transition-colors",
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

          <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Present</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Absent</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Late</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220, 72%, 50%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(220, 72%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" fontSize={11} stroke="hsl(220, 10%, 46%)" />
              <YAxis fontSize={11} stroke="hsl(220, 10%, 46%)" domain={[60, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="hsl(220, 72%, 50%)"
                fill="url(#areaGradient)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subject-wise breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-card-foreground">Subject-wise Attendance</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { subject: "Data Structures", attended: 28, total: 32, percentage: 87.5 },
            { subject: "Algorithms", attended: 24, total: 30, percentage: 80 },
            { subject: "Database Systems", attended: 22, total: 28, percentage: 78.6 },
            { subject: "Operating Systems", attended: 24, total: 30, percentage: 80 },
          ].map((s) => (
            <div key={s.subject} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{s.subject}</p>
                <p className="text-xs text-muted-foreground">{s.attended}/{s.total} classes</p>
              </div>
              <div className="w-32">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      s.percentage >= 80 ? "bg-success" : s.percentage >= 75 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
              <span className={cn(
                "text-sm font-semibold w-14 text-right",
                s.percentage >= 80 ? "text-success" : s.percentage >= 75 ? "text-warning" : "text-destructive"
              )}>
                {s.percentage}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
