
-- 1. Enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'faculty', 'student');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Tables first (no policies yet)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. has_role function (now user_roles table exists)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. Triggers for auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 7. Update existing table RLS
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert students" ON public.students;
DROP POLICY IF EXISTS "Allow public update students" ON public.students;
DROP POLICY IF EXISTS "Allow public delete students" ON public.students;
CREATE POLICY "Auth read students" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Faculty insert students" ON public.students FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin/Faculty update students" ON public.students FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin delete students" ON public.students FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow public read faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public insert faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public update faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow public delete faculty" ON public.faculty;
CREATE POLICY "Auth read faculty" ON public.faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin insert faculty" ON public.faculty FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update faculty" ON public.faculty FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete faculty" ON public.faculty FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow public read attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public update attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public delete attendance" ON public.attendance_records;
CREATE POLICY "Auth read attendance" ON public.attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Faculty insert attendance" ON public.attendance_records FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin/Faculty update attendance" ON public.attendance_records FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin delete attendance" ON public.attendance_records FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow public read classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public insert classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public update classes" ON public.classes;
DROP POLICY IF EXISTS "Allow public delete classes" ON public.classes;
CREATE POLICY "Auth read classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin insert classes" ON public.classes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update classes" ON public.classes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete classes" ON public.classes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
