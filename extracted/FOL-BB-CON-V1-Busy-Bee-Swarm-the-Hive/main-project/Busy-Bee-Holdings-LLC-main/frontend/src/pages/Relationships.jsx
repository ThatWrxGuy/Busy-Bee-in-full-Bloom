/**
 * Busy Bee Relationships Dashboard - Design System Implementation
 * Family, friends, partner, and social connections tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiUsers, FiUser, FiHeart, FiMessageCircle, FiCalendar, FiGift, FiStar, FiClock, FiAward } from 'react-icons/fi';
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

const RELATIONSHIPS_METRICS = {
  color: '#EC4899',
  emoji: '👥',
  label: 'Relationships',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of relationship goals users might create

const mockStats = [
  { label: 'Overall Score', value: '90', trend: 2, icon: FiHeart },
  { label: 'Connections', value: '47', trend: 5, icon: FiUsers },
  { label: 'Pending Follow-ups', value: '8', trend: -3, icon: FiClock },
  { label: 'Quality Time', value: '12', trend: 4, icon: FiStar },
];

const mockConnections = [
  { id: 1, name: 'Mom', relationship: 'Family', lastContact: 'Today', priority: 'high', avatar: '👩' },
  { id: 2, name: 'Dad', relationship: 'Family', lastContact: 'Yesterday', priority: 'high', avatar: '👨' },
  { id: 3, name: 'Sarah', relationship: 'Partner', lastContact: 'Today', priority: 'high', avatar: '💕' },
  { id: 4, name: 'Bestie', relationship: 'Friend', lastContact: '2 days ago', priority: 'medium', avatar: '👯' },
  { id: 5, name: 'Work Buddy', relationship: 'Work', lastContact: 'Yesterday', priority: 'low', avatar: '💼' },
  { id: 6, name: 'Grandma', relationship: 'Family', lastContact: '3 days ago', priority: 'high', avatar: '👵' },
];

const mockGoals = [
  { id: 1, title: 'Weekly family dinner', progress: 80, status: 'active', target: '4/5 dinners' },
  { id: 2, title: 'Call parents twice a week', progress: 100, status: 'completed', target: 'Done' },
  { id: 3, title: 'Date night every Friday', progress: 75, status: 'active', target: '3/4 Fridays' },
  { id: 4, title: 'Reconnect with old friend', progress: 30, status: 'active', target: '1/3 meetups' },
  { id: 5, title: 'Send birthday cards', progress: 60, status: 'active', target: '6/10 cards' },
];

const mockEvents = [
  { id: 1, title: "Mom's Birthday", date: 'Mar 25', type: 'birthday', contact: 'Mom' },
  { id: 2, title: 'Date Night', date: 'Friday', type: 'date', contact: 'Sarah' },
  { id: 3, title: 'Family Dinner', date: 'Sunday', type: 'family', contact: 'Family' },
  { id: 4, title: 'Coffee with Bestie', date: 'Saturday', type: 'friend', contact: 'Bestie' },
];

const mockMessages = [
  { id: 1, from: 'Mom', preview: 'Hey sweetie! Just wanted to check in...', time: '2 hours ago', unread: true },
  { id: 2, from: 'Sarah', preview: 'What time are you getting home?', time: '4 hours ago', unread: true },
  { id: 3, from: 'Bestie', preview: 'Did you see that video I sent?', time: 'Yesterday', unread: false },
];

const mockInsights = [
  { label: 'Most contact', value: 'Partner', icon: FiHeart },
  { label: 'Needs attention', value: 'Grandma (3 days)', icon: FiClock },
  { label: 'New this month', value: '2 connections', icon: FiUsers },
  { label: 'Quality time', value: '12 hours', icon: FiStar },
];

const mockGroups = [
  { id: 1, name: 'Family', members: 5, emoji: '🏠' },
  { id: 2, name: 'Friends', members: 12, emoji: '🎉' },
  { id: 3, name: 'Work', members: 8, emoji: '💼' },
  { id: 4, name: 'Community', members: 15, emoji: '🤝' },
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
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Icon className="w-5 h-5 text-pink-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-pink-500' : isNegative ? 'text-red-500' : 'text-gray-500'
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

function ConnectionCard({ connection }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-700',
  };

  const relationshipColors = {
    Family: 'bg-pink-100 text-pink-700',
    Partner: 'bg-purple-100 text-purple-700',
    Friend: 'bg-blue-100 text-blue-700',
    Work: 'bg-gray-100 text-gray-700',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{connection.avatar}</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{connection.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${relationshipColors[connection.relationship]}`}>
                {connection.relationship}
              </span>
              <span className="text-xs text-gray-500">{connection.lastContact}</span>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[connection.priority]}`}>
            {connection.priority}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }) {
  const typeColors = {
    birthday: 'bg-pink-100 text-pink-700',
    date: 'bg-purple-100 text-purple-700',
    family: 'bg-blue-100 text-blue-700',
    friend: 'bg-green-100 text-green-700',
  };

  const typeIcons = {
    birthday: '🎂',
    date: '💕',
    family: '🏠',
    friend: '👯',
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
      <div className="text-2xl">{typeIcons[event.type]}</div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.date} • {event.contact}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${typeColors[event.type]}`}>
        {event.type}
      </span>
    </div>
  );
}

function MessageCard({ message }) {
  return (
    <div className={`p-3 rounded-lg ${message.unread ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'} cursor-pointer hover:bg-gray-100 transition-colors`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-gray-900">{message.from}</h3>
        <span className="text-xs text-gray-500">{message.time}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-1">{message.preview}</p>
      {message.unread && (
        <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mt-2" />
      )}
    </div>
  );
}

function GroupCard({ group }) {
  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{group.emoji}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-500">{group.members} members</p>
          </div>
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
          <div className="p-2 rounded-lg bg-pink-100">
            <Icon className="w-4 h-4 text-pink-600" />
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

// ─── Main Relationships Dashboard ───────────────────────────────────────────────

function Relationships() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Relationships Dashboard"
      subtitle="Nurture your connections and build stronger relationships"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiUser className="w-4 h-4 mr-2" />
            Add Connection
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
      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connections List */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader 
                  title="My Connections" 
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
                    mockConnections.map((connection) => (
                      <ConnectionCard key={connection.id} connection={connection} />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Groups" />
                <CardContent className="space-y-3">
                  {mockGroups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Quick Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.slice(0, 2).map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
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
                  title="Relationship Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-pink-600 hover:underline">
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
                    <span className="flex items-center gap-2">💕 Dates</span>
                    <Badge variant="purple">4 this month</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="flex items-center gap-2">🏠 Family</span>
                    <Badge variant="blue">2 this month</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="flex items-center gap-2">👯 Friends</span>
                    <Badge variant="green">3 this month</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Recent Messages" />
                <CardContent className="space-y-3">
                  {mockMessages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Unread Count" />
                <CardContent className="text-center p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-pink-600">2</span>
                  </div>
                  <p className="text-gray-500">unread messages</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Relationships;
