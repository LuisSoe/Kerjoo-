-- Create users table extension for profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'company')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create worker profiles table
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  location TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  total_projects INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_earnings DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for worker profiles
CREATE POLICY "Anyone can view worker profiles"
  ON public.worker_profiles FOR SELECT
  USING (true);

CREATE POLICY "Workers can update their own profile"
  ON public.worker_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Workers can insert their own profile"
  ON public.worker_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create company profiles table
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  description TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company profiles
CREATE POLICY "Anyone can view company profiles"
  ON public.company_profiles FOR SELECT
  USING (true);

CREATE POLICY "Companies can update their own profile"
  ON public.company_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Companies can insert their own profile"
  ON public.company_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'user_type', 'worker')
  );
  
  -- Create worker or company profile based on user type
  IF (new.raw_user_meta_data->>'user_type' = 'company') THEN
    INSERT INTO public.company_profiles (id, company_name)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'company_name', 'Unnamed Company')
    );
  ELSE
    INSERT INTO public.worker_profiles (id)
    VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
