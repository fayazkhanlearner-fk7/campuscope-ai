import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Search, Plus, Pencil, Trash2, X, Loader2, BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";
import {
  fetchFaculty, createFaculty, updateFaculty, deleteFaculty, Faculty,
} from "@/services/faculty";
import { toast } from "sonner";

const emptyForm = {
  faculty_id: "", name: "", email: "", department: "Computer Science",
  designation: "Assistant Professor", phone: "", subjects: "",
};

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchFaculty();
      setFaculty(data);
    } catch {
      toast.error("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = faculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (f: Faculty) => {
    setForm({
      faculty_id: f.faculty_id, name: f.name, email: f.email,
      department: f.department, designation: f.designation,
      phone: f.phone || "", subjects: (f.subjects || []).join(", "),
    });
    setEditingId(f.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.faculty_id.trim()) {
      toast.error("Name, Faculty ID, and Email are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateFaculty(editingId, payload);
        toast.success("Faculty updated");
      } else {
        await createFaculty(payload);
        toast.success("Faculty created");
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save faculty");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete faculty "${name}"?`)) return;
    try {
      await deleteFaculty(id);
      toast.success("Faculty deleted");
      load();
    } catch {
      toast.error("Failed to delete faculty");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Faculty</h1>
          <p className="text-sm text-muted-foreground mt-1">{faculty.length} faculty members</p>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Faculty
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">{f.name}</h3>
                    <p className="text-xs text-muted-foreground">{f.designation}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(f.id, f.name)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>{f.department}</p>
                <p>{f.email}</p>
                {f.subjects && f.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {f.subjects.map((s) => (
                      <span key={s} className="rounded-full bg-primary/5 border border-primary/20 px-2 py-0.5 text-[10px] text-primary font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3 font-mono">{f.faculty_id}</p>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              {search ? "No faculty match your search" : "No faculty found"}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">{editingId ? "Edit Faculty" : "Add Faculty"}</h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "faculty_id", label: "Faculty ID", placeholder: "FAC005" },
                  { key: "name", label: "Full Name", placeholder: "Dr. Jane Smith" },
                  { key: "email", label: "Email", placeholder: "jane@university.edu" },
                  { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                    {["Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics", "Physics"].map((d) => (<option key={d}>{d}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Designation</label>
                  <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                    {["Assistant Professor", "Associate Professor", "Professor", "Lecturer", "HOD"].map((d) => (<option key={d}>{d}</option>))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subjects (comma-separated)</label>
                  <input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} placeholder="Data Structures, Algorithms" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
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
