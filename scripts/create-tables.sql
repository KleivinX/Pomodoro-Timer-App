-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (careful with this in production!)
DROP TABLE IF EXISTS weekly_reviews CASCADE;
DROP TABLE IF EXISTS daily_reflections CASCADE;
DROP TABLE IF EXISTS card_reviews CASCADE;
DROP TABLE IF EXISTS study_cards CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS focus_sessions CASCADE;
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  lock_in_rule TEXT CHECK (lock_in_rule IN ('focus_task', 'double_focus', 'focus_reflection')) DEFAULT 'focus_task',
  reminder_time TIME DEFAULT '17:00:00',
  grace_days_remaining INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_locked_date DATE,
  sounds_enabled BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily activities table
CREATE TABLE daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  focus_sessions_count INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  reflection_done BOOLEAN DEFAULT FALSE,
  lock_in_level TEXT CHECK (lock_in_level IN ('none', 'partial', 'locked')) DEFAULT 'none',
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Focus sessions table
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  mode TEXT CHECK (mode IN ('focus', 'short_break', 'long_break')) DEFAULT 'focus',
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  work_description TEXT,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  if_then_plan TEXT,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study cards table (flashcards for active recall)
CREATE TABLE study_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review_date DATE DEFAULT CURRENT_DATE,
  interval INTEGER DEFAULT 1,
  easiness_factor NUMERIC DEFAULT 2.5,
  review_count INTEGER DEFAULT 0
);

-- Card reviews table
CREATE TABLE card_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES study_cards(id) ON DELETE CASCADE,
  review_date DATE NOT NULL,
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  xp_awarded INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Daily reflections table
CREATE TABLE daily_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reflection_date DATE NOT NULL,
  one_win TEXT NOT NULL,
  one_improvement TEXT NOT NULL,
  tomorrow_focus TEXT NOT NULL,
  xp_awarded INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reflection_date)
);

-- Weekly reviews table
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  what_worked TEXT,
  what_blocked TEXT,
  next_week_rule TEXT,
  total_focus_hours NUMERIC,
  lockin_days INTEGER,
  xp_awarded INTEGER DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Create indexes for performance
CREATE INDEX idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX idx_focus_sessions_user_date ON focus_sessions(user_id, session_date);
CREATE INDEX idx_tasks_user_date ON tasks(user_id, task_date);
CREATE INDEX idx_study_cards_user ON study_cards(user_id);
CREATE INDEX idx_card_reviews_user_date ON card_reviews(user_id, review_date);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_daily_reflections_user_date ON daily_reflections(user_id, reflection_date);
CREATE INDEX idx_weekly_reviews_user_date ON weekly_reviews(user_id, week_start_date);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for daily_activities
CREATE POLICY "Users can view their own activities" ON daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for focus_sessions
CREATE POLICY "Users can view their own sessions" ON focus_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON focus_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for study_cards
CREATE POLICY "Users can view their own cards" ON study_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON study_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON study_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON study_cards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for card_reviews
CREATE POLICY "Users can view their own reviews" ON card_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews" ON card_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_reflections
CREATE POLICY "Users can view their own reflections" ON daily_reflections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections" ON daily_reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" ON daily_reflections
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for weekly_reviews
CREATE POLICY "Users can view their own reviews" ON weekly_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews" ON weekly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON weekly_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for daily_activities
CREATE TRIGGER update_daily_activities_updated_at BEFORE UPDATE ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for focus_sessions
CREATE TRIGGER update_focus_sessions_updated_at BEFORE UPDATE ON focus_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for tasks
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
