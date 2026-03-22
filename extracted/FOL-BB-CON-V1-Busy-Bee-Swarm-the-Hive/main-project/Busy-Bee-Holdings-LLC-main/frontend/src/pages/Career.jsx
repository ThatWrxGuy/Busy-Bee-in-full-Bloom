/**
 * Busy Bee Career Dashboard - Design System Implementation
 * Professional growth and career development tracking
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiBriefcase, FiTarget, FiAward, FiMapPin, FiClock, FiMail, FiFileText, FiUsers, FiStar } from 'react-icons/fi';
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

const CAREER_METRICS = {
  color: '#3B82F6',
  emoji: '💼',
  label: 'Career',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These examples show the types of career goals users might create

const mockStats = [
  { label: 'Overall Score', value: '85', trend: 7, icon: FiBriefcase },
  { label: 'Skills', value: '12', trend: 2, icon: FiAward },
  { label: 'Certifications', value: '4', trend: 1, icon: FiFileText },
  { label: 'Applications', value: '8', trend: -3, icon: FiMail },
];

const mockSkills = [
  { id: 1, name: 'JavaScript', level: 90, category: 'Technical' },
  { id: 2, name: 'React', level: 85, category: 'Technical' },
  { id: 3, name: 'Node.js', level: 75, category: 'Technical' },
  { id: 4, name: 'Leadership', level: 70, category: 'Soft Skills' },
  { id: 5, name: 'Project Management', level: 65, category: 'Soft Skills' },
  { id: 6, name: 'Python', level: 60, category: 'Technical' },
];

const mockGoals = [
  { id: 1, title: 'Complete professional certification', progress: 30, status: 'active', target: '1/3 completed' },
  { id: 2, title: 'Learn new framework', progress: 60, status: 'active', target: '2/5 modules' },
  { id: 3, title: 'Network with 5 professionals', progress: 80, status: 'active', target: '4/5 connections' },
  { id: 4, title: 'Update LinkedIn profile', progress: 100, status: 'completed', target: 'Done' },
];

const mockApplications = [
  { 
    id: 1, 
    company: 'Tech Corp', 
    position: 'Senior Developer', 
    status: 'interview', 
    date: '2 days ago',
    salary: '$120k - $150k'
  },
  { 
    id: 2, 
    company: 'StartupXYZ', 
    position: 'Tech Lead', 
    status: 'applied', 
    date: '5 days ago',
    salary: '$130k - $160k'
  },
  { 
    id: 3, 
    company: 'Enterprise Inc', 
    position: 'Full Stack Engineer', 
    status: 'rejected', 
    date: '1 week ago',
    salary: '$110k - $140k'
  },
  { 
    id: 4, 
    company: 'InnovateTech', 
    position: 'Frontend Architect', 
    status: 'pending', 
    date: '1 week ago',
    salary: '$125k - $155k'
  },
];

const mockCertifications = [
  { id: 1, name: 'AWS Solutions Architect', provider: 'Amazon', status: 'completed', date: 'Jan 2024' },
  { id: 2, name: 'Google Cloud Professional', provider: 'Google', status: 'in_progress', date: 'Mar 2024' },
  { id: 3, name: 'PMP Certification', provider: 'PMI', status: 'planned', date: 'Jun 2024' },
];

const mockMeetups = [
  { id: 1, name: 'Tech Meetup Monthly', date: 'Next week', attendees: 45, type: 'Networking' },
  { id: 2, name: 'React Conference 2024', date: 'In 2 months', attendees: 500, type: 'Conference' },
  { id: 3, name: 'Startup Mixer', date: 'In 3 weeks', attendees: 80, type: 'Networking' },
];

const mockProjects = [
  { id: 1, name: 'Open Source Contribution', role: 'Contributor', hours: 24, impact: 'High' },
  { id: 2, name: 'Internal Tool Development', role: 'Lead', hours: 40, impact: 'Medium' },
  { id: 3, name: 'Mentorship Program', role: 'Mentor', hours: 12, impact: 'High' },
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

function SkillCard({ skill }) {
  const categoryColors = {
    'Technical': 'bg-blue-100 text-blue-700',
    'Soft Skills': 'bg-purple-100 text-purple-700',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">{skill.name}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[skill.category] || 'bg-gray-100'}`}>
            {skill.category}
          </span>
        </div>
        <Progress value={skill.level} className="h-2 mb-1" />
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">{skill.level}%</span>
          <span className="text-xs text-gray-400">Proficiency</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationCard({ application }) {
  const statusColors = {
    pending: 'secondary',
    applied: 'info',
    interview: 'warning',
    rejected: 'destructive',
    offered: 'success',
  };

  const statusIcons = {
    pending: FiClock,
    applied: FiMail,
    interview: FiUsers,
    rejected: FiTrendingDown,
    offered: FiStar,
  };

  const StatusIcon = statusIcons[application.status] || FiClock;

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{application.position}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiMapPin size={12} /> {application.company}
            </p>
          </div>
          <Badge variant={statusColors[application.status]} className="flex items-center gap-1">
            <StatusIcon size={12} />
            {application.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{application.date}</span>
          <span className="text-sm font-medium text-gray-700">{application.salary}</span>
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
          <p className="font-medium text-gray-900">{cert.name}</p>
          <p className="text-xs text-gray-500">{cert.provider} • {cert.date}</p>
        </div>
      </div>
      <Badge variant={statusColors[cert.status]}>{cert.status.replace('_', ' ')}</Badge>
    </div>
  );
}

function MeetupCard({ meetup }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="p-2 rounded-lg bg-purple-100">
        <FiUsers className="w-4 h-4 text-purple-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{meetup.name}</p>
        <p className="text-xs text-gray-500">{meetup.date} • {meetup.type}</p>
      </div>
      <span className="text-xs text-gray-400">{meetup.attendees} attending</span>
    </div>
  );
}

function ProjectCard({ project }) {
  const impactColors = {
    High: 'text-emerald-600',
    Medium: 'text-blue-600',
    Low: 'text-gray-500',
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100">
          <FiTarget className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{project.name}</p>
          <p className="text-xs text-gray-500">{project.role} • {project.hours}h logged</p>
        </div>
      </div>
      <span className={`text-sm font-medium ${impactColors[project.impact]}`}>
        {project.impact} Impact
      </span>
    </div>
  );
}

// ─── Main Career Dashboard ───────────────────────────────────────────────────

function Career() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Career Dashboard"
      subtitle="Track your professional growth and career goals"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiBriefcase className="w-4 h-4 mr-2" />
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
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader
                  title="Career Goals"
                  action={
                    <Link to="/goals" className="text-sm text-blue-600 hover:underline">
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
                <CardHeader title="Recent Applications" />
                <CardContent className="space-y-3">
                  {mockApplications.slice(0, 3).map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader title="Top Skills" />
                <CardContent className="space-y-3">
                  {mockSkills.slice(0, 4).map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Upcoming Events" />
                <CardContent className="space-y-1">
                  {mockMeetups.slice(0, 2).map((meetup) => (
                    <MeetupCard key={meetup.id} meetup={meetup} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader title="Job Applications" />
                <CardContent className="space-y-4">
                  {mockApplications.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Application Stats" />
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">8</p>
                    <p className="text-sm text-blue-700">Total Applications</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">1</p>
                      <p className="text-xs text-amber-700">Interview</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xl font-bold text-gray-600">3</p>
                      <p className="text-xs text-gray-700">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xl font-bold text-emerald-600">0</p>
                      <p className="text-xs text-emerald-700">Offered</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-xl font-bold text-red-600">1</p>
                      <p className="text-xs text-red-700">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader title="Skills & Proficiency" />
            <CardContent>
              <Grid cols={{ default: 1, md: 2, lg: 3 }} className="gap-4">
                {mockSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Certifications" 
                  actions={
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
            </div>
            <div>
              <Card>
                <CardHeader title="Projects & Impact" />
                <CardContent className="space-y-3">
                  {mockProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
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

export default Career;
