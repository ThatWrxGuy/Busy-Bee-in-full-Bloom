/**
 * Busy Bee Health Dashboard - Design System Implementation
 * Comprehensive health tracking dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiActivity, FiHeart, FiZap, FiMoon, FiDroplet, FiAward } from 'react-icons/fi';
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

// ─── Configuration ───────────────────────────────────────────────────────────

const HEALTH_METRICS = {
  color: '#10B981',
  emoji: '🏃',
  label: 'Health',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of health goals users might create

const mockStats = [
  { label: 'Overall Score', value: '78', trend: 5, icon: FiActivity },
  { label: 'Workouts', value: '12', trend: 8, icon: FiZap },
  { label: 'Avg Sleep', value: '7.2h', trend: -2, icon: FiMoon },
  { label: 'Streak Days', value: '14', trend: 3, icon: FiAward },
];

const mockWeeklyActivity = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 85 },
  { day: 'Sun', value: 20 },
];

const mockGoals = [
  { id: 1, title: 'Run 5K three times per week', progress: 90, status: 'active', target: '3/3 runs' },
  { id: 2, title: 'Sleep 8 hours daily', progress: 75, status: 'active', target: '5/7 days' },
  { id: 3, title: 'Drink 8 glasses of water', progress: 60, status: 'active', target: '5.5/8 glasses' },
  { id: 4, title: 'Morning meditation', progress: 45, status: 'active', target: '5/7 sessions' },
  { id: 5, title: 'Weekly yoga session', progress: 100, status: 'completed', target: '2/2 sessions' },
];

const mockVitals = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: FiHeart },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: FiActivity },
  { label: 'Weight', value: '165', unit: 'lbs', status: 'normal', icon: FiTrendingDown },
  { label: 'Water Intake', value: '6', unit: 'glasses', status: 'warning', icon: FiDroplet },
];

const mockWorkouts = [
  { id: 1, type: 'Running', duration: '32 min', calories: 320, date: 'Today' },
  { id: 2, type: 'Weight Training', duration: '45 min', calories: 280, date: 'Yesterday' },
  { id: 3, type: 'Yoga', duration: '30 min', calories: 120, date: '2 days ago' },
  { id: 4, type: 'Cycling', duration: '55 min', calories: 450, date: '3 days ago' },
];

const mockNutrition = [
  { meal: 'Breakfast', calories: 450, protein: '25g', carbs: '45g', fat: '15g' },
  { meal: 'Lunch', calories: 600, protein: '40g', carbs: '60g', fat: '20g' },
  { meal: 'Snack', calories: 150, protein: '5g', carbs: '20g', fat: '5g' },
  { meal: 'Dinner', calories: 550, protein: '35g', carbs: '50g', fat: '18g' },
];

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
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Icon className="w-5 h-5 text-emerald-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-emerald-500' : isNegative ? 'text-red-500' : 'text-gray-500'
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

function VitalCard({ vital }) {
  const statusColors = {
    normal: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  };

  const StatusIcon = vital.icon;

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gray-100">
            <StatusIcon className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-500">{vital.label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{vital.value}</span>
          <span className="text-sm text-gray-400">{vital.unit}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[vital.status]}`} />
          <span className="text-xs text-gray-400 capitalize">{vital.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkoutCard({ workout }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="p-2 rounded-lg bg-emerald-100">
        <FiZap className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{workout.type}</p>
        <p className="text-xs text-gray-500">{workout.duration} • {workout.calories} cal</p>
      </div>
      <span className="text-xs text-gray-400">{workout.date}</span>
    </div>
  );
}

function ActivityBar({ day, value }) {
  const maxValue = Math.max(...mockWeeklyActivity.map(d => d.value));
  const height = (value / maxValue) * 100;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-8 h-32 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-emerald-500 rounded-full transition-all"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{day}</span>
    </div>
  );
}

function NutritionRow({ meal }) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-900">{meal.meal}</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">{meal.calories} cal</span>
        <span className="text-gray-400">P: {meal.protein}</span>
        <span className="text-gray-400">C: {meal.carbs}</span>
        <span className="text-gray-400">F: {meal.fat}</span>
      </div>
    </div>
  );
}

// ─── Main Health Dashboard ───────────────────────────────────────────────────

function Health() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Health Dashboard"
      subtitle="Track your physical wellbeing and fitness goals"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiActivity className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
          <Button size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        {mockStats.map((stat, index) => (
          <StatCardNew key={index} {...stat} loading={loading} />
        ))}
      </Grid>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader
                  title="Health Goals"
                  action={
                    <Link to="/goals" className="text-sm text-emerald-600 hover:underline">
                      View all →
                    </Link>
                  }
                />
                <CardContent className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </>
                  ) : (
                    mockGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Weekly Activity" />
                <CardContent>
                  <div className="flex justify-between gap-2">
                    {mockWeeklyActivity.map((day) => (
                      <ActivityBar key={day.day} day={day.day} value={day.value} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Quick Vitals" />
                <CardContent className="space-y-3">
                  {mockVitals.slice(0, 2).map((vital) => (
                    <VitalCard key={vital.label} vital={vital} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Recent Workouts" />
                <CardContent className="space-y-1">
                  {mockWorkouts.slice(0, 3).map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workouts">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Workout History" />
                <CardContent className="space-y-2">
                  {mockWorkouts.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Weekly Summary" />
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-500">4</p>
                    <p className="text-sm text-gray-500">Workouts this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">3.5</p>
                    <p className="text-sm text-gray-500">Hours trained</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">1,170</p>
                    <p className="text-sm text-gray-500">Calories burned</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader title="Daily Nutrition" subtitle="Today's intake" />
            <CardContent>
              {mockNutrition.map((meal) => (
                <NutritionRow key={meal.meal} meal={meal} />
              ))}
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg mt-4">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">1,750 cal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-xl font-bold text-emerald-500">250 cal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="gap-4">
            {mockVitals.map((vital) => (
              <VitalCard key={vital.label} vital={vital} />
            ))}
          </Grid>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Health;
