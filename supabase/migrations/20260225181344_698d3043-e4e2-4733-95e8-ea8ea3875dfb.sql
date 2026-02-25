
-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  semester TEXT NOT NULL DEFAULT '1st',
  phone TEXT,
  face_registered BOOLEAN NOT NULL DEFAULT false,
  attendance_percentage NUMERIC(5,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'regular' CHECK (status IN ('regular', 'warning', 'at-risk')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Faculty table
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL DEFAULT 'Assistant Professor',
  phone TEXT,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attendance records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  confidence_score NUMERIC(5,2) DEFAULT 0,
  subject TEXT NOT NULL,
  marked_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, date, subject)
);

-- Classes table  
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  schedule TEXT NOT NULL,
  total_students INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Public read policies (demo app without auth for now)
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Allow public read faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow public insert faculty" ON public.faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update faculty" ON public.faculty FOR UPDATE USING (true);
CREATE POLICY "Allow public delete faculty" ON public.faculty FOR DELETE USING (true);

CREATE POLICY "Allow public read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update attendance" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete attendance" ON public.attendance_records FOR DELETE USING (true);

CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update classes" ON public.classes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete classes" ON public.classes FOR DELETE USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some initial data
INSERT INTO public.students (student_id, name, email, department, semester, attendance_percentage, status) VALUES
  ('STU001', 'Alex Johnson', 'alex.j@university.edu', 'Computer Science', '6th', 87.5, 'regular'),
  ('STU002', 'Maria Garcia', 'maria.g@university.edu', 'Computer Science', '6th', 92.3, 'regular'),
  ('STU003', 'James Wilson', 'james.w@university.edu', 'Electronics', '4th', 71.2, 'at-risk'),
  ('STU004', 'Emily Chen', 'emily.c@university.edu', 'Computer Science', '6th', 68.9, 'at-risk'),
  ('STU005', 'Ryan Patel', 'ryan.p@university.edu', 'Mechanical', '4th', 95.1, 'regular'),
  ('STU006', 'Sophie Brown', 'sophie.b@university.edu', 'Civil', '2nd', 82.4, 'regular'),
  ('STU007', 'Daniel Kim', 'daniel.k@university.edu', 'Mathematics', '6th', 74.0, 'warning'),
  ('STU008', 'Olivia Martinez', 'olivia.m@university.edu', 'Physics', '4th', 89.7, 'regular');

INSERT INTO public.faculty (faculty_id, name, email, department, designation, subjects) VALUES
  ('FAC001', 'Dr. Sarah Mitchell', 'sarah.m@university.edu', 'Computer Science', 'Professor', ARRAY['Data Structures', 'Algorithms']),
  ('FAC002', 'Prof. David Lee', 'david.l@university.edu', 'Computer Science', 'Associate Professor', ARRAY['Algorithms', 'Machine Learning']),
  ('FAC003', 'Dr. Lisa Wang', 'lisa.w@university.edu', 'Computer Science', 'Assistant Professor', ARRAY['Database Systems']),
  ('FAC004', 'Prof. Mark Taylor', 'mark.t@university.edu', 'Electronics', 'Professor', ARRAY['Operating Systems', 'Computer Networks']);
