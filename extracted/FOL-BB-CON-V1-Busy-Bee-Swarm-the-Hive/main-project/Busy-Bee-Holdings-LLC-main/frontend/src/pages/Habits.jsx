/**
 * Busy Bee Habits Dashboard - Design System Implementation
 * Habit tracking, streaks, and routine management
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiRepeat, FiCheck, FiClock, FiTarget, FiZap, FiCalendar, FiAward, FiTrash2 } from 'react-icons/fi';
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
  LoadingOverlay,
  EmptyState,
} from '../components';
import { getHabits, createHabit, completeHabit, deleteHabit } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ─── Configuration ───────────────────────────────────────────────────────────

const HABITS_METRICS = {
  color: '#F59E0B',
  emoji: '🔄',
  label: 'Habits',
};

const DOMAIN_META = {
  health: { emoji: '🏃', label: 'Health' },
  career: { emoji: '💼', label: 'Career' },
  mindset: { emoji: '🧠', label: 'Mindset' },
  habits: { emoji: '🔄', label: 'Habits' },
  relationships: { emoji: '👥', label: 'Relationships' },
  finance: { emoji: '💰', label: 'Finance' },
  education: { emoji: '📚', label: 'Education' },
  spirituality: { emoji: '✨', label: 'Spirituality' },
  family: { emoji: '👨‍👩‍👧', label: 'Family' },
  recreation: { emoji: '🎮', label: 'Recreation' },
  travel: { emoji: '✈️', label: 'Travel' },
};

const defaultStats = [
  { label: 'Overall Score', value: '0', trend: 0, icon: FiRepeat },
  { label: 'Active Habits', value: '0', trend: 0, icon: FiCheck },
  { label: 'Current Streak', value: '0', trend: 0, icon: FiZap },
  { label: 'Best Streak', value: '0', trend: 0, icon: FiAward },
];

const defaultHabits = [];

// ─── Components ───────────────────────────────────────────────────────────────

function StatCardNew({ icon: Icon, label, value, trend, loading }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Icon className="w-5 h-5 text-amber-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-amber-500' : isNegative ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {isPositive && <FiTrendingUp size={14} />}
              {isNegative && <FiTrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function HabitCard({ habit, onToggle }) {
  const categoryColors = {
    Health: 'bg-emerald-100 text-emerald-700',
    Learning: 'bg-blue-100 text-blue-700',
    Wellness: 'bg-purple-100 text-purple-700',
    Productivity: 'bg-gray-100 text-gray-700',
  };

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(habit.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              habit.completed 
                ? 'bg-amber-500 border-amber-500 text-white' 
                : 'border-gray-300 hover:border-amber-500'
            }`}
          >
            {habit.completed && <FiCheck size={14} />}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${habit.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {habit.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[habit.category] || 'bg-gray-100'}`}>
                {habit.category}
              </span>
              <span className="text-xs text-gray-500">{habit.frequency}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-500">
              <FiZap size={14} />
              <span className="font-bold">{habit.streak}</span>
            </div>
            <span className="text-xs text-gray-500">day streak</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }) {
  const statusColors = {
    active: 'success',
    completed: 'info',
    paused: 'secondary',
  };

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex-1 line-clamp-1">{goal.title}</h3>
          <Badge variant={statusColors[goal.status]}>{goal.status}</Badge>
        </div>
        <Progress value={goal.progress} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{goal.progress}% complete</span>
          <span className="text-xs text-gray-400">{goal.target}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RoutineCard({ routine }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{routine.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiClock size={12} /> {routine.time}
            </p>
          </div>
          <div className="flex gap-1">
            {routine.days.map(day => (
              <span key={day} className={`text-xs px-1.5 py-0.5 rounded ${
                day.length === 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100'
              }`}>
                {day.charAt(0)}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {routine.habits.map((habit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
              <FiCheck size={12} className="text-amber-500" />
              {habit}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100">
            <Icon className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{insight.label}</p>
            <p className="font-medium text-gray-900">{insight.value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityBar({ day, habits }) {
  const maxHabits = Math.max(...mockWeeklyActivity.map(d => d.habits));
  const height = (habits / maxHabits) * 100;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-8 h-24 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-amber-500 rounded-full transition-all"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{day}</span>
    </div>
  );
}

// ─── Main Habits Dashboard ───────────────────────────────────────────────────

function Habits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    setLoading(true);
    const { data, error } = await getHabits();
    if (data) {
      setHabits(data);
    }
    setLoading(false);
  };

  const handleCreateHabit = async (newHabit) => {
    const { data, error } = await createHabit({
      ...newHabit,
      user_id: user.id,
      domain: newHabit.domain || 'health',
      frequency: newHabit.frequency || 'daily',
      streak: 0,
      best_streak: 0,
      completed_today: false,
    });
    if (data) {
      setHabits([data, ...habits]);
      setShowAddModal(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    const { data, error } = await completeHabit(habitId);
    if (data) {
      setHabits(habits.map(h => h.id === habitId ? data : h));
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const { error } = await deleteHabit(habitId);
    if (!error) {
      setHabits(habits.filter(h => h.id !== habitId));
    }
  };

  // Calculate stats from habits
  const stats = [
    { label: 'Overall Score', value: habits.length > 0 ? Math.round((habits.filter(h => h.completed_today).length / habits.length) * 100) : 0, trend: 0, icon: FiRepeat },
    { label: 'Active Habits', value: habits.length, trend: 0, icon: FiCheck },
    { label: 'Current Streak', value: habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0), 0) : 0, trend: 0, icon: FiZap },
    { label: 'Best Streak', value: habits.length > 0 ? Math.max(...habits.map(h => h.best_streak || 0), 0) : 0, trend: 0, icon: FiAward },
  ];

  return (
    <PageContainer
      title="Habits Dashboard"
      subtitle="Build consistent routines and track your daily habits"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiRepeat className="w-4 h-4 mr-2" />
            Log Habits
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        {stats.map((stat, index) => (
          <StatCardNew key={index} {...stat} loading={loading} />
        ))}
      </Grid>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habits List */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader title="Daily Habits" />
                <CardContent className="space-y-3">
                  {loading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : (
                    habits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Weekly Activity" />
                <CardContent>
                  <div className="flex justify-between gap-2">
                    {mockWeeklyActivity.map((day) => (
                      <ActivityBar key={day.day} day={day.day} habits={day.habits} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Today's Progress" />
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E5E7EB"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#F59E0B"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(habits.filter(h => h.completed).length / habits.length) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {habits.filter(h => h.completed).length}/{habits.length}
                        </span>
                        <span className="text-xs text-gray-500">completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Quick Stats" />
                <CardContent className="space-y-3">
                  <InsightCard insight={mockInsights[0]} />
                  <InsightCard insight={mockInsights[1]} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routines">
          <Card>
            <CardHeader 
              title="My Routines" 
              action={
                <Button size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  New Routine
                </Button>
              }
            />
            <CardContent>
              <Grid cols={{ default: 1, md: 2 }} className="gap-4">
                {mockRoutines.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Habit Goals" />
                <CardContent className="space-y-4">
                  {mockGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="All Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader title="Habit Insights" />
            <CardContent>
              <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="gap-4">
                {mockInsights.map((insight, idx) => (
                  <InsightCard key={idx} insight={insight} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Habits;
