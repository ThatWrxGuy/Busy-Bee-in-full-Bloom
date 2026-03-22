/**
 * Busy Bee Demo - Design System Implementation
 */

import { useState } from 'react';
import { FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Grid,
} from '../components';

function Demo() {
  const [playing, setPlaying] = useState(false);

  return (
    <PageContainer title="Demo Mode" subtitle="Try out Busy Bee features">
      <Grid cols={{ default: 1, md: 2 }} className="gap-6">
        <Card>
          <CardHeader title="Interactive Demo" subtitle="Test the features without an account" />
          <CardContent className="space-y-4">
            <p className="text-foreground-muted">
              Explore all the features of Busy Bee in our interactive demo mode.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setPlaying(!playing)}>
                {playing ? (
                  <>
                    <FiPause className="w-4 h-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <FiPlay className="w-4 h-4 mr-2" /> Start Demo
                  </>
                )}
              </Button>
              <Button variant="outline">
                <FiRefreshCw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Feature Highlights" />
          <CardContent className="space-y-3">
            {[
              'Goal tracking & progress',
              'Life domains organization',
              'Analytics & insights',
              'Social features',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-foreground">{f}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

export default Demo;
