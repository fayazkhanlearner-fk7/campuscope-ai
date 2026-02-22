import { motion } from "framer-motion";
import { BookOpen, Users, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { classes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ClassesPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-sm text-muted-foreground mt-1">{classes.length} active classes this semester</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls, i) => {
          const rate = Math.round((cls.presentToday / cls.totalStudents) * 100);
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">{cls.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cls.facultyName}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{cls.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {cls.presentToday}/{cls.totalStudents} present
                </span>
                <span className={cn(
                  "text-sm font-semibold",
                  rate >= 80 ? "text-success" : rate >= 70 ? "text-warning" : "text-destructive"
                )}>
                  {rate}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", rate >= 80 ? "bg-success" : rate >= 70 ? "bg-warning" : "bg-destructive")}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
