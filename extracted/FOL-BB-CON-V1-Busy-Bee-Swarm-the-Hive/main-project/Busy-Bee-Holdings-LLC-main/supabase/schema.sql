-- Busy Bee Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- USERS & PROFILES
-- ============================================

-- Extended profile data (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================

-- Achievement definitions (static reference data)
CREATE TABLE public.achievement_definitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL, -- Finance, Goals, Health, Habits, Relationships
  points INTEGER DEFAULT 0,
  requirement_type TEXT, -- numeric, boolean, streak
  requirement_value INTEGER
);

-- User earned achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES public.achievement_definitions(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- POINTS & LEVELS
-- ============================================

-- Point transactions history
CREATE TABLE public.point_transactions (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL, -- goal_completed, habit_done, save_money, etc.
  domain TEXT, -- finance, health, goals, etc.
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Level definitions
CREATE TABLE public.level_definitions (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  reward TEXT,
  emoji TEXT
);

-- ============================================
-- GOALS
-- ============================================

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL, -- health, career, finance, etc.
  target_value INTEGER DEFAULT 1,
  current_value INTEGER DEFAULT 0,
  unit TEXT, -- dollars, hours, reps, etc.
  deadline DATE,
  status TEXT DEFAULT 'active', -- active, completed, abandoned
  points_value INTEGER DEFAULT 100,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal milestones
CREATE TABLE public.goal_milestones (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- ============================================
-- HABITS
-- ============================================

CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT, -- health, mindset, etc.
  frequency TEXT DEFAULT 'daily', -- daily, weekly
  streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  completed_today BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completion log
CREATE TABLE public.habit_completions (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ============================================
-- FINANCE
-- ============================================

CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- checking, savings, credit, investment
  balance DECIMAL(12,2) DEFAULT 0,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- income, expense, transfer
  category TEXT,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL,
  spent DECIMAL(12,2) DEFAULT 0,
  month INTEGER,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HEALTH
-- ============================================

CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- workout, sleep, water, weight, etc.
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADERBOARD
-- ============================================

-- Cached leaderboard for performance
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- weekly, monthly, all_time
  rank INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  badges_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_achievements_category ON achievement_definitions(category);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_health_metrics_user ON health_metrics(user_id);
CREATE INDEX idx_leaderboard_period ON leaderboard(period, rank);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own health" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for achievement definitions and level definitions
CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions FOR SELECT USING (true);
CREATE POLICY "Anyone can view levels" ON public.level_definitions FOR SELECT USING (true);

-- Leaderboard - public read, app managed
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard FOR SELECT USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert achievement definitions
INSERT INTO public.achievement_definitions (name, description, icon, category, points, requirement_type, requirement_value) VALUES
-- Finance (20)
('First Saver', 'Save your first $100', '💰', 'Finance', 100, 'numeric', 100),
('Budget Master', 'Stay under budget for 30 days', '📊', 'Finance', 250, 'streak', 30),
('Emergency Fund', 'Save $1,000 in emergency fund', '🛡️', 'Finance', 300, 'numeric', 1000),
('High Yield Hero', 'Open a high-yield savings account', '🏦', 'Finance', 200, 'boolean', 1),
('Debt Destroyer', 'Pay off $1,000 in debt', '🔥', 'Finance', 350, 'numeric', 1000),
('Millionaire Mindset', 'Save $10,000 total', '💎', 'Finance', 1000, 'numeric', 10000),
('Penny Pincher', 'Save $50 in one week', '🪙', 'Finance', 75, 'numeric', 50),
('Investment Initiate', 'Make your first investment', '📈', 'Finance', 200, 'boolean', 1),
('Retirement Ready', 'Contribute to retirement account', '🏖️', 'Finance', 400, 'numeric', 1000),
('Tax Titan', 'File taxes early', '📋', 'Finance', 100, 'boolean', 1),
('Frugal Foodie', 'Cook at home for 30 days', '🍳', 'Finance', 250, 'streak', 30),
('Bargain Hunter', 'Use 10 coupons', '🏷️', 'Finance', 150, 'numeric', 10),
('No-Spend Week', 'Spend $0 for 7 days', '🚫', 'Finance', 300, 'streak', 7),
('Financial Advisor', 'Help friend with budget', '🤝', 'Finance', 100, 'numeric', 1),
('Side Hustle Star', 'Earn $500 from side gig', '💼', 'Finance', 350, 'numeric', 500),
('Bill Negotiator', 'Negotiate lower bill', '📞', 'Finance', 125, 'numeric', 1),
('Price Compare', 'Compare prices on 5 items', '🔍', 'Finance', 75, 'numeric', 5),
('Emergency Prepared', 'Have 3 months expenses saved', '🎒', 'Finance', 500, 'numeric', 3),
('Credit Score Hero', 'Improve score by 50 points', '📶', 'Finance', 250, 'numeric', 50),
('Wealth Builder', 'Save $50,000 total', '🏰', 'Finance', 2000, 'numeric', 50000),

-- Goals (20)
('Goal Setter', 'Complete your first goal', '🎯', 'Goals', 50, 'numeric', 1),
('Goal Getter', 'Complete 10 goals', '🏃', 'Goals', 200, 'numeric', 10),
('Goal Crusher', 'Complete 50 goals', '💪', 'Goals', 500, 'numeric', 50),
('Streak Starter', '7-day goal completion streak', '⚡', 'Goals', 150, 'streak', 7),
('Goal Machine', 'Complete 100 goals', '🤖', 'Goals', 1000, 'numeric', 100),
('Daily Driver', 'Complete a daily goal for 30 days', '📅', 'Goals', 400, 'streak', 30),
('Big Dreamer', 'Set a goal over $10,000', '🌟', 'Goals', 150, 'numeric', 1),
('Quick Finisher', 'Complete goal ahead of schedule', '🏎️', 'Goals', 100, 'numeric', 1),
('Goal Planner', 'Plan goals for next 6 months', '📝', 'Goals', 75, 'numeric', 1),
('Goal Sharer', 'Share goal progress publicly', '📣', 'Goals', 50, 'numeric', 1),
('Goal Coach', 'Help someone else complete a goal', '👨‍🏫', 'Goals', 200, 'numeric', 1),
('Diverse Goals', 'Have goals in 5 different domains', '🎨', 'Goals', 150, 'numeric', 5),
('First Step', 'Start your first goal', '👣', 'Goals', 25, 'numeric', 1),
('Goal Refiner', 'Edit goal details 3 times', '✏️', 'Goals', 50, 'numeric', 3),
('Goal Reviewer', 'Review all active goals weekly for month', '🔄', 'Goals', 200, 'streak', 4),
('No Procrastinator', 'Complete goal on first day', '⏰', 'Goals', 75, 'numeric', 1),
('Category King', 'Complete 20 goals in one category', '👑', 'Goals', 400, 'numeric', 20),
('Goal Mentor', 'Create goal template for others', '📋', 'Goals', 125, 'numeric', 1),
('Milestone Maker', 'Hit 5 milestones in one goal', '🏁', 'Goals', 175, 'numeric', 5),
('Legendary Goal', 'Complete a goal worth 500+ points', '🏆', 'Goals', 500, 'numeric', 1),

-- Health (20)
('First Step', 'Log your first workout', '👟', 'Health', 25, 'numeric', 1),
('Fitness Fan', 'Workout 20 times', '💪', 'Health', 200, 'numeric', 20),
('Marathon Runner', 'Workout 100 times', '🏅', 'Health', 500, 'numeric', 100),
('Health Hero', 'Hit all health targets for a week', '🦸', 'Health', 300, 'streak', 7),
('Early Bird', 'Morning workout 7 days in a row', '🌅', 'Health', 150, 'streak', 7),
('Night Owl', 'Evening workout 7 days in a row', '🌙', 'Health', 150, 'streak', 7),
('Consistency King', 'Workout every day for 30 days', '👑', 'Health', 750, 'streak', 30),
('Variety Pack', 'Try 10 different workout types', '🎁', 'Health', 200, 'numeric', 10),
('Strength Starter', 'Lift weights for first time', '🏋️', 'Health', 50, 'numeric', 1),
('Cardio Queen', 'Run/walk 50 miles total', '👸', 'Health', 400, 'numeric', 50),
('Yoga Master', 'Complete 30 yoga sessions', '🧘', 'Health', 300, 'numeric', 30),
('Swimmer', 'Swim 10 miles', '🏊', 'Health', 350, 'numeric', 10),
('Stair Climber', 'Take 10,000 stairs in a week', '🪜', 'Health', 100, 'numeric', 1),
('Active Minutes', 'Get 300 active minutes in a week', '⏱️', 'Health', 150, 'numeric', 1),
('Step Champion', 'Walk 100,000 steps', '👣', 'Health', 200, 'numeric', 100000),
('Gym Rat', 'Visit gym 50 times', '🏟️', 'Health', 400, 'numeric', 50),
('Home Workout Hero', '30 home workouts', '🏠', 'Health', 250, 'numeric', 30),
('Sports Star', 'Play sports 10 times', '⚽', 'Health', 175, 'numeric', 10),
('Challenge Accepted', 'Complete fitness challenge', '🎖️', 'Health', 200, 'numeric', 1),
('Wellness Warrior', 'Hit all daily health metrics for month', '⚔️', 'Health', 1000, 'streak', 30),

-- Habits (20)
('Habit Former', 'Create your first habit', '🌱', 'Habits', 50, 'numeric', 1),
('Habit Master', 'Maintain 5 habits for 30 days', '🎓', 'Habits', 300, 'streak', 30),
('Streak Legend', '100-day habit streak', '🔥', 'Habits', 750, 'streak', 100),
('Morning Routine', 'Morning routine for 30 days', '🌅', 'Habits', 250, 'streak', 30),
('Night Routine', 'Evening routine for 30 days', '🌙', 'Habits', 250, 'streak', 30),
('Hydration Hero', 'Drink 8 glasses daily for 14 days', '💧', 'Habits', 150, 'streak', 14),
('Sleep Champion', '8 hours sleep for 30 days', '😴', 'Habits', 300, 'streak', 30),
('Screen Free', 'No screens 1 hour before bed for 30 days', '📵', 'Habits', 200, 'streak', 30),
('Water Drinker', 'Hit water goal for 21 days', '🚰', 'Habits', 175, 'streak', 21),
('No Snoozer', 'No hitting snooze for 14 days', '⏰', 'Habits', 125, 'streak', 14),
('Grateful Heart', 'Gratitude journal for 30 days', '🙏', 'Habits', 250, 'streak', 30),
('Meditation Maven', 'Meditate daily for 60 days', '🧘‍♀️', 'Habits', 500, 'streak', 60),
('Reading Routine', 'Read for 30 mins daily for 30 days', '📖', 'Habits', 300, 'streak', 30),
('Clean Eater', 'No sugar for 30 days', '🥗', 'Habits', 350, 'streak', 30),
('No Social Media', 'No social media for 7 days', '🚫', 'Habits', 150, 'streak', 7),
('Early Riser', 'Wake up at 5am for 14 days', '🌞', 'Habits', 200, 'streak', 14),
('Consistent Creator', 'Create content daily for 30 days', '✍️', 'Habits', 300, 'streak', 30),
('Organization Pro', 'Clean workspace daily for 30 days', '🧹', 'Habits', 200, 'streak', 30),
('Mindful Moments', 'Daily mindfulness for 45 days', '🧠', 'Habits', 400, 'streak', 45),
('Habit Architect', 'Build 10 habits simultaneously', '🏗️', 'Habits', 500, 'numeric', 10),

-- Relationships (20)
('Social Butterfly', 'Connect with 5 friends', '🦋', 'Relationships', 100, 'numeric', 5),
('Community Leader', 'Refer 3 friends', '👥', 'Relationships', 250, 'numeric', 3),
('Family Time', 'Family dinner for 30 days', '🍽️', 'Relationships', 300, 'streak', 30),
('Phone-Free Night', 'No phone during dinner for 30 days', '📵', 'Relationships', 200, 'streak', 30),
('Quality Time', '3+ hours quality time weekly for month', '⏳', 'Relationships', 250, 'numeric', 4),
('Gift Giver', 'Give meaningful gifts to 5 people', '🎁', 'Relationships', 150, 'numeric', 5),
('Active Listener', 'Practice active listening for 30 days', '👂', 'Relationships', 200, 'streak', 30),
('Appreciation Express', 'Express gratitude to 10 people', '💌', 'Relationships', 175, 'numeric', 10),
('Event Planner', 'Host a gathering', '🎉', 'Relationships', 100, 'numeric', 1),
('Friend Anniversary', 'Maintain friendship for 5+ years', '🎊', 'Relationships', 150, 'numeric', 1),
('Date Night', 'Weekly date nights for month', '💕', 'Relationships', 200, 'numeric', 4),
('Parenting Pro', 'Dedicated kid time for 30 days', '👶', 'Relationships', 250, 'streak', 30),
('Reunion Hero', 'Organize family reunion', '👨‍👩‍👧‍👦', 'Relationships', 300, 'numeric', 1),
('Neighborly Love', 'Help 5 neighbors', '🏘️', 'Relationships', 125, 'numeric', 5),
('Pet Parent', 'Spend quality time with pet daily', '🐕', 'Relationships', 100, 'streak', 30),
('Mentorship Matters', 'Mentor someone for 3 months', '🌟', 'Relationships', 400, 'streak', 90),
('Team Player', 'Join and participate in group', '👥', 'Relationships', 150, 'numeric', 1),
('Celebration Star', 'Remember 10 birthdays', '🎂', 'Relationships', 200, 'numeric', 10),
('Open Book', 'Share something vulnerable with friend', '📖', 'Relationships', 100, 'numeric', 1),
('Relationship Master', 'Nurture all relationship types', '💎', 'Relationships', 750, 'numeric', 5);

-- Insert level definitions
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
(100, 'Transcendent', 200000, 'LEGENDARY status forever', '✨');

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update XP and check level ups
CREATE OR REPLACE FUNCTION public.add_points(
  p_user_id UUID,
  p_points INTEGER,
  p_action TEXT,
  p_domain TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_current_level INTEGER;
BEGIN
  -- Add points transaction
  INSERT INTO public.point_transactions (user_id, points, action, domain, description)
  VALUES (p_user_id, p_points, p_action, p_domain, p_description);
  
  -- Update profile XP
  UPDATE public.profiles
  SET total_xp = total_xp + p_points,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Get current level
  SELECT level INTO v_current_level
  FROM public.level_definitions
  WHERE min_xp <= (SELECT total_xp FROM public.profiles WHERE id = p_user_id)
  ORDER BY level DESC
  LIMIT 1;
  
  -- Update user level if changed
  UPDATE public.profiles
  SET level = v_current_level
  WHERE id = p_user_id AND level != v_current_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
