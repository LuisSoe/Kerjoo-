-- Migration script to add any missing columns
-- This is safe to run even if columns already exist

-- Add level column to worker_profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'worker_profiles' AND column_name = 'level'
  ) THEN
    ALTER TABLE worker_profiles 
    ADD COLUMN level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced'));
  END IF;
END $$;

-- Ensure all other columns exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'worker_profiles' AND column_name = 'skill_points'
  ) THEN
    ALTER TABLE worker_profiles ADD COLUMN skill_points INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'worker_profiles' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE worker_profiles 
    ADD COLUMN availability_status VARCHAR(20) DEFAULT 'available' 
    CHECK (availability_status IN ('available', 'busy', 'unavailable'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'worker_profiles' AND column_name = 'hourly_rate'
  ) THEN
    ALTER TABLE worker_profiles ADD COLUMN hourly_rate INTEGER DEFAULT 0;
  END IF;
END $$;
