import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Camera,
  AlertTriangle,
  BookOpen,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import {
  dashboardStats,
  weeklyAttendance,
  monthlyTrend,
  departmentStats,
  recentAttendance,
  activityLogs,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const pieData = [
  { name: "Present", value: dashboardStats.presentToday, color: "hsl(152, 60%, 42%)" },
  { name: "Absent", value: dashboardStats.absentToday, color: "hsl(0, 72%, 55%)" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time attendance overview • Feb 22, 2026
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 3.2, positive: true }}
        />
        <StatCard
          title="Present Today"
          value={dashboardStats.presentToday.toLocaleString()}
          icon={UserCheck}
          variant="success"
          subtitle={`${dashboardStats.attendanceRate}% attendance rate`}
        />
        <StatCard
          title="Absent Today"
          value={dashboardStats.absentToday.toLocaleString()}
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="Flagged Students"
          value={dashboardStats.flaggedStudents}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Below 75% attendance"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(220, 10%, 46%)" />
              <YAxis fontSize={12} stroke="hsl(220, 10%, 46%)" />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 15%, 90%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="present" fill="hsl(220, 72%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Today's Ratio</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Trend + Department Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="month" fontSize={11} stroke="hsl(220, 10%, 46%)" />
              <YAxis fontSize={11} stroke="hsl(220, 10%, 46%)" domain={[60, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(190, 80%, 42%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(190, 80%, 42%)", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Department Performance</h3>
          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-card-foreground">{dept.name}</span>
                  <span className="text-muted-foreground">{dept.rate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      dept.rate >= 80 ? "bg-success" : dept.rate >= 75 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Attendance + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-card-foreground">Recent Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-card-foreground">{record.studentName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{record.subject}</td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{record.time}</td>
                    <td className="px-5 py-3">
                      {record.confidenceScore > 0 ? (
                        <span className={cn(
                          "text-xs font-medium",
                          record.confidenceScore >= 95 ? "text-success" : record.confidenceScore >= 85 ? "text-warning" : "text-destructive"
                        )}>
                          {record.confidenceScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        record.status === "present" && "bg-success/10 text-success",
                        record.status === "absent" && "bg-destructive/10 text-destructive",
                        record.status === "late" && "bg-warning/10 text-warning"
                      )}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl border border-border bg-card"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-card-foreground">Activity Log</h3>
          </div>
          <div className="p-4 space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  log.type === "attendance" && "bg-success/10 text-success",
                  log.type === "admin" && "bg-primary/10 text-primary",
                  log.type === "auth" && "bg-info/10 text-info",
                  log.type === "system" && "bg-warning/10 text-warning"
                )}>
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-card-foreground leading-snug">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {log.performedBy} • {log.timestamp.split(" ")[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
