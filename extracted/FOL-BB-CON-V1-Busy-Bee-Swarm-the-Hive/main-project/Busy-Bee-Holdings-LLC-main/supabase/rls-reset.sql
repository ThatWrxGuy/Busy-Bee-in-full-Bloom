-- ============================================
-- RLS Policies - Drop and Recreate
-- Run this to reset all policies cleanly
-- ============================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievement_definitions;
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can view own points" ON public.point_transactions;
DROP POLICY IF EXISTS "Anyone can view levels" ON public.level_definitions;
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own goal milestones" ON public.goal_milestones;
DROP POLICY IF EXISTS "Users can insert own goal milestones" ON public.goal_milestones;
DROP POLICY IF EXISTS "Users can update own goal milestones" ON public.goal_milestones;
DROP POLICY IF EXISTS "Users can delete own goal milestones" ON public.goal_milestones;
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can insert own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can delete own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can view own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can delete own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can insert own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can update own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can delete own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can view own health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Users can insert own health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Users can update own health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Users can delete own health metrics" ON public.health_metrics;
DROP POLICY IF EXISTS "Authenticated users can view leaderboard" ON public.leaderboard;

-- Now create fresh policies (same as rls-policies.sql)

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ACHIEVEMENTS
CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions FOR SELECT USING (true);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- POINTS & LEVELS
CREATE POLICY "Users can view own points" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view levels" ON public.level_definitions FOR SELECT USING (true);

-- GOALS
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- GOAL MILESTONES
CREATE POLICY "Users can view own goal milestones" ON public.goal_milestones FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id));
CREATE POLICY "Users can insert own goal milestones" ON public.goal_milestones FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id));
CREATE POLICY "Users can update own goal milestones" ON public.goal_milestones FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id));
CREATE POLICY "Users can delete own goal milestones" ON public.goal_milestones FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.goals WHERE id = goal_milestones.goal_id));

-- HABITS
CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- HABIT COMPLETIONS
CREATE POLICY "Users can view own habit completions" ON public.habit_completions FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id));
CREATE POLICY "Users can insert own habit completions" ON public.habit_completions FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id));
CREATE POLICY "Users can delete own habit completions" ON public.habit_completions FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.habits WHERE id = habit_completions.habit_id));

-- FINANCE - ACCOUNTS
CREATE POLICY "Users can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- FINANCE - TRANSACTIONS
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- FINANCE - BUDGETS
CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

-- HEALTH
CREATE POLICY "Users can view own health metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health metrics" ON public.health_metrics FOR DELETE USING (auth.uid() = user_id);

-- LEADERBOARD
CREATE POLICY "Authenticated users can view leaderboard" ON public.leaderboard FOR SELECT USING (auth.role() = 'authenticated');
