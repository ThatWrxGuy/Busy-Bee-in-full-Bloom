-- Add missing tables (skip if exists)

-- Achievement Definitions
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER
);

-- User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES public.achievement_definitions(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Point Transactions
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Level Definitions
CREATE TABLE IF NOT EXISTS public.level_definitions (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  reward TEXT,
  emoji TEXT
);

-- Goals
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  target_value INTEGER DEFAULT 1,
  current_value INTEGER DEFAULT 0,
  unit TEXT,
  deadline DATE,
  status TEXT DEFAULT 'active',
  points_value INTEGER DEFAULT 100,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT,
  frequency TEXT DEFAULT 'daily',
  streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  completed_today BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts (Finance)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Metrics
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  rank INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  badges_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- Enable RLS on new tables
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies (will fail if already exists, that's ok)
DO $$ 
BEGIN
  CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Anyone can view levels" ON public.level_definitions FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profile trigger (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed Achievements (skip if already seeded)
INSERT INTO public.achievement_definitions (name, description, icon, category, points, requirement_type, requirement_value) VALUES
('First Saver', 'Save your first $100', '💰', 'Finance', 100, 'numeric', 100),
('Budget Master', 'Stay under budget for 30 days', '📊', 'Finance', 250, 'streak', 30),
('Emergency Fund', 'Save $1,000 in emergency fund', '🛡️', 'Finance', 300, 'numeric', 1000),
('Goal Setter', 'Complete your first goal', '🎯', 'Goals', 50, 'numeric', 1),
('Goal Getter', 'Complete 10 goals', '🏃', 'Goals', 200, 'numeric', 10),
('First Step', 'Log your first workout', '👟', 'Health', 25, 'numeric', 1),
('Fitness Fan', 'Workout 20 times', '💪', 'Health', 200, 'numeric', 20),
('Habit Former', 'Create your first habit', '🌱', 'Habits', 50, 'numeric', 1),
('Streak Legend', '100-day habit streak', '🔥', 'Habits', 750, 'streak', 100),
('Social Butterfly', 'Connect with 5 friends', '🦋', 'Relationships', 100, 'numeric', 5)
ON CONFLICT DO NOTHING;

-- Seed Levels (skip if already seeded)
INSERT INTO public.level_definitions (level, name, min_xp, reward, emoji) VALUES
(1, 'Newcomer', 0, 'Welcome badge', '🌱'),
(5, 'Apprentice', 500, '5 bonus points/day', '🌿'),
(10, 'Explorer', 1500, 'Custom profile frame', '🔍'),
(15, 'Achiever', 3500, '10 bonus points/day', '⭐'),
(20, 'Goal Getter', 6000, 'Bronze profile border', '🎯'),
(25, 'Champion', 10000, '15 bonus points/day', '🏆'),
(30, 'Warrior', 15000, 'Silver profile border', '⚔️'),
(35, 'Master', 22000, '20 bonus points/day', '👑'),
(40, 'Legend', 32000, 'Gold profile border', '🔥'),
(45, 'Elite', 45000, 'Premium features unlocked', '💎'),
(50, 'Bee Master', 60000, 'Lifetime premium + Trophy', '🐝'),
(60, 'Platinum', 80000, 'Exclusive platinum badge', '💠'),
(70, 'Diamond', 105000, 'VIP support access', '💠'),
(80, 'Crown', 135000, 'Crown profile frame', '👑'),
(90, 'Supreme', 165000, 'All rewards unlocked', '🌟'),
(100, 'Transcendent', 200000, 'LEGENDARY status forever', '✨')
ON CONFLICT (level) DO NOTHING;
