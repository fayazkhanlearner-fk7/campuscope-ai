import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  time: string;
  status: string;
  confidence_score: number;
  subject: string;
  marked_by: string;
  created_at: string;
  // joined
  students?: { name: string; student_id: string };
}

export async function fetchAttendanceRecords(filters?: { date?: string; subject?: string }) {
  let query = supabase
    .from("attendance_records")
    .select("*, students(name, student_id)")
    .order("created_at", { ascending: false });

  if (filters?.date) query = query.eq("date", filters.date);
  if (filters?.subject) query = query.eq("subject", filters.subject);

  const { data, error } = await query;
  if (error) throw error;
  return data as AttendanceRecord[];
}

export async function markAttendance(record: {
  student_id: string;
  subject: string;
  status: string;
  confidence_score: number;
  marked_by?: string;
}) {
  const { data, error } = await supabase
    .from("attendance_records")
    .insert({
      ...record,
      marked_by: record.marked_by || "face-recognition",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAttendanceRecord(id: string, updates: { status?: string }) {
  const { data, error } = await supabase
    .from("attendance_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAttendanceRecord(id: string) {
  const { error } = await supabase.from("attendance_records").delete().eq("id", id);
  if (error) throw error;
}
