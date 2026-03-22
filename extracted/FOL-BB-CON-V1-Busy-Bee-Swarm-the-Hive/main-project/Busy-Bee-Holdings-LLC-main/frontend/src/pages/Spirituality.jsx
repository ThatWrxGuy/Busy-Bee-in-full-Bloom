/**
 * Busy Bee Spirituality Dashboard - Design System Implementation
 * Spiritual growth, meditation, gratitude, and values tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiSun, FiMoon, FiHeart, FiStar, FiTarget, FiZap, FiAward, FiClock, FiBook, FiSmile } from 'react-icons/fi';
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

const SPIRITUALITY_METRICS = {
  color: '#A855F7',
  emoji: '✨',
  label: 'Spirituality',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of spirituality goals users might create

const mockStats = [
  { label: 'Overall Score', value: '55', trend: 8, icon: FiSun },
  { label: 'Daily Practice', value: '21', trend: 5, icon: FiZap },
  { label: 'Gratitude Entries', value: '45', trend: 10, icon: FiHeart },
  { label: 'Meditation Hours', value: '18', trend: 3, icon: FiMoon },
];

const mockDailyPractices = [
  { id: 1, name: 'Morning meditation', duration: '15 min', completed: true, streak: 14 },
  { id: 2, name: 'Gratitude journaling', duration: '10 min', completed: true, streak: 21 },
  { id: 3, name: 'Evening reflection', duration: '10 min', completed: false, streak: 8 },
  { id: 4, name: 'Spiritual reading', duration: '20 min', completed: false, streak: 5 },
];

const mockGoals = [
  { id: 1, title: '30 days of meditation', progress: 70, status: 'active', target: '21/30 days' },
  { id: 2, title: 'Daily gratitude practice', progress: 85, status: 'active', target: '28/33 days' },
  { id: 3, title: 'Read spiritual texts', progress: 45, status: 'active', target: '3/7 books' },
  { id: 4, title: 'Weekly nature walks', progress: 100, status: 'completed', target: 'Done' },
  { id: 5, title: 'Practice forgiveness', progress: 60, status: 'active', target: 'Ongoing' },
];

const mockGratitudeEntries = [
  { id: 1, text: 'Grateful for my health and energy today', date: 'Today', category: 'Health' },
  { id: 2, text: 'Thankful for supportive friends and family', date: 'Yesterday', category: 'Relationships' },
  { id: 3, text: 'Appreciating the beauty of nature this morning', date: '2 days ago', category: 'Nature' },
  { id: 4, text: 'Grateful for the opportunity to learn and grow', date: '3 days ago', category: 'Growth' },
];

const mockValues = [
  { id: 1, name: 'Compassion', alignment: 90, description: 'Acting with empathy toward others' },
  { id: 2, name: 'Integrity', alignment: 85, description: 'Being honest and true to my word' },
  { id: 3, name: 'Growth', alignment: 80, description: 'Continuously learning and improving' },
  { id: 4, name: 'Gratitude', alignment: 75, description: 'Appreciating what life offers' },
  { id: 5, name: 'Peace', alignment: 70, description: 'Seeking inner calm and serenity' },
];

const mockInsights = [
  { label: 'Current streak', value: '14 days', icon: FiZap },
  { label: 'This week', value: '7 practices', icon: FiAward },
  { label: 'Top value', value: 'Compassion', icon: FiHeart },
  { label: 'Most grateful for', value: 'Relationships', icon: FiSmile },
];

const mockWeeklyPractice = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 50 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 40 },
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
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Icon className="w-5 h-5 text-purple-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-purple-500' : isNegative ? 'text-red-500' : 'text-gray-500'
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

function PracticeCard({ practice, onToggle }) {
  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(practice.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              practice.completed 
                ? 'bg-purple-500 border-purple-500 text-white' 
                : 'border-gray-300 hover:border-purple-500'
            }`}
          >
            {practice.completed && <FiPlus size={14} />}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${practice.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {practice.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{practice.duration}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-purple-500 flex items-center gap-1">
                <FiZap size={10} /> {practice.streak} day streak
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GratitudeCard({ entry }) {
  const categoryColors = {
    Health: 'bg-green-100 text-green-700',
    Relationships: 'bg-pink-100 text-pink-700',
    Nature: 'bg-emerald-100 text-emerald-700',
    Growth: 'bg-blue-100 text-blue-700',
    Work: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <p className="text-gray-700">{entry.text}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[entry.category]}`}>
          {entry.category}
        </span>
      </div>
      <span className="text-xs text-gray-400">{entry.date}</span>
    </div>
  );
}

function ValueCard({ value }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{value.name}</h3>
          <span className="text-sm font-bold text-purple-500">{value.alignment}%</span>
        </div>
        <Progress value={value.alignment} className="h-2 mb-2" />
        <p className="text-xs text-gray-500">{value.description}</p>
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
          <div className="p-2 rounded-lg bg-purple-100">
            <Icon className="w-4 h-4 text-purple-600" />
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

function PracticeBar({ day, value }) {
  const maxValue = Math.max(...mockWeeklyPractice.map(d => d.value));
  const height = (value / maxValue) * 100;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-8 h-24 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-purple-500 rounded-full transition-all"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{day}</span>
    </div>
  );
}

// ─── Main Spirituality Dashboard ───────────────────────────────────────────────────

function Spirituality() {
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPractices(mockDailyPractices);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const togglePractice = (id) => {
    setPractices(practices.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
  };

  return (
    <PageContainer
      title="Spirituality Dashboard"
      subtitle="Nurture your soul and connect with your inner self"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiBook className="w-4 h-4 mr-2" />
            Log Practice
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
      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList>
          <TabsTrigger value="practice">Daily Practice</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Practices */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader title="Daily Spiritual Practices" />
                <CardContent className="space-y-3">
                  {loading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : (
                    practices.map((practice) => (
                      <PracticeCard key={practice.id} practice={practice} onToggle={togglePractice} />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Weekly Practice" />
                <CardContent>
                  <div className="flex justify-between gap-2">
                    {mockWeeklyPractice.map((day) => (
                      <PracticeBar key={day.day} day={day.day} value={day.value} />
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
                        <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#A855F7"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(practices.filter(p => p.completed).length / practices.length) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {practices.filter(p => p.completed).length}/{practices.length}
                        </span>
                        <span className="text-xs text-gray-500">completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.slice(0, 2).map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gratitude">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Gratitude Journal" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      New Entry
                    </Button>
                  }
                />
                <CardContent className="space-y-3">
                  {mockGratitudeEntries.map((entry) => (
                    <GratitudeCard key={entry.id} entry={entry} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Gratitude Stats" />
                <CardContent className="space-y-4">
                  <div className="text-center p-4">
                    <p className="text-3xl font-bold text-purple-500">45</p>
                    <p className="text-sm text-gray-500">Total entries</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-3xl font-bold text-gray-900">21</p>
                    <p className="text-sm text-gray-500">Day streak</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="values">
          <Card>
            <CardHeader title="Core Values" />
            <CardContent>
              <Grid cols={{ default: 1, md: 2 }} className="gap-4">
                {mockValues.map((value) => (
                  <ValueCard key={value.id} value={value} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Spirituality Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-purple-600 hover:underline">
                      View all →
                    </Link>
                  }
                />
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
      </Tabs>
    </PageContainer>
  );
}

export default Spirituality;
