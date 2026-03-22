/**
 * Busy Bee Executive Brief - Design System Implementation
 * AI-generated executive summaries
 */

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiCheckCircle, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Grid,
  LoadingOverlay,
} from '../components';

const mockBrief = {
  generated: '2024-01-20T10:30:00Z',
  period: 'Weekly',
  summary:
    'Your strategic position strengthened this week with key wins in Health and Finance domains.',
  highlights: [
    { type: 'win', text: 'Completed 5 goals ahead of schedule', impact: 'high' },
    { type: 'insight', text: 'Consider focusing more on relationships', impact: 'medium' },
    { type: 'alert', text: 'Career goals lagging behind target', impact: 'low' },
  ],
  metrics: {
    goalsCompleted: 12,
    goalsTotal: 15,
    streak: 14,
    score: 87,
  },
};

function ExecutiveBrief() {
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBrief(mockBrief);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  if (loading) return <LoadingOverlay message="Loading executive brief..." />;

  return (
    <PageContainer
      title="Executive Brief"
      subtitle="AI-powered strategic insights"
      actions={
        <Button onClick={handleGenerate} disabled={generating}>
          <FiRefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Regenerate'}
        </Button>
      }
    >
      {/* Key Metrics */}
      <Grid cols={{ default: 2, lg: 4 }} className="mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{brief.metrics.goalsCompleted}</p>
            <p className="text-sm text-foreground-muted">Goals Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{brief.metrics.goalsTotal}</p>
            <p className="text-sm text-foreground-muted">Total Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{brief.metrics.streak}</p>
            <p className="text-sm text-foreground-muted">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{brief.metrics.score}</p>
            <p className="text-sm text-foreground-muted">Score</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Summary */}
      <Card className="mb-6">
        <CardHeader
          title="Strategic Summary"
          subtitle={`Generated ${new Date(brief.generated).toLocaleDateString()}`}
        />
        <CardContent>
          <p className="text-lg text-foreground leading-relaxed">{brief.summary}</p>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader title="Key Highlights" />
        <CardContent className="space-y-3">
          {brief.highlights.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                item.type === 'win'
                  ? 'border-success/30 bg-success/5'
                  : item.type === 'insight'
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-warning/30 bg-warning/5'
              }`}
            >
              {item.type === 'win' && <FiCheckCircle className="w-5 h-5 text-success mt-0.5" />}
              {item.type === 'insight' && <FiTrendingUp className="w-5 h-5 text-primary mt-0.5" />}
              {item.type === 'alert' && <FiAlertTriangle className="w-5 h-5 text-warning mt-0.5" />}
              <div className="flex-1">
                <p className="text-foreground">{item.text}</p>
                <Badge
                  variant={
                    item.impact === 'high'
                      ? 'destructive'
                      : item.impact === 'medium'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="mt-1"
                >
                  {item.impact} impact
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default ExecutiveBrief;
