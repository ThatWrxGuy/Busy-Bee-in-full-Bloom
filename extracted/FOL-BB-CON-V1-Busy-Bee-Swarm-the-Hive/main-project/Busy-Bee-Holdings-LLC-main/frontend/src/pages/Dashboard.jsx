/**
 * Busy Bee Dashboard - Design System Implementation
 * Demonstrates the clean, professional CRM aesthetic
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  FiPlus,
  FiCheck,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiZap,
  FiGrid,
  FiRefreshCw,
  FiCalendar,
  FiTarget,
  FiActivity,
  FiBriefcase,
  FiRepeat,
  FiHeart,
  FiBook,
  FiStar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiGlobe,
  FiAward,
} from 'react-icons/fi';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Progress,
  Avatar,
  AvatarFallback,
  Skeleton,
  PageContainer,
  Section,
  Grid,
  StatCard,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';

// ─── Configuration ───────────────────────────────────────────────────────────

const DOMAIN_META = {
  health: { color: 'green', emoji: '🏃', label: 'Health' },
  career: { color: 'blue', emoji: '💼', label: 'Career' },
  mindset: { color: 'purple', emoji: '🧠', label: 'Mindset' },
  habits: { color: 'orange', emoji: '🔄', label: 'Habits' },
  relationships: { color: 'pink', emoji: '👥', label: 'Relationships' },
  finance: { color: 'yellow', emoji: '💰', label: 'Finance' },
  education: { color: 'cyan', emoji: '📚', label: 'Education' },
  family: { color: 'orange', emoji: '🏠', label: 'Family' },
  spirituality: { color: 'purple', emoji: '✨', label: 'Spirituality' },
};

function greeting(name) {
  const h = new Date().getHours();
  const time = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  const first = name?.split(' ')[0] || 'there';
  return `Good ${time}, ${first} 👋`;
}

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of data users would see when they have goals/tasks/domains

const mockStats = [
  { label: 'Total Goals', value: '24', trend: 12, icon: FiTarget },
  { label: 'Completed', value: '18', trend: 8, icon: FiCheck },
  { label: 'In Progress', value: '6', trend: -2, icon: FiClock },
  { label: 'Score', value: '87', trend: 5, icon: FiActivity },
];

const mockGoals = [
  {
    id: 1,
    title: 'Morning meditation routine',
    progress: 75,
    status: 'active',
    category: 'Mindset',
  },
  {
    id: 2,
    title: 'Save $10,000 emergency fund',
    progress: 45,
    status: 'active',
    category: 'Finance',
  },
  {
    id: 3,
    title: 'Run 5K three times per week',
    progress: 90,
    status: 'active',
    category: 'Health',
  },
  {
    id: 4,
    title: 'Complete professional certification',
    progress: 30,
    status: 'paused',
    category: 'Career',
  },
];

const mockDomains = [
  { id: 'health', name: 'Health', score: 78 },
  { id: 'career', name: 'Career', score: 85 },
  { id: 'mindset', name: 'Mindset', score: 72 },
  { id: 'habits', name: 'Habits', score: 65 },
  { id: 'relationships', name: 'Relationships', score: 90 },
  { id: 'finance', name: 'Finance', score: 58 },
  { id: 'education', name: 'Education', score: 70 },
  { id: 'family', name: 'Family', score: 88 },
  { id: 'spirituality', name: 'Spirituality', score: 55 },
];

const mockTasks = [
  { id: 1, title: 'Review quarterly goals', due: 'Today', priority: 'high' },
  { id: 2, title: 'Schedule health checkup', due: 'Tomorrow', priority: 'medium' },
  { id: 3, title: 'Update budget spreadsheet', due: 'Fri', priority: 'low' },
  { id: 4, title: 'Meditation session', due: 'Daily', priority: 'medium' },
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
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend != null && (
            <span
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive
                  ? 'text-success'
                  : isNegative
                    ? 'text-destructive'
                    : 'text-foreground-muted'
              )}
            >
              {isPositive && <FiTrendingUp size={14} />}
              {isNegative && <FiTrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-foreground-muted mt-1">{label}</p>
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
          <h3 className="font-medium text-foreground flex-1 line-clamp-1">{goal.title}</h3>
          <Badge variant={statusColors[goal.status]}>{goal.status}</Badge>
        </div>
        <Progress value={goal.progress} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-muted">{goal.progress}% complete</span>
          <Badge variant="outline" className="text-xs">
            {goal.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function DomainCard({ domain }) {
  const meta = DOMAIN_META[domain.id] || { emoji: '📊', label: domain.name };
  const domainRoutes = {
    health: '/health',
    career: '/career',
    mindset: '/mindset',
    habits: '/habits',
    relationships: '/relationships',
    finance: '/finance',
    education: '/education',
    family: '/family',
    spirituality: '/spirituality',
  };

  return (
    <Link to={domainRoutes[domain.id] || '/domains'}>
      <Card hover className="cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{meta.emoji}</span>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{meta.label}</h3>
              <p className="text-xs text-foreground-muted">Domain Score</p>
            </div>
            <span className="text-xl font-bold text-primary">{domain.score}</span>
          </div>
          <Progress value={domain.score} className="h-1.5" />
        </CardContent>
      </Card>
    </Link>
  );
}

function TaskItem({ task }) {
  const priorityColors = {
    high: 'destructive',
    medium: 'warning',
    low: 'secondary',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          task.priority === 'high' && 'bg-destructive',
          task.priority === 'medium' && 'bg-warning',
          task.priority === 'low' && 'bg-foreground-muted'
        )}
      />
      <span className="flex-1 text-sm text-foreground">{task.title}</span>
      <span className="text-xs text-foreground-muted">{task.due}</span>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
    >
      <div className="p-3 rounded-full bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

function Dashboard() {
  const { user } = { user: { full_name: 'John Doe', email: 'john@example.com' } }; // Mock auth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title={greeting(user?.full_name)}
      subtitle="Here's what's happening with your life domains today."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Goals */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Active Goals"
              action={
                <Link
                  to="/goals"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <FiArrowRight size={14} />
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
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                <QuickAction icon={FiTarget} label="Goals" to="/goals" />
                <QuickAction icon={FiCheck} label="Tasks" to="/tasks" />
                <QuickAction icon={FiGrid} label="Domains" to="/domains" />
                <QuickAction icon={FiZap} label="Brief" to="/briefs" />
                <QuickAction icon={FiActivity} label="Health" to="/health" />
                <QuickAction icon={FiBriefcase} label="Career" to="/career" />
                <QuickAction icon={FiZap} label="Mindset" to="/mindset" />
                <QuickAction icon={FiRepeat} label="Habits" to="/habits" />
                <QuickAction icon={FiHeart} label="Relations" to="/relationships" />
                <QuickAction icon={FiBook} label="Education" to="/education" />
                <QuickAction icon={FiStar} label="Spirituality" to="/spirituality" />
                <QuickAction icon={FiUsers} label="Family" to="/family" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                <QuickAction icon={FiAward} label="Achievements" to="/gamification" />
                <QuickAction icon={FiMapPin} label="Recreation" to="/recreation" />
                <QuickAction icon={FiGlobe} label="Travel" to="/travel" />
                <QuickAction icon={FiDollarSign} label="Finance" to="/finance" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Domains & Tasks */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Life Domains"
              action={
                <Link
                  to="/domains"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <FiArrowRight size={14} />
                </Link>
              }
            />
            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                mockDomains
                  .slice(0, 6)
                  .map((domain) => <DomainCard key={domain.id} domain={domain} />)
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Upcoming Tasks"
              action={
                <Link
                  to="/tasks"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <FiArrowRight size={14} />
                </Link>
              }
            />
            <CardContent className="space-y-1">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                mockTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
