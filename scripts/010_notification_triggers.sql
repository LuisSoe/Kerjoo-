-- Function to create notification on new application
CREATE OR REPLACE FUNCTION notify_on_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_title TEXT;
  company_id UUID;
BEGIN
  -- Get job details
  SELECT title, company_id INTO job_title, company_id
  FROM public.jobs
  WHERE id = NEW.job_id;
  
  -- Create notification for company
  INSERT INTO public.notifications (user_id, type, title, content, link)
  VALUES (
    company_id,
    'application',
    'Lamaran Baru',
    'Ada lamaran baru untuk pekerjaan: ' || job_title,
    '/dashboard/company/applications?job_id=' || NEW.job_id
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new applications
DROP TRIGGER IF EXISTS on_new_application ON public.applications;
CREATE TRIGGER on_new_application
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_application();

-- Function to create notification on application status change
CREATE OR REPLACE FUNCTION notify_on_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_title TEXT;
BEGIN
  IF (NEW.status != OLD.status) THEN
    -- Get job title
    SELECT title INTO job_title
    FROM public.jobs
    WHERE id = NEW.job_id;
    
    -- Create notification for worker
    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      NEW.worker_id,
      'application',
      'Status Lamaran Diperbarui',
      'Status lamaran Anda untuk "' || job_title || '" telah diperbarui menjadi: ' || NEW.status,
      '/dashboard/worker/applications'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for application status changes
DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_application_status_change();

-- Function to create notification on new project
CREATE OR REPLACE FUNCTION notify_on_new_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create notification for worker
  INSERT INTO public.notifications (user_id, type, title, content, link)
  VALUES (
    NEW.worker_id,
    'project',
    'Proyek Baru',
    'Anda telah ditambahkan ke proyek baru: ' || NEW.title,
    '/dashboard/worker/projects/' || NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new projects
DROP TRIGGER IF EXISTS on_new_project ON public.projects;
CREATE TRIGGER on_new_project
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_project();

-- Function to create notification on payment
CREATE OR REPLACE FUNCTION notify_on_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (NEW.type = 'earning' AND NEW.status = 'completed') THEN
    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      NEW.user_id,
      'payment',
      'Pembayaran Diterima',
      'Anda telah menerima pembayaran sebesar Rp ' || NEW.amount,
      '/dashboard/wallet'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for payments
DROP TRIGGER IF EXISTS on_payment ON public.transactions;
CREATE TRIGGER on_payment
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_payment();
