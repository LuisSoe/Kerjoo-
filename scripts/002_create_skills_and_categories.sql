-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills
CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  USING (true);

-- Create worker skills junction table
CREATE TABLE IF NOT EXISTS public.worker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.worker_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for worker skills
CREATE POLICY "Anyone can view worker skills"
  ON public.worker_skills FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage their own skills"
  ON public.worker_skills FOR ALL
  USING (auth.uid() = worker_id);

-- Insert default skills
INSERT INTO public.skills (name, category) VALUES
  ('UI/UX Design', 'Design'),
  ('Graphic Design', 'Design'),
  ('Web Development', 'Development'),
  ('Mobile Development', 'Development'),
  ('Frontend Development', 'Development'),
  ('Backend Development', 'Development'),
  ('Full Stack Development', 'Development'),
  ('React', 'Development'),
  ('Next.js', 'Development'),
  ('Node.js', 'Development'),
  ('Python', 'Development'),
  ('Java', 'Development'),
  ('Content Writing', 'Writing'),
  ('Copywriting', 'Writing'),
  ('SEO', 'Marketing'),
  ('Social Media Marketing', 'Marketing'),
  ('Video Editing', 'Media'),
  ('Photography', 'Media'),
  ('3D Modeling', 'Design'),
  ('Animation', 'Media')
ON CONFLICT (name) DO NOTHING;
