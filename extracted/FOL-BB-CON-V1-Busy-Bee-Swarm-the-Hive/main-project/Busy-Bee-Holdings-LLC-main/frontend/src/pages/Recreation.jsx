/**
 * Busy Bee Recreation Dashboard - Design System Implementation
 * Hobbies, entertainment, creative pursuits, and fun activities
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiCamera, FiBook, FiClock, FiTarget, FiStar, FiAward, FiHeart, FiActivity } from 'react-icons/fi';
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

const RECREATION_METRICS = {
  color: '#F97316',
  emoji: '🎨',
  label: 'Recreation',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────

const mockStats = [
  { label: 'Overall Score', value: '72', trend: 5, icon: FiStar },
  { label: 'Active Hobbies', value: '6', trend: 2, icon: FiStar },
  { label: 'Hours This Week', value: '12', trend: 8, icon: FiClock },
  { label: 'Projects', value: '4', trend: 1, icon: FiAward },
];

const mockHobbies = [
  { id: 1, name: 'Photography', category: 'Creative', hoursPerWeek: 4, level: 'Intermediate', status: 'active', emoji: '📷' },
  { id: 2, name: 'Guitar', category: 'Music', hoursPerWeek: 3, level: 'Beginner', status: 'active', emoji: '🎸' },
  { id: 3, name: 'Gaming', category: 'Entertainment', hoursPerWeek: 6, level: 'Expert', status: 'active', emoji: '🎮' },
  { id: 4, name: 'Reading', category: 'Entertainment', hoursPerWeek: 5, level: 'Advanced', status: 'active', emoji: '📚' },
  { id: 5, name: 'Painting', category: 'Creative', hoursPerWeek: 2, level: 'Beginner', status: 'paused', emoji: '🎨' },
  { id: 6, name: 'Cooking', category: 'Lifestyle', hoursPerWeek: 4, level: 'Intermediate', status: 'active', emoji: '🍳' },
];

const mockGoals = [
  { id: 1, title: 'Complete photo album', progress: 65, status: 'active', target: '65/100%' },
  { id: 2, title: 'Learn 5 new songs', progress: 80, status: 'active', target: '4/5 songs' },
  { id: 3, title: 'Finish painting project', progress: 40, status: 'active', target: '2/5 pieces' },
  { id: 4, title: 'Try 10 new recipes', progress: 100, status: 'completed', target: 'Done' },
];

const mockEntertainment = [
  { id: 1, type: 'Movies', title: 'Watched 2 films', hours: 4, date: 'This week' },
  { id: 2, type: 'TV Shows', title: 'Continued series', hours: 6, date: 'This week' },
  { id: 3, type: 'Gaming', title: 'Played new RPG', hours: 8, date: 'This week' },
  { id: 4, type: 'Podcasts', title: 'Listened to 3 episodes', hours: 3, date: 'This week' },
];

const mockProjects = [
  { id: 1, name: 'Photo Portfolio', progress: 45, category: 'Photography', deadline: 'Apr 30' },
  { id: 2, name: 'Learn Scales', progress: 70, category: 'Music', deadline: 'Ongoing' },
  { id: 3, name: 'Watercolor Set', progress: 30, category: 'Art', deadline: 'May 15' },
];

const mockBucketList = [
  { id: 1, name: 'Learn to play piano', category: 'Music', completed: false },
  { id: 2, name: 'Write a short story', category: 'Creative', completed: false },
  { id: 3, name: 'Take a pottery class', category: 'Creative', completed: true },
  { id: 4, name: 'Build a PC', category: 'Tech', completed: true },
];

const mockInsights = [
  { label: 'Most time', value: 'Photography (6h)', icon: FiCamera },
  { label: 'This month', value: '48 hours', icon: FiClock },
  { label: 'Completed', value: '2 projects', icon: FiAward },
  { label: 'Favorite', value: 'Photography', icon: FiCamera },
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
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-orange-500' : isNegative ? 'text-red-500' : 'text-gray-500'
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
  const statusColors = { active: 'success', completed: 'info', paused: 'secondary' };
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

function HobbyCard({ hobby }) {
  const categoryColors = {
    Creative: 'bg-purple-100 text-purple-700',
    Music: 'bg-pink-100 text-pink-700',
    Entertainment: 'bg-blue-100 text-blue-700',
    Lifestyle: 'bg-green-100 text-green-700',
  };

  const levelColors = {
    Beginner: 'bg-gray-100',
    Intermediate: 'bg-blue-100',
    Advanced: 'bg-purple-100',
    Expert: 'bg-orange-100',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{hobby.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{hobby.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[hobby.level]}`}>
                {hobby.level}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[hobby.category]}`}>
                {hobby.category}
              </span>
              <span className="text-xs text-gray-500">{hobby.hoursPerWeek}h/week</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EntertainmentCard({ item }) {
  const typeIcons = { Movies: '🎬', 'TV Shows': '📺', Gaming: '🎮', Podcasts: '🎧' };
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
      <span className="text-2xl">{typeIcons[item.type]}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.title}</p>
        <p className="text-xs text-gray-500">{item.date}</p>
      </div>
      <span className="text-sm text-orange-500">{item.hours}h</span>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900">{project.name}</h3>
          <span className="text-xs text-gray-400">{project.deadline}</span>
        </div>
        <Progress value={project.progress} className="h-2 mb-2" />
        <div className="flex justify-between">
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
            {project.category}
          </span>
          <span className="text-xs text-gray-500">{project.progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

function BucketListItem({ item }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${item.completed ? 'bg-gray-50' : 'hover:bg-orange-50'}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        item.completed ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
      }`}>
        {item.completed && <FiAward className="text-white" size={12} />}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-500">{item.category}</p>
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <Icon className="w-4 h-4 text-orange-600" />
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

// ─── Main Recreation Dashboard ───────────────────────────────────────────────────

function Recreation() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Recreation Dashboard"
      subtitle="Explore your hobbies and creative outlets"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiClock className="w-4 h-4 mr-2" />
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
      <Tabs defaultValue="hobbies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="hobbies">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="My Hobbies" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add Hobby
                    </Button>
                  }
                />
                <CardContent className="space-y-3">
                  {loading ? (
                    <>
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </>
                  ) : (
                    mockHobbies.map((hobby) => <HobbyCard key={hobby.id} hobby={hobby} />)
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Bucket List" />
                <CardContent className="space-y-2">
                  {mockBucketList.map((item) => (
                    <BucketListItem key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entertainment">
          <Card>
            <CardHeader title="This Week's Entertainment" />
            <CardContent className="space-y-2">
              {mockEntertainment.map((item) => (
                <EntertainmentCard key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Creative Projects" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  }
                />
                <CardContent>
                  <Grid cols={{ default: 1, md: 2 }} className="gap-4">
                    {mockProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </Grid>
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

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Recreation Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-orange-600 hover:underline">
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

export default Recreation;
