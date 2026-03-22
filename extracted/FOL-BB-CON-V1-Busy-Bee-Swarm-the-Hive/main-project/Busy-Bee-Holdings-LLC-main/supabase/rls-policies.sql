-- ============================================
-- Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor
-- NOTE: Use CREATE OR REPLACE if policies already exist
-- ============================================

-- Enable RLS on all user tables (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- ACHIEVEMENTS (Reference table - read only for all)
-- ============================================

-- Everyone can read achievement definitions
CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions
  FOR SELECT
  USING (true);

-- Users can read their own achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert user achievements (via triggers)
-- No direct INSERT/UPDATE/DELETE for users

-- ============================================
-- POINTS & LEVELS
-- ============================================

-- Users can read their own point transactions
CREATE POLICY "Users can view own points" ON public.point_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only system functions can insert point transactions
-- No direct INSERT/UPDATE/DELETE for users

-- Public read for level definitions
CREATE POLICY "Anyone can view levels" ON public.level_definitions
  FOR SELECT
  USING (true);

-- ============================================
-- GOALS
-- ============================================

-- Users can CRUD their own goals
CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Goal Milestones
CREATE POLICY "Users can view own goal milestones" ON public.goal_milestones
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id
    )
  );

CREATE POLICY "Users can insert own goal milestones" ON public.goal_milestones
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id
    )
  );

CREATE POLICY "Users can update own goal milestones" ON public.goal_milestones
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id
    )
  );

CREATE POLICY "Users can delete own goal milestones" ON public.goal_milestones
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id
    )
  );

-- ============================================
-- HABITS
-- ============================================

CREATE POLICY "Users can view own habits" ON public.habits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON public.habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON public.habits
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON public.habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- Habit Completions
CREATE POLICY "Users can view own habit completions" ON public.habit_completions
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id
    )
  );

CREATE POLICY "Users can insert own habit completions" ON public.habit_completions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id
    )
  );

CREATE POLICY "Users can delete own habit completions" ON public.habit_completions
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id
    )
  );

-- ============================================
-- FINANCE
-- ============================================

CREATE POLICY "Users can view own accounts" ON public.accounts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON public.accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Budgets
CREATE POLICY "Users can view own budgets" ON public.budgets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON public.budgets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON public.budgets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON public.budgets
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- HEALTH
-- ============================================

CREATE POLICY "Users can view own health metrics" ON public.health_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics" ON public.health_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics" ON public.health_metrics
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics" ON public.health_metrics
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LEADERBOARD (Read-only for authenticated users)
-- ============================================

-- Authenticated users can view leaderboard
CREATE POLICY "Authenticated users can view leaderboard" ON public.leaderboard
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role can update leaderboard (via cron/edge functions)
-- No INSERT/UPDATE/DELETE policies for regular users

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get current user ID (for use in applications)
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
STABLE
LANGUAGE SQL
AS $$
  SELECT auth.uid();
$$;

-- Function to check if user owns a record
CREATE OR REPLACE FUNCTION public.user_owns_record(p_user_id UUID)
RETURNS BOOLEAN
STABLE
LANGUAGE SQL
AS $$
  SELECT auth.uid() = p_user_id;
$$;
