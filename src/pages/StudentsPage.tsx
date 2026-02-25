import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Download, Plus, Pencil, Trash2, X, Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";
import {
  fetchStudents, createStudent, updateStudent, deleteStudent, Student,
} from "@/services/students";
import { toast } from "sonner";

const emptyForm = {
  student_id: "", name: "", email: "", department: "Computer Science",
  semester: "1st", phone: "", status: "regular",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setForm({
      student_id: s.student_id, name: s.name, email: s.email,
      department: s.department, semester: s.semester,
      phone: s.phone || "", status: s.status,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.student_id.trim()) {
      toast.error("Name, Student ID, and Email are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateStudent(editingId, form);
        toast.success("Student updated");
      } else {
        await createStudent(form);
        toast.success("Student created");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This action cannot be undone.`)) return;
    try {
      await deleteStudent(id);
      toast.success("Student deleted");
      load();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {students.length} students enrolled
          </p>
        </motion.div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or department..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Semester</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{student.student_id}</td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-card-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{student.department}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{student.department}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{student.semester}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-sm font-semibold",
                        Number(student.attendance_percentage) >= 80 ? "text-success" :
                        Number(student.attendance_percentage) >= 75 ? "text-warning" : "text-destructive"
                      )}>
                        {student.attendance_percentage}%
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
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(student)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(student.id, student.name)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      {search ? "No students match your search" : "No students found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {editingId ? "Edit Student" : "Add Student"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "student_id", label: "Student ID", placeholder: "STU009" },
                  { key: "name", label: "Full Name", placeholder: "John Doe" },
                  { key: "email", label: "Email", placeholder: "john@university.edu" },
                  { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{f.label}</label>
                    <input
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {["Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics", "Physics"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
