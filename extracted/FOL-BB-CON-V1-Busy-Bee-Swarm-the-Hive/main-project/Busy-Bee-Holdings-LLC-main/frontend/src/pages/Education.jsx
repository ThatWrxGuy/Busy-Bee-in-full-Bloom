/**
 * Busy Bee Education Dashboard - Design System Implementation
 * Learning, courses, certifications, and personal growth tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiBook, FiAward, FiClock, FiTarget, FiUsers, FiZap, FiCheck, FiCalendar } from 'react-icons/fi';
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

const EDUCATION_METRICS = {
  color: '#3B82F6',
  emoji: '📚',
  label: 'Education',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of education goals users might create

const mockStats = [
  { label: 'Overall Score', value: '70', trend: 5, icon: FiAward },
  { label: 'Courses Active', value: '4', trend: 1, icon: FiBook },
  { label: 'Certifications', value: '3', trend: 1, icon: FiAward },
  { label: 'Hours Learned', value: '48', trend: 12, icon: FiClock },
];

const mockCourses = [
  { id: 1, title: 'Advanced JavaScript', progress: 65, provider: 'Udemy', dueDate: 'Apr 15', category: 'Development' },
  { id: 2, title: 'Data Science Fundamentals', progress: 40, provider: 'Coursera', dueDate: 'May 1', category: 'Data' },
  { id: 3, title: 'UX Design Principles', progress: 85, provider: 'LinkedIn', dueDate: 'Mar 30', category: 'Design' },
  { id: 4, title: 'Project Management', progress: 20, provider: 'edX', dueDate: 'Jun 15', category: 'Business' },
];

const mockGoals = [
  { id: 1, title: 'Complete JavaScript course', progress: 65, status: 'active', target: '65/100%' },
  { id: 2, title: 'Earn AWS Certification', progress: 30, status: 'active', target: '30/100%' },
  { id: 3, title: 'Read 12 technical books', progress: 75, status: 'active', target: '9/12 books' },
  { id: 4, title: 'Learn Python basics', progress: 100, status: 'completed', target: 'Done' },
  { id: 5, title: 'Attend weekly study group', progress: 80, status: 'active', target: '8/10 sessions' },
];

const mockCertifications = [
  { id: 1, name: 'AWS Solutions Architect', status: 'in_progress', expiry: '2027', provider: 'Amazon' },
  { id: 2, name: 'Google Data Analytics', status: 'completed', expiry: '2026', provider: 'Google' },
  { id: 3, name: 'PMP Certification', status: 'planned', expiry: '-', provider: 'PMI' },
];

const mockStudySessions = [
  { id: 1, subject: 'JavaScript', duration: '2 hours', date: 'Today' },
  { id: 2, subject: 'Data Science', duration: '1.5 hours', date: 'Yesterday' },
  { id: 3, subject: 'UX Design', duration: '1 hour', date: '2 days ago' },
  { id: 4, subject: 'Project Management', duration: '45 min', date: '3 days ago' },
];

const mockBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', progress: 100, category: 'Development', completed: true },
  { id: 2, title: 'The Pragmatic Programmer', author: 'David Thomas', progress: 60, category: 'Development', completed: false },
  { id: 3, title: 'Design Patterns', author: 'Gang of Four', progress: 30, category: 'Development', completed: false },
  { id: 4, title: "You Don't Know JS", author: 'Kyle Simpson', progress: 85, category: 'Development', completed: false },
];

const mockInsights = [
  { label: 'Study streak', value: '5 days', icon: FiZap },
  { label: 'This month', value: '48 hours', icon: FiClock },
  { label: 'Courses completed', value: '2 this year', icon: FiAward },
  { label: 'Next deadline', value: 'UX Design (8 days)', icon: FiCalendar },
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
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Icon className="w-5 h-5 text-blue-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-blue-500' : isNegative ? 'text-red-500' : 'text-gray-500'
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

function CourseCard({ course }) {
  const categoryColors = {
    Development: 'bg-blue-100 text-blue-700',
    Data: 'bg-green-100 text-green-700',
    Design: 'bg-purple-100 text-purple-700',
    Business: 'bg-orange-100 text-orange-700',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.provider}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[course.category]}`}>
            {course.category}
          </span>
        </div>
        <Progress value={course.progress} className="h-2 mb-2" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{course.progress}% complete</span>
          <span className="text-xs text-gray-400">Due: {course.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CertificationCard({ cert }) {
  const statusColors = {
    completed: 'success',
    in_progress: 'warning',
    planned: 'secondary',
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <FiAward className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{cert.name}</h3>
          <p className="text-xs text-gray-500">{cert.provider}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={statusColors[cert.status]}>{cert.status.replace('_', ' ')}</Badge>
        <p className="text-xs text-gray-400 mt-1">Expires: {cert.expiry}</p>
      </div>
    </div>
  );
}

function StudySessionCard({ session }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
      <div className="p-2 rounded-lg bg-blue-100">
        <FiBook className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{session.subject}</p>
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
        <span className="text-xs text-gray-500">{book.progress}%</span>
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
          <div className="p-2 rounded-lg bg-blue-100">
            <Icon className="w-4 h-4 text-blue-600" />
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

// ─── Main Education Dashboard ───────────────────────────────────────────────────

function Education() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Education Dashboard"
      subtitle="Track your learning journey and certifications"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiBook className="w-4 h-4 mr-2" />
            Log Study
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
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Active Courses" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  }
                />
                <CardContent className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </>
                  ) : (
                    mockCourses.map((course) => <CourseCard key={course.id} course={course} />)
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Recent Sessions" />
                <CardContent className="space-y-1">
                  {mockStudySessions.slice(0, 4).map((session) => (
                    <StudySessionCard key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader 
              title="Certifications" 
              action={
                <Button size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              }
            />
            <CardContent className="space-y-3">
              {mockCertifications.map((cert) => (
                <CertificationCard key={cert.id} cert={cert} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Education Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-blue-600 hover:underline">
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

        <TabsContent value="books">
          <Card>
            <CardHeader 
              title="Technical Books" 
              action={
                <Button size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              }
            />
            <CardContent>
              <Grid cols={{ default: 1, md: 2, lg: 3 }} className="gap-4">
                {mockBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Education;
