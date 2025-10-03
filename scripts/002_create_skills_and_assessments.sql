-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('web-development', 'design', 'content', 'marketing')),
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create worker_skills table
CREATE TABLE IF NOT EXISTS worker_skills (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level_score INTEGER DEFAULT 0 CHECK (level_score >= 0 AND level_score <= 100),
  assessment_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, skill_id)
);

-- Create skill_assessments table
CREATE TABLE IF NOT EXISTS skill_assessments (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  total_score INTEGER DEFAULT 0,
  level_achieved VARCHAR(20) CHECK (level_achieved IN ('beginner', 'intermediate', 'advanced')),
  questions_answered INTEGER DEFAULT 0,
  time_taken INTEGER,
  strengths JSONB,
  improvements JSONB,
  recommendations JSONB,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_skills_worker_id ON worker_skills(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_skill_id ON worker_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_worker_id ON skill_assessments(worker_id);
