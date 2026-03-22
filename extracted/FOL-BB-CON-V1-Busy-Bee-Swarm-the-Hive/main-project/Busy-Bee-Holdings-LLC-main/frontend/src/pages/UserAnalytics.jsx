/**
 * Busy Bee UserAnalytics - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiTarget, FiAward } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  StatCard,
  LoadingOverlay,
} from '../components';

const mockData = {
  totalTime: '127h',
  avgDaily: '4.2h',
  streak: 14,
  goalsCompleted: 23,
  topCategory: 'Health',
  weeklyProgress: [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.1 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 6.2 },
    { day: 'Sun', hours: 3.1 },
  ],
};

function UserAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingOverlay message="Loading analytics..." />;

  return (
    <PageContainer title="My Analytics" subtitle="Track your personal progress">
      <Grid cols={{ default: 2, lg: 4 }} className="mb-6">
        <StatCard label="Total Time" value={mockData.totalTime} icon={FiClock} />
        <StatCard label="Daily Average" value={mockData.avgDaily} icon={FiTrendingUp} />
        <StatCard label="Current Streak" value={`${mockData.streak} days`} icon={FiAward} />
        <StatCard label="Goals Done" value={mockData.goalsCompleted} icon={FiTarget} />
      </Grid>

      <Grid cols={{ default: 1, lg: 2 }} className="gap-6">
        <Card>
          <CardHeader title="Weekly Progress" />
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {mockData.weeklyProgress.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${(day.hours / 7) * 100}%` }}
                  />
                  <span className="text-xs text-foreground-muted">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Top Category" />
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-5xl mb-2">🏃</p>
              <p className="text-xl font-semibold text-foreground">{mockData.topCategory}</p>
              <p className="text-foreground-muted">Most time spent</p>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

export default UserAnalytics;
