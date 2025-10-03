-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  project_title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  client_name VARCHAR(255),
  client_company_id INTEGER REFERENCES company_profiles(id) ON DELETE SET NULL,
  rating DECIMAL(3,2),
  feedback TEXT,
  skills_used JSONB,
  image_url TEXT,
  external_url TEXT,
  completed_date DATE,
  budget BIGINT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('featured', 'active', 'archived')),
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  endorser_id INTEGER NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, endorser_id, skill_name)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  skills_rated JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, reviewer_id, reviewee_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_worker_id ON portfolios(worker_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_featured ON portfolios(is_featured);
CREATE INDEX IF NOT EXISTS idx_endorsements_worker_id ON endorsements(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
