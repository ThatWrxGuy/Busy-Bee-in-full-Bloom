/**
 * Busy Bee Mindset Dashboard - Design System Implementation
 * Mental wellness, learning, and personal growth tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiZap, FiBook, FiStar, FiClock, FiAward, FiTarget, FiActivity, FiHeart } from 'react-icons/fi';
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

const MINDSET_METRICS = {
  color: '#8B5CF6',
  emoji: '🧠',
  label: 'Mindset',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of mindset goals users might create

const mockStats = [
  { label: 'Overall Score', value: '72', trend: 3, icon: FiZap },
  { label: 'Meditation', value: '21', trend: 5, icon: FiZap },
  { label: 'Books Read', value: '8', trend: 2, icon: FiBook },
  { label: 'Streak Days', value: '12', trend: -1, icon: FiAward },
];

const mockWeeklyMindfulness = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 20 },
  { day: 'Thu', value: 60 },
  { day: 'Fri', value: 45 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 30 },
];

const mockGoals = [
  { id: 1, title: 'Morning meditation routine', progress: 75, status: 'active', target: '5/7 days' },
  { id: 2, title: 'Read 24 books this year', progress: 33, status: 'active', target: '8/24 books' },
  { id: 3, title: 'Practice gratitude daily', progress: 85, status: 'active', target: '30/35 days' },
  { id: 4, title: 'Learn new skill', progress: 45, status: 'active', target: '3/7 modules' },
  { id: 5, title: 'Evening wind-down routine', progress: 100, status: 'completed', target: 'Done' },
];

const mockMeditationSessions = [
  { id: 1, type: 'Morning Calm', duration: '10 min', date: 'Today' },
  { id: 2, type: 'Stress Relief', duration: '15 min', date: 'Yesterday' },
  { id: 3, type: 'Sleep Focus', duration: '20 min', date: '2 days ago' },
  { id: 4, type: 'Mindful Walking', duration: '25 min', date: '3 days ago' },
];

const mockBooks = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', progress: 85, category: 'Self-Help' },
  { id: 2, title: 'Deep Work', author: 'Cal Newport', progress: 60, category: 'Productivity' },
  { id: 3, title: 'The Psychology of Money', author: 'Morgan Housel', progress: 100, category: 'Finance', completed: true },
  { id: 4, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', progress: 25, category: 'Psychology' },
];

const mockJournalEntries = [
  { id: 1, title: 'Morning Gratitude', date: 'Today', preview: 'I am grateful for...' },
  { id: 2, title: 'Weekly Reflection', date: 'Yesterday', preview: 'This week I learned...' },
  { id: 3, title: 'Goal Progress', date: '3 days ago', preview: 'My progress on...' },
];

const mockSkills = [
  { id: 1, name: 'Meditation', level: 75, category: 'Wellness' },
  { id: 2, name: 'Critical Thinking', level: 70, category: 'Cognitive' },
  { id: 3, name: 'Creativity', level: 65, category: 'Creative' },
  { id: 4, name: 'Focus', level: 60, category: 'Cognitive' },
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

function MeditationCard({ session }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-purple-50 transition-colors">
      <div className="p-2 rounded-lg bg-purple-100">
        <FiZap className="w-4 h-4 text-purple-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{session.type}</p>
        <p className="text-xs text-gray-500">{session.duration}</p>
      </div>
      <span className="text-xs text-gray-400">{session.date}</span>
    </div>
  );
}

function BookCard({ book }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
          {book.completed && <Badge variant="success">Completed</Badge>}
        </div>
        <Progress value={book.progress} className="h-2 mb-1" />
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">{book.category}</span>
          <span className="text-xs text-gray-400">{book.progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalCard({ entry }) {
  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-gray-900">{entry.title}</h3>
        <span className="text-xs text-gray-400">{entry.date}</span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">{entry.preview}</p>
    </div>
  );
}

function SkillCard({ skill }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">{skill.name}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            {skill.category}
          </span>
        </div>
        <Progress value={skill.level} className="h-2 mb-1" />
        <span className="text-xs text-gray-500">{skill.level}% proficiency</span>
      </CardContent>
    </Card>
  );
}

function MindfulnessBar({ day, value }) {
  const maxValue = Math.max(...mockWeeklyMindfulness.map(d => d.value));
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

// ─── Main Mindset Dashboard ───────────────────────────────────────────────────

function Mindset() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Mindset Dashboard"
      subtitle="Track your mental wellness and personal growth"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiZap className="w-4 h-4 mr-2" />
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
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader
                  title="Mindset Goals"
                  action={
                    <Link to="/goals" className="text-sm text-purple-600 hover:underline">
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
                <CardHeader title="Weekly Mindfulness" />
                <CardContent>
                  <div className="flex justify-between gap-2">
                    {mockWeeklyMindfulness.map((day) => (
                      <MindfulnessBar key={day.day} day={day.day} value={day.value} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Recent Meditation" />
                <CardContent className="space-y-1">
                  {mockMeditationSessions.slice(0, 3).map((session) => (
                    <MeditationCard key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Currently Reading" />
                <CardContent className="space-y-3">
                  {mockBooks.slice(0, 2).map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meditation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Meditation History" />
                <CardContent className="space-y-2">
                  {mockMeditationSessions.map((session) => (
                    <MeditationCard key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Weekly Summary" />
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-500">5</p>
                    <p className="text-sm text-gray-500">Sessions this week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">75</p>
                    <p className="text-sm text-gray-500">Minutes meditated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-500">Day streak</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader title="Books & Learning" />
            <CardContent>
              <Grid cols={{ default: 1, md: 2, lg: 3 }} className="gap-4">
                {mockBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Journal Entries" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      New Entry
                    </Button>
                  }
                />
                <CardContent className="space-y-3">
                  {mockJournalEntries.map((entry) => (
                    <JournalCard key={entry.id} entry={entry} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Mindset Skills" />
                <CardContent className="space-y-3">
                  {mockSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
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

export default Mindset;
