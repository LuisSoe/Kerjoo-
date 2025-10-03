-- Function to increment course enrollments
CREATE OR REPLACE FUNCTION increment_course_enrollments(course_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.courses
  SET total_enrollments = total_enrollments + 1
  WHERE id = course_id;
END;
$$;

-- Function to auto-generate certificate on course completion
CREATE OR REPLACE FUNCTION generate_certificate_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (NEW.completed = true AND OLD.completed = false) THEN
    INSERT INTO public.certificates (enrollment_id, user_id, course_id)
    VALUES (NEW.id, NEW.user_id, NEW.course_id)
    ON CONFLICT (enrollment_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate certificate
DROP TRIGGER IF EXISTS on_enrollment_completed ON public.course_enrollments;
CREATE TRIGGER on_enrollment_completed
  AFTER UPDATE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION generate_certificate_on_completion();
