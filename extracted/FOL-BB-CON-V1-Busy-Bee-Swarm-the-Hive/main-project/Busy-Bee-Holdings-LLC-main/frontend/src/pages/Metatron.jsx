/**
 * Busy Bee Metatron - Design System Implementation
 * Strategic intelligence cube interface
 */

import { useState, useEffect } from 'react';
import { FiGrid, FiHexagon, FiActivity, FiTarget } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  LoadingOverlay,
} from '../components';

const CUBES = [
  { id: 1, name: 'Strategic', color: '#F59E0B', status: 'active', metrics: 12 },
  { id: 2, name: 'Tactical', color: '#3B82F6', status: 'active', metrics: 8 },
  { id: 3, name: 'Operational', color: '#10B981', status: 'active', metrics: 15 },
  { id: 4, name: 'Financial', color: '#EF4444', status: 'paused', metrics: 6 },
];

function Metatron() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingOverlay message="Loading Metatron..." />;

  return (
    <PageContainer title="Metatron Cube" subtitle="Strategic intelligence system">
      <Grid cols={{ default: 1, md: 2, lg: 4 }} className="gap-4 mb-6">
        {CUBES.map((cube) => (
          <Card key={cube.id} hover className="cursor-pointer">
            <CardContent className="p-6 text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cube.color}20` }}
              >
                <FiHexagon className="w-8 h-8" style={{ color: cube.color }} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{cube.name}</h3>
              <p className="text-sm text-foreground-muted mb-2">{cube.metrics} metrics</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  cube.status === 'active'
                    ? 'bg-success/20 text-success'
                    : 'bg-secondary text-foreground-muted'
                }`}
              >
                {cube.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Grid cols={{ default: 1, lg: 2 }} className="gap-6">
        <Card>
          <CardHeader title="Cube Status" />
          <CardContent>
            <div className="space-y-4">
              {CUBES.map((cube) => (
                <div
                  key={cube.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cube.color }} />
                    <span className="font-medium text-foreground">{cube.name} Intelligence</span>
                  </div>
                  <span className="text-success text-sm">Online</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Activity" />
          <CardContent>
            <div className="space-y-3">
              {[
                'Strategic analysis updated',
                'New tactical recommendations',
                'Financial metrics synced',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <FiActivity className="w-4 h-4 text-primary" />
                  <span className="text-foreground-muted">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

export default Metatron;
