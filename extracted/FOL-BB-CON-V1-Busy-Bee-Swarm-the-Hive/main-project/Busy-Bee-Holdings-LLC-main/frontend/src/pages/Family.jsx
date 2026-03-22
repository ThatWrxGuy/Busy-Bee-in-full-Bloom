/**
 * Busy Bee Family Dashboard - Design System Implementation
 * Family time, events, milestones, and relationships tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiHome, FiUsers, FiCalendar, FiGift, FiHeart, FiClock, FiStar, FiAward, FiMessageCircle } from 'react-icons/fi';
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

const FAMILY_METRICS = {
  color: '#10B981',
  emoji: '🏠',
  label: 'Family',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of family goals users might create

const mockStats = [
  { label: 'Overall Score', value: '88', trend: 3, icon: FiHome },
  { label: 'Family Members', value: '5', trend: 0, icon: FiUsers },
  { label: 'Time Together', value: '24', trend: 8, icon: FiClock },
  { label: 'Events This Month', value: '3', trend: 1, icon: FiCalendar },
];

const mockFamilyMembers = [
  { id: 1, name: 'Mom', relationship: 'Parent', birthday: 'Mar 15', emoji: '👩', priority: 'high' },
  { id: 2, name: 'Dad', relationship: 'Parent', birthday: 'Jun 22', emoji: '👨', priority: 'high' },
  { id: 3, name: 'Spouse', relationship: 'Partner', birthday: 'Sep 8', emoji: '💕', priority: 'high' },
  { id: 4, name: 'Sister', relationship: 'Sibling', birthday: 'Dec 1', emoji: '👯', priority: 'medium' },
  { id: 5, name: 'Brother', relationship: 'Sibling', birthday: 'Apr 18', emoji: '👦', priority: 'medium' },
];

const mockGoals = [
  { id: 1, title: 'Weekly family dinner', progress: 80, status: 'active', target: '4/5 dinners' },
  { id: 2, title: 'Monthly family outing', progress: 100, status: 'completed', target: 'Done' },
  { id: 3, title: 'Call parents weekly', progress: 85, status: 'active', target: '4/4 calls' },
  { id: 4, title: 'Family game night', progress: 60, status: 'active', target: '3/4 sessions' },
  { id: 5, title: 'Plan family vacation', progress: 40, status: 'active', target: 'Research phase' },
];

const mockEvents = [
  { id: 1, title: "Mom's Birthday", date: 'Mar 25', type: 'birthday', emoji: '🎂' },
  { id: 2, title: 'Family Dinner', date: 'Sunday', type: 'gathering', emoji: '🍽️' },
  { id: 3, title: "Brother's Graduation", date: 'May 15', type: 'milestone', emoji: '🎓' },
  { id: 4, title: 'Family Reunion', date: 'July 4th', type: 'gathering', emoji: '🎉' },
];

const mockMilestones = [
  { id: 1, title: 'Brother graduating college', date: 'May 2024', status: 'upcoming' },
  { id: 2, title: 'Parents anniversary', date: 'June 2024', status: 'upcoming' },
  { id: 3, title: 'New baby on the way', date: 'August 2024', status: 'upcoming' },
  { id: 4, title: 'Bought first house', date: '2023', status: 'completed' },
];

const mockTimeTogether = [
  { activity: 'Family dinners', hours: 8, frequency: 'Weekly' },
  { activity: 'Game nights', hours: 4, frequency: 'Weekly' },
  { activity: 'Outings', hours: 6, frequency: 'Monthly' },
  { activity: 'Vacations', hours: 48, frequency: 'Yearly' },
];

const mockInsights = [
  { label: 'Best month', value: 'December', icon: FiStar },
  { label: 'Most time with', value: 'Spouse', icon: FiHeart },
  { label: 'Upcoming', value: '3 events', icon: FiCalendar },
  { label: 'Streak', value: '8 weeks', icon: FiAward },
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

function MemberCard({ member }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-700',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{member.emoji}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.relationship}</p>
            <p className="text-xs text-gray-400">🎂 {member.birthday}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[member.priority]}`}>
            {member.priority}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-emerald-50 transition-colors">
      <span className="text-2xl">{event.emoji}</span>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.date}</p>
      </div>
      <Badge variant={event.type === 'birthday' ? 'pink' : event.type === 'milestone' ? 'purple' : 'green'}>
        {event.type}
      </Badge>
    </div>
  );
}

function MilestoneCard({ milestone }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${milestone.status === 'completed' ? 'bg-gray-50' : 'bg-emerald-50 border border-emerald-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${milestone.status === 'completed' ? 'bg-gray-200' : 'bg-emerald-100'}`}>
          <FiAward className={`w-4 h-4 ${milestone.status === 'completed' ? 'text-gray-500' : 'text-emerald-600'}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{milestone.title}</h3>
          <p className="text-sm text-gray-500">{milestone.date}</p>
        </div>
      </div>
      <Badge variant={milestone.status === 'completed' ? 'secondary' : 'success'}>
        {milestone.status}
      </Badge>
    </div>
  );
}

function TimeCard({ time }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{time.activity}</h3>
          <span className="text-sm text-emerald-500">{time.frequency}</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-gray-900">{time.hours}</span>
          <span className="text-sm text-gray-500 mb-1">hours</span>
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
          <div className="p-2 rounded-lg bg-emerald-100">
            <Icon className="w-4 h-4 text-emerald-600" />
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

// ─── Main Family Dashboard ───────────────────────────────────────────────────

function Family() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Family Dashboard"
      subtitle="Cherish and nurture your family connections"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiMessageCircle className="w-4 h-4 mr-2" />
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
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="time">Time Together</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Family Members" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  }
                />
                <CardContent className="space-y-3">
                  {loading ? (
                    <>
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </>
                  ) : (
                    mockFamilyMembers.map((member) => <MemberCard key={member.id} member={member} />)
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Milestones" />
                <CardContent className="space-y-3">
                  {mockMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Family Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-emerald-600 hover:underline">
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
                <CardHeader title="Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Upcoming Events" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  }
                />
                <CardContent className="space-y-3">
                  {mockEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Event Types" />
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2">
                    <span className="flex items-center gap-2">🎂 Birthdays</span>
                    <Badge variant="pink">1 this month</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="flex items-center gap-2">🎓 Milestones</span>
                    <Badge variant="purple">1 this month</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="flex items-center gap-2">🎉 Gatherings</span>
                    <Badge variant="green">2 this month</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader title="Time Spent Together" />
            <CardContent>
              <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="gap-4">
                {mockTimeTogether.map((time, idx) => (
                  <TimeCard key={idx} time={time} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Family;
