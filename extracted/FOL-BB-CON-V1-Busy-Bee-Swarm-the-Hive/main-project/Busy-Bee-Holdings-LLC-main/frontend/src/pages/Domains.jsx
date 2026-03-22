/**
 * Busy Bee Domains - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Grid,
  LoadingOverlay,
  EmptyState,
} from '../components';

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────
// In production, this would be empty or fetched from user's personal data
// These are the core life domains users can customize and add goals to

const DOMAINS = [
  { id: 1, name: 'Health', emoji: '🏃', color: '#10B981', goals: 5, completed: 2 },
  { id: 2, name: 'Career', emoji: '💼', color: '#3B82F6', goals: 3, completed: 1 },
  { id: 3, name: 'Mindset', emoji: '🧠', color: '#8B5CF6', goals: 4, completed: 3 },
  { id: 4, name: 'Habits', emoji: '🔄', color: '#F59E0B', goals: 6, completed: 4 },
  { id: 5, name: 'Finance', emoji: '💰', color: '#EF4444', goals: 2, completed: 0 },
  { id: 6, name: 'Relationships', emoji: '👥', color: '#EC4899', goals: 4, completed: 2 },
  { id: 7, name: 'Education', emoji: '📚', color: '#06B6D4', goals: 3, completed: 1 },
  { id: 8, name: 'Family', emoji: '🏠', color: '#F97316', goals: 3, completed: 2 },
  { id: 9, name: 'Spirituality', emoji: '✨', color: '#A855F7', goals: 2, completed: 1 },
];

function DomainCard({ domain }) {
  const progress = Math.round((domain.completed / domain.goals) * 100);

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${domain.color}20` }}
            >
              {domain.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{domain.name}</h3>
              <p className="text-sm text-foreground-muted">{domain.goals} goals</p>
            </div>
          </div>
          <button className="p-1 hover:bg-secondary rounded">
            <FiMoreVertical className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: domain.color }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Domains() {
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDomains(DOMAINS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredDomains = domains.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingOverlay message="Loading domains..." />;
  }

  return (
    <PageContainer
      title="Domains"
      subtitle="Organize your life into key areas"
      actions={
        <Button>
          <FiPlus className="w-4 h-4 mr-2" />
          New Domain
        </Button>
      }
    >
      {/* Search */}
      <div className="relative max-w-md mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search domains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Stats */}
      <Grid cols={{ default: 2, sm: 3, lg: 5 }} className="mb-6">
        {domains.map((domain) => (
          <div key={domain.id} className="text-center p-3">
            <p className="text-2xl mb-1">{domain.emoji}</p>
            <p className="font-medium text-foreground text-sm">{domain.name}</p>
            <p className="text-xs text-foreground-muted">
              {domain.completed}/{domain.goals}
            </p>
          </div>
        ))}
      </Grid>

      {/* Domain Cards */}
      {filteredDomains.length > 0 ? (
        <Grid cols={{ default: 1, md: 2, lg: 3 }} className="gap-4">
          {filteredDomains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No domains found"
          description="Create your first domain to organize your goals"
          action={
            <Button>
              <FiPlus className="w-4 h-4 mr-2" />
              Create Domain
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}

export default Domains;
