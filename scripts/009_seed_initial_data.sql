-- Insert initial skills
INSERT INTO skills (name, category, description, icon) VALUES
  ('React.js', 'web-development', 'Modern JavaScript library for building user interfaces', 'code'),
  ('Node.js', 'web-development', 'JavaScript runtime for server-side development', 'server'),
  ('TypeScript', 'web-development', 'Typed superset of JavaScript', 'code'),
  ('UI/UX Design', 'design', 'User interface and experience design', 'palette'),
  ('Figma', 'design', 'Collaborative interface design tool', 'figma'),
  ('Adobe XD', 'design', 'Vector-based design tool', 'layers'),
  ('Content Writing', 'content', 'Creating engaging written content', 'pen-tool'),
  ('SEO', 'content', 'Search engine optimization', 'search'),
  ('Digital Marketing', 'marketing', 'Online marketing strategies', 'trending-up'),
  ('Social Media', 'marketing', 'Social media management and marketing', 'share-2')
ON CONFLICT DO NOTHING;

-- Insert initial achievements
INSERT INTO achievements (name, description, icon, criteria) VALUES
  ('First Project', 'Complete your first project', 'award', '{"projects_completed": 1}'),
  ('Fast Delivery', 'Deliver 5 projects before deadline', 'zap', '{"early_deliveries": 5}'),
  ('Quality Work', 'Maintain 4.5+ rating for 10 projects', 'star', '{"min_rating": 4.5, "min_projects": 10}'),
  ('Communication Expert', 'Respond to messages within 1 hour for 20 projects', 'message-circle', '{"fast_responses": 20}'),
  ('Skill Master', 'Achieve advanced level in any skill', 'trophy', '{"advanced_skills": 1}'),
  ('Top Earner', 'Earn over Rp 10,000,000', 'dollar-sign', '{"total_earnings": 10000000}')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, category, level, duration, lessons_count, rating, instructor_name, thumbnail_url, skills_taught, is_free) VALUES
  ('Mastering React.js', 'Learn React from basics to advanced concepts', 'Web Development', 'intermediate', 480, 24, 4.8, 'Budi Santoso', '/nodejs-course.jpg', '["React.js", "JavaScript", "Hooks"]', true),
  ('UI/UX Design Fundamentals', 'Complete guide to user interface and experience design', 'Design', 'beginner', 360, 18, 4.7, 'Sari Dewi', '/content-marketing-course.png', '["UI/UX Design", "Figma", "Design Thinking"]', true),
  ('Content Marketing Mastery', 'Create compelling content that converts', 'Marketing', 'intermediate', 300, 15, 4.6, 'Ahmad Rizki', '/content-marketing-course.png', '["Content Writing", "SEO", "Marketing"]', true),
  ('Digital Marketing Strategy', 'Build effective digital marketing campaigns', 'Marketing', 'advanced', 420, 21, 4.9, 'Dewi Lestari', '/digital-marketing-campaign-graphics.jpg', '["Digital Marketing", "Social Media", "Analytics"]', true)
ON CONFLICT DO NOTHING;
