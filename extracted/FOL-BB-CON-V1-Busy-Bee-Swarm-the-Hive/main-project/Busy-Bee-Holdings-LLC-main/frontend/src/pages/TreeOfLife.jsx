/**
 * Busy Bee Tree of Life - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiGitBranch, FiTarget, FiHeart, FiTrendingUp } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  LoadingOverlay,
} from '../components';

const BRANCHES = [
  { id: 1, name: 'Career', progress: 75, icon: '💼', color: '#3B82F6' },
  { id: 2, name: 'Health', progress: 60, icon: '🏃', color: '#10B981' },
  { id: 3, name: 'Relationships', progress: 45, icon: '❤️', color: '#EF4444' },
  { id: 4, name: 'Finance', progress: 80, icon: '💰', color: '#F59E0B' },
  { id: 5, name: 'Growth', progress: 55, icon: '🌱', color: '#8B5CF6' },
];

function TreeOfLife() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingOverlay message="Loading Tree of Life..." />;

  return (
    <PageContainer title="Tree of Life" subtitle="Visualize your life balance">
      <Card className="mb-6">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Life Tree</h2>
          <p className="text-foreground-muted">
            A holistic view of your growth across all life domains
          </p>
        </CardContent>
      </Card>

      <Grid cols={{ default: 1, sm: 2, lg: 5 }} className="gap-4">
        {BRANCHES.map((branch) => (
          <Card key={branch.id} hover>
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-3">{branch.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{branch.name}</h3>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${branch.progress}%`, backgroundColor: branch.color }}
                />
              </div>
              <p className="text-sm text-foreground-muted">{branch.progress}% growth</p>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
}

export default TreeOfLife;
