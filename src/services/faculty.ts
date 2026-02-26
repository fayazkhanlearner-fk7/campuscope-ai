import { supabase } from "@/integrations/supabase/client";

export interface Faculty {
  id: string;
  faculty_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string | null;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export type FacultyInsert = Omit<Faculty, "id" | "created_at" | "updated_at">;

export async function fetchFaculty() {
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Faculty[];
}

export async function createFaculty(faculty: Partial<FacultyInsert>) {
  const { data, error } = await supabase
    .from("faculty")
    .insert([faculty] as any)
    .select()
    .single();
  if (error) throw error;
  return data as Faculty;
}

export async function updateFaculty(id: string, updates: Partial<FacultyInsert>) {
  const { data, error } = await supabase
    .from("faculty")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Faculty;
}

export async function deleteFaculty(id: string) {
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw error;
}
