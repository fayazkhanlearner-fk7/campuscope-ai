
-- Fix RLS policies: Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- students
DROP POLICY IF EXISTS "Allow public delete students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert students" ON public.students;
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
DROP POLICY IF EXISTS "Allow public update students" ON public.students;

CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);

-- faculty
DROP POLICY IF EXISTS "Allow public delete faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public insert faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public read faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public update faculty" ON public.faculty;

CREATE POLICY "Allow public read faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow public insert faculty" ON public.faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update faculty" ON public.faculty FOR UPDATE USING (true);
CREATE POLICY "Allow public delete faculty" ON public.faculty FOR DELETE USING (true);

-- attendance_records
DROP POLICY IF EXISTS "Allow public delete attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public read attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public update attendance" ON public.attendance_records;

CREATE POLICY "Allow public read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update attendance" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete attendance" ON public.attendance_records FOR DELETE USING (true);

-- classes
DROP POLICY IF EXISTS "Allow public delete classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public insert classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public read classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public update classes" ON public.classes;

CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update classes" ON public.classes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete classes" ON public.classes FOR DELETE USING (true);
