import { motion } from "framer-motion";
import { Users, Search, Filter, Download, MoreHorizontal } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { recentAttendance } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";

const students = [
  { id: "STU001", name: "Alex Johnson", department: "Computer Science", semester: "6th", attendance: 87.5, status: "regular" },
  { id: "STU002", name: "Maria Garcia", department: "Computer Science", semester: "6th", attendance: 92.3, status: "regular" },
  { id: "STU003", name: "James Wilson", department: "Electronics", semester: "4th", attendance: 71.2, status: "at-risk" },
  { id: "STU004", name: "Emily Chen", department: "Computer Science", semester: "6th", attendance: 68.9, status: "at-risk" },
  { id: "STU005", name: "Ryan Patel", department: "Mechanical", semester: "4th", attendance: 95.1, status: "regular" },
  { id: "STU006", name: "Sophie Brown", department: "Civil", semester: "2nd", attendance: 82.4, status: "regular" },
  { id: "STU007", name: "Daniel Kim", department: "Mathematics", semester: "6th", attendance: 74.0, status: "warning" },
  { id: "STU008", name: "Olivia Martinez", department: "Physics", semester: "4th", attendance: 89.7, status: "regular" },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{students.length} students enrolled</p>
        </motion.div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button className="flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Semester</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{student.id}</td>
                  <td className="px-5 py-3 font-medium text-card-foreground">{student.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{student.department}</td>
                  <td className="px-5 py-3 text-muted-foreground">{student.semester}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-sm font-semibold",
                      student.attendance >= 80 ? "text-success" : student.attendance >= 75 ? "text-warning" : "text-destructive"
                    )}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      student.status === "regular" && "bg-success/10 text-success",
                      student.status === "at-risk" && "bg-destructive/10 text-destructive",
                      student.status === "warning" && "bg-warning/10 text-warning"
                    )}>
                      {student.status === "at-risk" ? "At Risk" : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
