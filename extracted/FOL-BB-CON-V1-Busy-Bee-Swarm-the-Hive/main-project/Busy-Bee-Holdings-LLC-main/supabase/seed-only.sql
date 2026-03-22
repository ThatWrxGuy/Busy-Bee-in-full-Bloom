-- Just seed the data (assuming tables exist)

-- Seed Achievement Definitions
INSERT INTO public.achievement_definitions (name, description, icon, category, points, requirement_type, requirement_value) VALUES
('First Saver', 'Save your first $100', '💰', 'Finance', 100, 'numeric', 100),
('Budget Master', 'Stay under budget for 30 days', '📊', 'Finance', 250, 'streak', 30),
('Emergency Fund', 'Save $1,000 in emergency fund', '🛡️', 'Finance', 300, 'numeric', 1000),
('High Yield Hero', 'Open a high-yield savings account', '🏦', 'Finance', 200, 'boolean', 1),
('Debt Destroyer', 'Pay off $1,000 in debt', '🔥', 'Finance', 350, 'numeric', 1000),
('Millionaire Mindset', 'Save $10,000 total', '💎', 'Finance', 1000, 'numeric', 10000),
('Goal Setter', 'Complete your first goal', '🎯', 'Goals', 50, 'numeric', 1),
('Goal Getter', 'Complete 10 goals', '🏃', 'Goals', 200, 'numeric', 10),
('Goal Crusher', 'Complete 50 goals', '💪', 'Goals', 500, 'numeric', 50),
('Streak Starter', '7-day goal completion streak', '⚡', 'Goals', 150, 'streak', 7),
('First Step', 'Log your first workout', '👟', 'Health', 25, 'numeric', 1),
('Fitness Fan', 'Workout 20 times', '💪', 'Health', 200, 'numeric', 20),
('Marathon Runner', 'Workout 100 times', '🏅', 'Health', 500, 'numeric', 100),
('Health Hero', 'Hit all health targets for a week', '🦸', 'Health', 300, 'streak', 7),
('Habit Former', 'Create your first habit', '🌱', 'Habits', 50, 'numeric', 1),
('Streak Legend', '100-day habit streak', '🔥', 'Habits', 750, 'streak', 100),
('Morning Routine', 'Morning routine for 30 days', '🌅', 'Habits', 250, 'streak', 30),
('Social Butterfly', 'Connect with 5 friends', '🦋', 'Relationships', 100, 'numeric', 5),
('Family Time', 'Family dinner for 30 days', '🍽️', 'Relationships', 300, 'streak', 30),
('Community Leader', 'Refer 3 friends', '👥', 'Relationships', 250, 'numeric', 3)
ON CONFLICT DO NOTHING;

-- Seed Level Definitions
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

-- Profile trigger
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
