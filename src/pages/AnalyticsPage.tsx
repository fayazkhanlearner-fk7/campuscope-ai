import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { weeklyAttendance, monthlyTrend, departmentStats } from "@/lib/mock-data";

const pieColors = ["hsl(220, 72%, 50%)", "hsl(190, 80%, 42%)", "hsl(152, 60%, 42%)", "hsl(40, 90%, 50%)", "hsl(0, 72%, 55%)", "hsl(280, 60%, 55%)"];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">In-depth attendance analytics and trends</p>
        </motion.div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Avg. Attendance", value: "79.3%", icon: TrendingUp, change: "+2.1%" },
          { label: "Peak Day", value: "Tuesday", icon: Calendar, change: "2,450 present" },
          { label: "At-Risk Students", value: "23", icon: TrendingDown, change: "Below 75%" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(220, 10%, 46%)" />
              <YAxis fontSize={12} stroke="hsl(220, 10%, 46%)" />
              <Tooltip />
              <Bar dataKey="present" fill="hsl(220, 72%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="month" fontSize={11} stroke="hsl(220, 10%, 46%)" />
              <YAxis fontSize={11} stroke="hsl(220, 10%, 46%)" domain={[60, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="hsl(190, 80%, 42%)" strokeWidth={2.5} dot={{ fill: "hsl(190, 80%, 42%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department pie */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Department Distribution</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ResponsiveContainer width="100%" height={250} className="max-w-xs">
            <PieChart>
              <Pie data={departmentStats} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={0}>
                {departmentStats.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {departmentStats.map((dept, i) => (
              <div key={dept.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: pieColors[i % pieColors.length] }} />
                <span className="text-muted-foreground">{dept.name}: {dept.students}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
