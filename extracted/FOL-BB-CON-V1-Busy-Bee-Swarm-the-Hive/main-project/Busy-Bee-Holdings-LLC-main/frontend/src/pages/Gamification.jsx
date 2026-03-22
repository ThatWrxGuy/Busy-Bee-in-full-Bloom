/**
 * Busy Bee Gamification Dashboard - Design System Implementation
 * Achievements, points, leaderboards, and milestones
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiAward, FiStar, FiZap, FiTarget, FiUsers, FiGift, FiLock, FiCheck, FiTrending, FiDollarSign, FiActivity, FiHeart, FiBook, FiClock, FiCalendar } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Progress,
  Grid,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────

// User's current progress
const mockUserProgress = {
  level: 12,
  levelName: 'Explorer',
  currentXP: 2450,
  nextLevelXP: 3500,
  totalPoints: 12450,
  rank: 42,
  totalUsers: 1250,
  streak: 14,
  badges: 7,
};

// Points earning opportunities
const mockActions = [
  { id: 1, action: 'Complete a goal', points: 100, category: 'Goals', icon: FiTarget },
  { id: 2, action: 'Save $100', points: 50, category: 'Finance', icon: FiDollarSign },
  { id: 3, action: 'Workout session', points: 30, category: 'Health', icon: FiActivity },
  { id: 4, action: 'Daily habit check', points: 10, category: 'Habits', icon: FiCheck },
  { id: 5, action: 'Log meditation', points: 15, category: 'Mindset', icon: FiZap },
  { id: 6, action: 'Read 30 mins', points: 20, category: 'Education', icon: FiBook },
  { id: 7, action: 'Connect with friend', points: 25, category: 'Social', icon: FiUsers },
  { id: 8, action: 'Weekly review', points: 75, category: 'Productivity', icon: FiCalendar },
];

// Achievements/Badges - 20 per domain (100 total)
const mockAchievements = [
  // Finance Badges (20)
  { id: 1, name: 'First Saver', description: 'Save your first $100', icon: '💰', category: 'Finance', earned: true, earnedDate: 'Jan 15, 2024', points: 100 },
  { id: 2, name: 'Budget Master', description: 'Stay under budget for 30 days', icon: '📊', category: 'Finance', earned: true, earnedDate: 'Feb 1, 2024', points: 250 },
  { id: 3, name: 'Emergency Fund', description: 'Save $1,000 in emergency fund', icon: '🛡️', category: 'Finance', earned: true, earnedDate: 'Jan 20, 2024', points: 300 },
  { id: 4, name: 'High Yield Hero', description: 'Open a high-yield savings account', icon: '🏦', category: 'Finance', earned: true, earnedDate: 'Feb 10, 2024', points: 200 },
  { id: 5, name: 'Debt Destroyer', description: 'Pay off $1,000 in debt', icon: '🔥', category: 'Finance', earned: false, points: 350 },
  { id: 6, name: 'Millionaire Mindset', description: 'Save $10,000 total', icon: '💎', category: 'Finance', earned: false, points: 1000 },
  { id: 7, name: 'Penny Pincher', description: 'Save $50 in one week', icon: '🪙', category: 'Finance', earned: true, earnedDate: 'Jan 8, 2024', points: 75 },
  { id: 8, name: 'Investment Initiate', description: 'Make your first investment', icon: '📈', category: 'Finance', earned: false, points: 200 },
  { id: 9, name: 'Retirement Ready', description: 'Contribute to retirement account', icon: '🏖️', category: 'Finance', earned: false, points: 400 },
  { id: 10, name: 'Tax Titan', description: 'File taxes early', icon: '📋', category: 'Finance', earned: false, points: 100 },
  { id: 11, name: 'Frugal Foodie', description: 'Cook at home for 30 days', icon: '🍳', category: 'Finance', earned: false, points: 250 },
  { id: 12, name: 'Bargain Hunter', description: 'Use 10 coupons', icon: '🏷️', category: 'Finance', earned: false, points: 150 },
  { id: 13, name: 'No-Spend Week', description: 'Spend $0 for 7 days', icon: '🚫', category: 'Finance', earned: false, points: 300 },
  { id: 14, name: 'Financial Advisor', description: 'Help friend with budget', icon: '🤝', category: 'Finance', earned: false, points: 100 },
  { id: 15, name: 'Side Hustle Star', description: 'Earn $500 from side gig', icon: '💼', category: 'Finance', earned: false, points: 350 },
  { id: 16, name: 'Bill Negotiator', description: 'Negotiate lower bill', icon: '📞', category: 'Finance', earned: false, points: 125 },
  { id: 17, name: 'Price Compare', description: 'Compare prices on 5 items', icon: '🔍', category: 'Finance', earned: false, points: 75 },
  { id: 18, name: 'Emergency Prepared', description: 'Have 3 months expenses saved', icon: '🎒', category: 'Finance', earned: false, points: 500 },
  { id: 19, name: 'Credit Score Hero', description: 'Improve score by 50 points', icon: '📶', category: 'Finance', earned: false, points: 250 },
  { id: 20, name: 'Wealth Builder', description: 'Save $50,000 total', icon: '🏰', category: 'Finance', earned: false, points: 2000 },
  
  // Goals Badges (20)
  { id: 21, name: 'Goal Setter', description: 'Complete your first goal', icon: '🎯', category: 'Goals', earned: true, earnedDate: 'Jan 10, 2024', points: 50 },
  { id: 22, name: 'Goal Getter', description: 'Complete 10 goals', icon: '🏃', category: 'Goals', earned: true, earnedDate: 'Feb 5, 2024', points: 200 },
  { id: 23, name: 'Goal Crusher', description: 'Complete 50 goals', icon: '💪', category: 'Goals', earned: false, points: 500 },
  { id: 24, name: 'Streak Starter', description: '7-day goal completion streak', icon: '⚡', category: 'Goals', earned: true, earnedDate: 'Jan 25, 2024', points: 150 },
  { id: 25, name: 'Goal Machine', description: 'Complete 100 goals', icon: '🤖', category: 'Goals', earned: false, points: 1000 },
  { id: 26, name: 'Daily Driver', description: 'Complete a daily goal for 30 days', icon: '📅', category: 'Goals', earned: false, points: 400 },
  { id: 27, name: 'Big Dreamer', description: 'Set a goal over $10,000', icon: '🌟', category: 'Goals', earned: false, points: 150 },
  { id: 28, name: 'Quick Finisher', description: 'Complete goal ahead of schedule', icon: '🏎️', category: 'Goals', earned: false, points: 100 },
  { id: 29, name: 'Goal Planner', description: 'Plan goals for next 6 months', icon: '📝', category: 'Goals', earned: false, points: 75 },
  { id: 30, name: 'Goal Sharer', description: 'Share goal progress publicly', icon: '📣', category: 'Goals', earned: false, points: 50 },
  { id: 31, name: 'Goal Coach', description: 'Help someone else complete a goal', icon: '👨‍🏫', category: 'Goals', earned: false, points: 200 },
  { id: 32, name: 'Diverse Goals', description: 'Have goals in 5 different domains', icon: '🎨', category: 'Goals', earned: false, points: 150 },
  { id: 33, name: 'First Step', description: 'Start your first goal', icon: '👣', category: 'Goals', earned: true, earnedDate: 'Jan 5, 2024', points: 25 },
  { id: 34, name: 'Goal Refiner', description: 'Edit goal details 3 times', icon: '✏️', category: 'Goals', earned: false, points: 50 },
  { id: 35, name: 'Goal Reviewer', description: 'Review all active goals weekly for month', icon: '🔄', category: 'Goals', earned: false, points: 200 },
  { id: 36, name: 'No Procrastinator', description: 'Complete goal on first day', icon: '⏰', category: 'Goals', earned: false, points: 75 },
  { id: 37, name: 'Category King', description: 'Complete 20 goals in one category', icon: '👑', category: 'Goals', earned: false, points: 400 },
  { id: 38, name: 'Goal Mentor', description: 'Create goal template for others', icon: '📋', category: 'Goals', earned: false, points: 125 },
  { id: 39, name: 'Milestone Maker', description: 'Hit 5 milestones in one goal', icon: '🏁', category: 'Goals', earned: false, points: 175 },
  { id: 40, name: 'Legendary Goal', description: 'Complete a goal worth 500+ points', icon: '🏆', category: 'Goals', earned: false, points: 500 },
  
  // Health Badges (20)
  { id: 41, name: 'First Step', description: 'Log your first workout', icon: '👟', category: 'Health', earned: true, earnedDate: 'Jan 5, 2024', points: 25 },
  { id: 42, name: 'Fitness Fan', description: 'Workout 20 times', icon: '💪', category: 'Health', earned: true, earnedDate: 'Feb 8, 2024', points: 200 },
  { id: 43, name: 'Marathon Runner', description: 'Workout 100 times', icon: '🏅', category: 'Health', earned: false, points: 500 },
  { id: 44, name: 'Health Hero', description: 'Hit all health targets for a week', icon: '🦸', category: 'Health', earned: false, points: 300 },
  { id: 45, name: 'Early Bird', description: 'Morning workout 7 days in a row', icon: '🌅', category: 'Health', earned: false, points: 150 },
  { id: 46, name: 'Night Owl', description: 'Evening workout 7 days in a row', icon: '🌙', category: 'Health', earned: false, points: 150 },
  { id: 47, name: 'Consistency King', description: 'Workout every day for 30 days', icon: '👑', category: 'Health', earned: false, points: 750 },
  { id: 48, name: 'Variety Pack', description: 'Try 10 different workout types', icon: '🎁', category: 'Health', earned: false, points: 200 },
  { id: 49, name: 'Strength Starter', description: 'Lift weights for first time', icon: '🏋️', category: 'Health', earned: false, points: 50 },
  { id: 50, name: 'Cardio Queen', description: 'Run/walk 50 miles total', icon: '👸', category: 'Health', earned: false, points: 400 },
  { id: 51, name: 'Yoga Master', description: 'Complete 30 yoga sessions', icon: '🧘', category: 'Health', earned: false, points: 300 },
  { id: 52, name: 'Swimmer', description: 'Swim 10 miles', icon: '🏊', category: 'Health', earned: false, points: 350 },
  { id: 53, name: 'Stair Climber', description: 'Take 10,000 stairs in a week', icon: '🪜', category: 'Health', earned: false, points: 100 },
  { id: 54, name: 'Active Minutes', description: 'Get 300 active minutes in a week', icon: '⏱️', category: 'Health', earned: false, points: 150 },
  { id: 55, name: 'Step Champion', description: 'Walk 100,000 steps', icon: '👣', category: 'Health', earned: false, points: 200 },
  { id: 56, name: 'Gym Rat', description: 'Visit gym 50 times', icon: '🏟️', category: 'Health', earned: false, points: 400 },
  { id: 57, name: 'Home Workout Hero', description: '30 home workouts', icon: '🏠', category: 'Health', earned: false, points: 250 },
  { id: 58, name: 'Sports Star', description: 'Play sports 10 times', icon: '⚽', category: 'Health', earned: false, points: 175 },
  { id: 59, name: 'Challenge Accepted', description: 'Complete fitness challenge', icon: '🎖️', category: 'Health', earned: false, points: 200 },
  { id: 60, name: 'Wellness Warrior', description: 'Hit all daily health metrics for month', icon: '⚔️', category: 'Health', earned: false, points: 1000 },
  
  // Habits Badges (20)
  { id: 61, name: 'Habit Former', description: 'Create your first habit', icon: '🌱', category: 'Habits', earned: false, points: 50 },
  { id: 62, name: 'Habit Master', description: 'Maintain 5 habits for 30 days', icon: '🎓', category: 'Habits', earned: false, points: 300 },
  { id: 63, name: 'Streak Legend', description: '100-day habit streak', icon: '🔥', category: 'Habits', earned: false, points: 750 },
  { id: 64, name: 'Morning Routine', description: 'Morning routine for 30 days', icon: '🌅', category: 'Habits', earned: false, points: 250 },
  { id: 65, name: 'Night Routine', description: 'Evening routine for 30 days', icon: '🌙', category: 'Habits', earned: false, points: 250 },
  { id: 66, name: 'Hydration Hero', description: 'Drink 8 glasses daily for 14 days', icon: '💧', category: 'Habits', earned: false, points: 150 },
  { id: 67, name: 'Sleep Champion', description: '8 hours sleep for 30 days', icon: '😴', category: 'Habits', earned: false, points: 300 },
  { id: 68, name: 'Screen Free', description: 'No screens 1 hour before bed for 30 days', icon: '📵', category: 'Habits', earned: false, points: 200 },
  { id: 69, name: 'Water Drinker', description: 'Hit water goal for 21 days', icon: '🚰', category: 'Habits', earned: false, points: 175 },
  { id: 70, name: 'No Snoozer', description: 'No hitting snooze for 14 days', icon: '⏰', category: 'Habits', earned: false, points: 125 },
  { id: 71, name: 'Grateful Heart', description: 'Gratitude journal for 30 days', icon: '🙏', category: 'Habits', earned: false, points: 250 },
  { id: 72, name: 'Meditation Maven', description: 'Meditate daily for 60 days', icon: '🧘‍♀️', category: 'Habits', earned: false, points: 500 },
  { id: 73, name: 'Reading Routine', description: 'Read for 30 mins daily for 30 days', icon: '📖', category: 'Habits', earned: false, points: 300 },
  { id: 74, name: 'Clean Eater', description: 'No sugar for 30 days', icon: '🥗', category: 'Habits', earned: false, points: 350 },
  { id: 75, name: 'No Social Media', description: 'No social media for 7 days', icon: '🚫', category: 'Habits', earned: false, points: 150 },
  { id: 76, name: 'Early Riser', description: 'Wake up at 5am for 14 days', icon: '🌞', category: 'Habits', earned: false, points: 200 },
  { id: 77, name: 'Consistent Creator', description: 'Create content daily for 30 days', icon: '✍️', category: 'Habits', earned: false, points: 300 },
  { id: 78, name: 'Organization Pro', description: 'Clean workspace daily for 30 days', icon: '🧹', category: 'Habits', earned: false, points: 200 },
  { id: 79, name: 'Mindful Moments', description: 'Daily mindfulness for 45 days', icon: '🧠', category: 'Habits', earned: false, points: 400 },
  { id: 80, name: 'Habit Architect', description: 'Build 10 habits simultaneously', icon: '🏗️', category: 'Habits', earned: false, points: 500 },
  
  // Relationships/Family Badges (20)
  { id: 81, name: 'Social Butterfly', description: 'Connect with 5 friends', icon: '🦋', category: 'Relationships', earned: true, earnedDate: 'Jan 18, 2024', points: 100 },
  { id: 82, name: 'Community Leader', description: 'Refer 3 friends', icon: '👥', category: 'Relationships', earned: false, points: 250 },
  { id: 83, name: 'Family Time', description: 'Family dinner for 30 days', icon: '🍽️', category: 'Relationships', earned: false, points: 300 },
  { id: 84, name: 'Phone-Free Night', description: 'No phone during dinner for 30 days', icon: '📵', category: 'Relationships', earned: false, points: 200 },
  { id: 85, name: 'Quality Time', description: '3+ hours quality time weekly for month', icon: '⏳', category: 'Relationships', earned: false, points: 250 },
  { id: 86, name: 'Gift Giver', description: 'Give meaningful gifts to 5 people', icon: '🎁', category: 'Relationships', earned: false, points: 150 },
  { id: 87, name: 'Active Listener', description: 'Practice active listening for 30 days', icon: '👂', category: 'Relationships', earned: false, points: 200 },
  { id: 88, name: 'Appreciation Express', description: 'Express gratitude to 10 people', icon: '💌', category: 'Relationships', earned: false, points: 175 },
  { id: 89, name: 'Event Planner', description: 'Host a gathering', icon: '🎉', category: 'Relationships', earned: false, points: 100 },
  { id: 90, name: 'Friend Anniversary', description: 'Maintain friendship for 5+ years', icon: '🎊', category: 'Relationships', earned: false, points: 150 },
  { id: 91, name: 'Date Night', description: 'Weekly date nights for month', icon: '💕', category: 'Relationships', earned: false, points: 200 },
  { id: 92, name: 'Parenting Pro', description: 'Dedicated kid time for 30 days', icon: '👶', category: 'Relationships', earned: false, points: 250 },
  { id: 93, name: 'Reunion Hero', description: 'Organize family reunion', icon: '👨‍👩‍👧‍👦', category: 'Relationships', earned: false, points: 300 },
  { id: 94, name: 'Neighborly Love', description: 'Help 5 neighbors', icon: '🏘️', category: 'Relationships', earned: false, points: 125 },
  { id: 95, name: 'Pet Parent', description: 'Spend quality time with pet daily', icon: '🐕', category: 'Relationships', earned: false, points: 100 },
  { id: 96, name: 'Mentorship Matters', description: 'Mentor someone for 3 months', icon: '🌟', category: 'Relationships', earned: false, points: 400 },
  { id: 97, name: 'Team Player', description: 'Join and participate in group', icon: '👥', category: 'Relationships', earned: false, points: 150 },
  { id: 98, name: 'Celebration Star', description: 'Remember 10 birthdays', icon: '🎂', category: 'Relationships', earned: false, points: 200 },
  { id: 99, name: 'Open Book', description: 'Share something vulnerable with friend', icon: '📖', category: 'Relationships', earned: false, points: 100 },
  { id: 100, name: 'Relationship Master', description: 'Nurture all relationship types', icon: '💎', category: 'Relationships', earned: false, points: 750 },
];

// Leaderboard
const mockLeaderboard = [
  { rank: 1, name: 'Sarah M.', avatar: '👩', points: 15420, level: 28, badges: 42, trend: 'up' },
  { rank: 2, name: 'Mike R.', avatar: '👨', points: 14850, level: 26, badges: 38, trend: 'up' },
  { rank: 3, name: 'Jessica L.', avatar: '👩‍🦰', points: 13200, level: 24, badges: 35, trend: 'down' },
  { rank: 4, name: 'David K.', avatar: '👨‍🦱', points: 12800, level: 23, badges: 32, trend: 'same' },
  { rank: 5, name: 'Emily W.', avatar: '👩‍🦳', points: 11500, level: 21, badges: 29, trend: 'up' },
  { rank: 42, name: 'You', avatar: '🐝', points: 12450, level: 12, badges: 18, trend: 'up', isCurrentUser: true },
  { rank: 43, name: 'Chris P.', avatar: '👨‍🦲', points: 12100, level: 20, badges: 27, trend: 'down' },
  { rank: 44, name: 'Anna S.', avatar: '👩‍🎤', points: 11800, level: 19, badges: 25, trend: 'same' },
  { rank: 45, name: 'Tom H.', avatar: '👨‍🎨', points: 11500, level: 18, badges: 24, trend: 'up' },
];

// Milestones/Levels
const mockLevels = [
  // Levels scaled to total system points (~180K available)
  { level: 1, name: 'Newcomer', minXP: 0, reward: 'Welcome badge', emoji: '🌱' },
  { level: 5, name: 'Apprentice', minXP: 500, reward: '5 bonus points/day', emoji: '🌿' },
  { level: 10, name: 'Explorer', minXP: 1500, reward: 'Custom profile frame', emoji: '🔍' },
  { level: 15, name: 'Achiever', minXP: 3500, reward: '10 bonus points/day', emoji: '⭐' },
  { level: 20, name: 'Goal Getter', minXP: 6000, reward: 'Bronze profile border', emoji: '🎯' },
  { level: 25, name: 'Champion', minXP: 10000, reward: '15 bonus points/day', emoji: '🏆' },
  { level: 30, name: 'Warrior', minXP: 15000, reward: 'Silver profile border', emoji: '⚔️' },
  { level: 35, name: 'Master', minXP: 22000, reward: '20 bonus points/day', emoji: '👑' },
  { level: 40, name: 'Legend', minXP: 32000, reward: 'Gold profile border', emoji: '🔥' },
  { level: 45, name: 'Elite', minXP: 45000, reward: 'Premium features unlocked', emoji: '💎' },
  { level: 50, name: 'Bee Master', minXP: 60000, reward: 'Lifetime premium + Trophy', emoji: '🐝' },
  { level: 60, name: 'Platinum', minXP: 80000, reward: 'Exclusive platinum badge', emoji: '💠' },
  { level: 70, name: 'Diamond', minXP: 105000, reward: 'VIP support access', emoji: '💠' },
  { level: 80, name: 'Crown', minXP: 135000, reward: 'Crown profile frame', emoji: '👑' },
  { level: 90, name: 'Supreme', minXP: 165000, reward: 'All rewards unlocked', emoji: '🌟' },
  { level: 100, name: 'Transcendent', minXP: 200000, reward: 'LEGENDARY status forever', emoji: '✨' },
];

// Recent activity
const mockRecentActivity = [
  { id: 1, action: 'Completed goal "Pay rent"', points: 100, time: '2 hours ago', icon: FiTarget },
  { id: 2, action: 'Saved $50 this week', points: 25, time: '5 hours ago', icon: FiDollarSign },
  { id: 3, action: 'Workout logged', points: 30, time: 'Yesterday', icon: FiActivity },
  { id: 4, action: 'Daily habit streak bonus', points: 50, time: 'Yesterday', icon: FiZap },
  { id: 5, action: 'Connected with friend', points: 25, time: '2 days ago', icon: FiUsers },
];

// ─── Components ───────────────────────────────────────────────────────────────

function LevelProgress({ userProgress, levels }) {
  const nextLevel = levels.find(l => l.level > userProgress.level);
  const currentLevel = levels.reverse().find(l => l.level <= userProgress.level) || levels[0];
  
  const progress = ((userProgress.currentXP - currentLevel.minXP) / (nextLevel?.minXP - currentLevel.minXP || 1)) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
              🐝
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Level</p>
              <h3 className="text-2xl font-bold text-gray-900">Level {userProgress.level}</h3>
              <p className="text-yellow-600 font-medium">{currentLevel.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{userProgress.currentXP.toLocaleString()}</p>
            <p className="text-sm text-gray-500">/ {nextLevel?.minXP?.toLocaleString() || 'MAX'} XP</p>
          </div>
        </div>
        
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-sm text-gray-500 text-center">
          {(nextLevel?.minXP - userProgress.currentXP).toLocaleString()} XP to {nextLevel?.name || 'Max Level'}
        </p>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon: Icon, label, value, subValue, color }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementCard({ achievement }) {
  if (!achievement.earned) {
    return (
      <Card className="opacity-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl grayscale">
              🔒
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-400">{achievement.name}</h3>
              <p className="text-xs text-gray-400">{achievement.category}</p>
              <p className="text-xs text-gray-500 mt-1">+{achievement.points} pts</p>
            </div>
            <FiLock className="text-gray-300" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card hover className="cursor-pointer border-yellow-200 bg-yellow-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{achievement.name}</h3>
            <p className="text-xs text-gray-500">{achievement.earnedDate}</p>
            <Badge variant="success" className="mt-1">Earned +{achievement.points}</Badge>
          </div>
          <FiCheck className="text-green-500" />
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ user }) {
  const rankColors = {
    1: 'bg-yellow-400 text-yellow-900',
    2: 'bg-gray-300 text-gray-700',
    3: 'bg-orange-200 text-orange-800',
  };

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${user.isCurrentUser ? 'bg-blue-50 border-2 border-blue-300' : 'hover:bg-gray-50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${rankColors[user.rank] || 'bg-gray-100'}`}>
        {user.rank}
      </div>
      <span className="text-2xl">{user.avatar}</span>
      <div className="flex-1">
        <p className={`font-medium ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>{user.name}</p>
        <p className="text-xs text-gray-500">Level {user.level} • {user.badges} badges</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">{user.points.toLocaleString()}</p>
        <p className="text-xs text-gray-500">points</p>
      </div>
      {user.trend === 'up' && <FiTrendingUp className="text-green-500" />}
      {user.trend === 'down' && <FiTrendingDown className="text-red-500" />}
    </div>
  );
}

function PointsActionCard({ action }) {
  const Icon = action.icon;
  const categoryColors = {
    Finance: 'bg-green-100 text-green-600',
    Goals: 'bg-purple-100 text-purple-600',
    Health: 'bg-red-100 text-red-600',
    Habits: 'bg-blue-100 text-blue-600',
    Mindset: 'bg-indigo-100 text-indigo-600',
    Education: 'bg-yellow-100 text-yellow-600',
    Social: 'bg-pink-100 text-pink-600',
    Productivity: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card hover>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="text-gray-500" size={16} />
            <span className="text-sm text-gray-900">{action.action}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[action.category]}`}>
              {action.category}
            </span>
            <Badge variant="outline">+{action.points}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityCard({ activity }) {
  const Icon = activity.icon;
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="p-2 rounded-lg bg-blue-100">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity.action}</p>
        <p className="text-xs text-gray-400">{activity.time}</p>
      </div>
      <span className="text-sm font-medium text-green-600">+{activity.points}</span>
    </div>
  );
}

function LevelCard({ level, currentLevel }) {
  const isUnlocked = level.level <= currentLevel;
  const isCurrent = level.level === currentLevel;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${isCurrent ? 'bg-blue-50 border-2 border-blue-300' : isUnlocked ? 'bg-green-50' : 'bg-gray-50 opacity-60'}`}>
      <span className="text-2xl">{level.emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">Level {level.level}</p>
          <p className="text-sm text-gray-500">- {level.name}</p>
        </div>
        <p className="text-xs text-gray-400">{level.minXP.toLocaleString()} XP</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">Reward</p>
        <p className="text-sm font-medium text-gray-900">{level.reward}</p>
      </div>
      {isUnlocked && !isCurrent && <FiCheck className="text-green-500" />}
      {isCurrent && <Badge variant="warning">Current</Badge>}
    </div>
  );
}

// ─── Main Gamification Dashboard ───────────────────────────────────────────────────

function Gamification() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const earnedAchievements = mockAchievements.filter(a => a.earned);
  const unearnedAchievements = mockAchievements.filter(a => !a.earned);

  return (
    <PageContainer
      title="Gamification Hub"
      subtitle="Track your achievements, points, and compete with friends"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiUsers className="w-4 h-4 mr-2" />
            Invite Friends
          </Button>
          <Button size="sm">
            <FiGift className="w-4 h-4 mr-2" />
            Rewards
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        <StatCard icon={FiStar} label="Total Points" value={mockUserProgress.totalPoints.toLocaleString()} subValue="All time" color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={FiAward} label="Rank" value={`#${mockUserProgress.rank}`} subValue={`of ${mockUserProgress.totalUsers} users`} color="bg-purple-100 text-purple-600" />
        <StatCard icon={FiAward} label="Badges Earned" value={mockUserProgress.badges} subValue={`${unearnedAchievements.length} remaining`} color="bg-blue-100 text-blue-600" />
        <StatCard icon={FiZap} label="Current Streak" value={`${mockUserProgress.streak} days`} subValue="Keep it going!" color="bg-orange-100 text-orange-600" />
      </Grid>

      {/* Main Content */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
          <TabsTrigger value="earn">Earn Points</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Level Progress */}
            <div>
              <LevelProgress userProgress={mockUserProgress} levels={mockLevels} />
              
              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader title="Recent Activity" />
                <CardContent className="space-y-1">
                  {loading ? (
                    <>
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </>
                  ) : (
                    mockRecentActivity.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Earned Achievements */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader 
                  title="Earned Achievements" 
                  badge={`${earnedAchievements.length}/${mockAchievements.length}`}
                />
                <CardContent className="space-y-3">
                  <Grid cols={{ default: 1, md: 2 }} className="gap-3">
                    {earnedAchievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Available Achievements" />
                <CardContent className="space-y-3">
                  <Grid cols={{ default: 1, md: 2 }} className="gap-3">
                    {unearnedAchievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Global Leaderboard" 
                  action={
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Weekly</Button>
                      <Button size="sm" variant="ghost">Monthly</Button>
                      <Button size="sm" variant="ghost">All Time</Button>
                    </div>
                  }
                />
                <CardContent className="space-y-2">
                  {loading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : (
                    mockLeaderboard.map((user) => (
                      <LeaderboardRow key={user.rank} user={user} />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader title="Your Stats" />
                <CardContent className="space-y-4">
                  <div className="text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mx-auto mb-3">
                      🐝
                    </div>
                    <h3 className="text-xl font-bold">Level {mockUserProgress.level}</h3>
                    <p className="text-yellow-600">{mockUserProgress.levelName}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rank</span>
                      <span className="font-bold">#{mockUserProgress.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Points</span>
                      <span className="font-bold">{mockUserProgress.totalPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Badges</span>
                      <span className="font-bold">{mockUserProgress.badges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Streak</span>
                      <span className="font-bold">{mockUserProgress.streak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="levels">
          <Card>
            <CardHeader title="Level Progression" />
            <CardContent className="space-y-3">
              {mockLevels.map((level) => (
                <LevelCard key={level.level} level={level} currentLevel={mockUserProgress.level} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Ways to Earn Points" />
                <CardContent className="space-y-3">
                  {mockActions.map((action) => (
                    <PointsActionCard key={action.id} action={action} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Quick Tips" />
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">💡 Complete daily habits for +10 pts each day!</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-900">💰 Save money regularly to unlock finance badges!</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900">🎯 Goal completion is the fastest way to level up!</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-900">🔥 Invite friends to earn 500 bonus points!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Gamification;
