/**
 * Busy Bee Analytics - Design System Implementation
 * Admin analytics dashboard
 */

import { useState, useEffect } from 'react';
import { FiUsers, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Grid,
  StatCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LoadingOverlay,
} from '../components';

// Mock analytics data
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  revenue: 45230,
  growth: 12.5,
};

const mockRevenue = [
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 4100 },
  { month: 'Mar', value: 3800 },
  { month: 'Apr', value: 5200 },
  { month: 'May', value: 4900 },
  { month: 'Jun', value: 6100 },
];

const mockSources = [
  { source: 'Direct', value: 45 },
  { source: 'Organic', value: 30 },
  { source: 'Referral', value: 15 },
  { source: 'Social', value: 10 },
];

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingOverlay message="Loading analytics..." />;
  }

  return (
    <PageContainer
      title="Analytics"
      subtitle="Track your platform performance"
      actions={
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        <StatCard
          label="Total Users"
          value={mockStats.totalUsers.toLocaleString()}
          icon={FiUsers}
        />
        <StatCard
          label="Active Users"
          value={mockStats.activeUsers.toLocaleString()}
          icon={FiActivity}
        />
        <StatCard
          label="Revenue"
          value={`$${mockStats.revenue.toLocaleString()}`}
          icon={FiDollarSign}
        />
        <StatCard
          label="Growth"
          value={`+${mockStats.growth}%`}
          icon={FiTrendingUp}
          trend={mockStats.growth}
        />
      </Grid>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Grid cols={{ default: 1, lg: 2 }} className="gap-6">
            <Card>
              <CardHeader title="Revenue Trend" />
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockRevenue.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(item.value / 7000) * 100}%` }}
                      />
                      <span className="text-xs text-foreground-muted">{item.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Traffic Sources" />
              <CardContent>
                <div className="space-y-4">
                  {mockSources.map((source, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{source.source}</span>
                        <span className="text-foreground-muted">{source.value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${source.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader title="User Analytics" />
            <CardContent>
              <p className="text-foreground-muted">User analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader title="Revenue Analytics" />
            <CardContent>
              <p className="text-foreground-muted">Revenue analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Analytics;
