import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  phone: string | null;
  face_registered: boolean;
  attendance_percentage: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export type StudentInsert = Omit<Student, "id" | "created_at" | "updated_at">;

export async function fetchStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Student[];
}

export async function createStudent(student: Partial<StudentInsert>) {
  const { data, error } = await supabase
    .from("students")
    .insert([student] as any)
    .select()
    .single();
  if (error) throw error;
  return data as Student;
}

export async function updateStudent(id: string, updates: Partial<StudentInsert>) {
  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}
