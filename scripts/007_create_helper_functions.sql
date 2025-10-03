-- Function to increment job application count
CREATE OR REPLACE FUNCTION increment_job_applications(job_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs
  SET total_applications = total_applications + 1
  WHERE id = job_id;
END;
$$;

-- Function to update worker total projects
CREATE OR REPLACE FUNCTION update_worker_project_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.worker_profiles
    SET total_projects = total_projects + 1
    WHERE id = NEW.worker_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.worker_profiles
    SET total_projects = total_projects - 1
    WHERE id = OLD.worker_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to update worker project count
DROP TRIGGER IF EXISTS on_project_change ON public.projects;
CREATE TRIGGER on_project_change
  AFTER INSERT OR DELETE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_project_count();
