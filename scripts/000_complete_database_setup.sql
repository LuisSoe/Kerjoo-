-- Complete Database Setup for Kerjoo Platform
-- Run this script ONCE to create all tables

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS worker_achievements CASCADE;
DROP TABLE IF EXISTS worker_skills CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS project_assignments CASCADE;
DROP TABLE IF EXISTS project_applications CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS endorsements CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS skill_assessments CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS company_profiles CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;

-- 1. Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('worker', 'company')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- 2. Worker Profiles
CREATE TABLE worker_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  location VARCHAR(255),
  hourly_rate INTEGER DEFAULT 0,
  level VARCHAR(50) DEFAULT 'beginner',
  skill_points INTEGER DEFAULT 0,
  availability_status VARCHAR(50) DEFAULT 'available',
  completed_projects_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_earnings BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Company Profiles
CREATE TABLE company_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  website VARCHAR(255),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  description TEXT,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Skill Assessments
CREATE TABLE skill_assessments (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  category VARCHAR(100),
  total_score INTEGER DEFAULT 0,
  level_achieved VARCHAR(50),
  questions_answered INTEGER DEFAULT 0,
  time_taken INTEGER,
  strengths JSONB,
  improvements JSONB,
  recommendations JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  budget BIGINT,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  required_skills JSONB,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Project Applications
CREATE TABLE project_applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_rate INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  match_score INTEGER,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- 8. Project Assignments
CREATE TABLE project_assignments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  hours_worked INTEGER DEFAULT 0,
  amount_paid BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Portfolios
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  project_title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  external_url TEXT,
  client_name VARCHAR(255),
  client_company_id INTEGER REFERENCES company_profiles(id),
  completed_date DATE,
  budget BIGINT,
  skills_used JSONB,
  status VARCHAR(50) DEFAULT 'completed',
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Endorsements
CREATE TABLE endorsements (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  endorser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  skills_rated JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Wallets
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER UNIQUE NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  total_balance BIGINT DEFAULT 0,
  available_balance BIGINT DEFAULT 0,
  pending_balance BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount BIGINT NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  project_id INTEGER REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

-- 14. Courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  level VARCHAR(50),
  instructor_name VARCHAR(255),
  thumbnail_url TEXT,
  duration INTEGER,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  price INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  skills_taught JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Lessons
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  content_url TEXT,
  duration INTEGER,
  order_number INTEGER,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Course Enrollments
CREATE TABLE course_enrollments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  current_lesson_id INTEGER REFERENCES lessons(id),
  completed_lessons JSONB,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Achievements
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  criteria JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Worker Achievements
CREATE TABLE worker_achievements (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Worker Skills
CREATE TABLE worker_skills (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level_score INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  assessment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. Conversations
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id),
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  related_id INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 23. AI Recommendations
CREATE TABLE ai_recommendations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  priority VARCHAR(20),
  confidence_score INTEGER,
  metadata JSONB,
  is_acted_on BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 24. Saved Jobs
CREATE TABLE saved_jobs (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_applications_worker_id ON project_applications(worker_id);
CREATE INDEX idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX idx_portfolios_worker_id ON portfolios(worker_id);
CREATE INDEX idx_wallets_worker_id ON wallets(worker_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- Insert initial skills data
INSERT INTO skills (name, category, icon) VALUES
('Web Development', 'Programming', '💻'),
('Mobile Development', 'Programming', '📱'),
('UI/UX Design', 'Design', '🎨'),
('Graphic Design', 'Design', '🖼️'),
('Content Writing', 'Content', '✍️'),
('Digital Marketing', 'Marketing', '📊'),
('Data Analysis', 'Data', '📈'),
('Video Editing', 'Media', '🎬');

-- Insert initial achievements
INSERT INTO achievements (name, description, icon) VALUES
('First Project', 'Complete your first project', '🎯'),
('Fast Learner', 'Complete 5 courses', '📚'),
('Top Rated', 'Maintain 5-star rating for 10 projects', '⭐'),
('Expert Level', 'Reach expert level in any skill', '🏆');

-- Insert sample courses
INSERT INTO courses (title, description, category, level, instructor_name, duration, lessons_count, is_free, thumbnail_url) VALUES
('Web Development Fundamentals', 'Learn the basics of web development', 'Programming', 'beginner', 'John Doe', 300, 10, true, '/nodejs-course.jpg'),
('Advanced UI/UX Design', 'Master modern design principles', 'Design', 'advanced', 'Jane Smith', 420, 15, false, '/content-marketing-course.png'),
('Digital Marketing Mastery', 'Complete guide to digital marketing', 'Marketing', 'intermediate', 'Mike Johnson', 360, 12, true, '/digital-marketing-campaign-graphics.jpg');
