import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: username,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Achievement helpers
export const getAchievements = async () => {
  const { data, error } = await supabase
    .from('achievement_definitions')
    .select('*')
    .order('category', { ascending: true })
    .order('points', { ascending: true });
  return { data, error };
};

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievement_definitions (*)
    `)
    .eq('user_id', userId);
  return { data, error };
};

export const awardAchievement = async (userId, achievementId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({ user_id: userId, achievement_id: achievementId })
    .select()
    .single();
  return { data, error };
};

// Points & Level helpers
export const addPoints = async (userId, points, action, domain = null, description = null) => {
  // Call the database function
  const { data, error } = await supabase.rpc('add_points', {
    p_user_id: userId,
    p_points: points,
    p_action: action,
    p_domain: domain,
    p_description: description,
  });
  return { data, error };
};

export const getLevels = async () => {
  const { data, error } = await supabase
    .from('level_definitions')
    .select('*')
    .order('level', { ascending: true });
  return { data, error };
};

export const getPointHistory = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

// Goals helpers - RLS handles user filtering automatically
export const getGoals = async () => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createGoal = async (goal) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();
  return { data, error };
};

export const updateGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', goalId)
    .select()
    .single();
  return { data, error };
};

export const completeGoal = async (goalId) => {
  const { data, error } = await supabase
    .from('goals')
    .update({ status: 'completed', completed_at: new Date(), updated_at: new Date() })
    .eq('id', goalId)
    .select()
    .single();
  return { data, error };
};

export const deleteGoal = async (goalId) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);
  return { error };
};

// Habits helpers - RLS handles user filtering automatically
export const getHabits = async () => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createHabit = async (habit) => {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();
  return { data, error };
};

export const completeHabit = async (habitId) => {
  const now = new Date();
  const { data: habit, error: fetchError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();
  
  if (fetchError) return { data: null, error: fetchError };
  
  // Calculate new streak
  const lastCompleted = habit.last_completed_at ? new Date(habit.last_completed_at) : null;
  let newStreak = habit.streak;
  let newBestStreak = habit.best_streak;
  
  if (lastCompleted) {
    const daysDiff = Math.floor((now - lastCompleted) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      newStreak = habit.streak + 1;
      newBestStreak = Math.max(newBestStreak, newStreak);
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
    newBestStreak = 1;
  }
  
  // Update habit
  const { data, error } = await supabase
    .from('habits')
    .update({
      streak: newStreak,
      best_streak: newBestStreak,
      completed_today: true,
      last_completed_at: now,
    })
    .eq('id', habitId)
    .select()
    .single();
  
  // Log completion
  if (!error) {
    await supabase.from('habit_completions').insert({
      habit_id: habitId,
      completed_at: now,
    });
  }
  
  return { data, error };
};

export const deleteHabit = async (habitId) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);
  return { error };
};

// Finance helpers
export const getAccounts = async (userId) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createAccount = async (account) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single();
  return { data, error };
};

export const getTransactions = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const createTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  return { data, error };
};

export const getBudgets = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

// Health helpers
export const getHealthMetrics = async (userId, metricType = null) => {
  let query = supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (metricType) {
    query = query.eq('metric_type', metricType);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const logHealthMetric = async (metric) => {
  const { data, error } = await supabase
    .from('health_metrics')
    .insert(metric)
    .select()
    .single();
  return { data, error };
};

// Leaderboard helpers
export const getLeaderboard = async (period = 'all_time', limit = 50) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select(`
      *,
      user:profiles (
        username,
        full_name,
        avatar_url,
        level
      )
    `)
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(limit);
  return { data, error };
};

export const refreshLeaderboard = async (period = 'all_time') => {
  // This would typically be a database function called via cron
  // For now, it recalculates and updates the leaderboard
  const { data, error } = await supabase.rpc('refresh_leaderboard', {
    p_period: period,
  });
  return { data, error };
};
