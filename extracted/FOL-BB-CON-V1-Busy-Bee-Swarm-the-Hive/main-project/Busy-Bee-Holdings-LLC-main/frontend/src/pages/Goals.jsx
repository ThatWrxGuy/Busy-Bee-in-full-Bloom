/**
 * Busy Bee Goals - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiTarget, FiCheck, FiClock, FiMoreVertical, FiTrash2, FiEdit2 } from 'react-icons/fi';
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
  Input,
  LoadingOverlay,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';
import { getGoals, createGoal, updateGoal, deleteGoal, completeGoal } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Constants
const DOMAIN_META = {
  health: { emoji: '🏃', label: 'Health' },
  career: { emoji: '💼', label: 'Career' },
  mindset: { emoji: '🧠', label: 'Mindset' },
  habits: { emoji: '🔄', label: 'Habits' },
  relationships: { emoji: '👥', label: 'Relationships' },
  finance: { emoji: '💰', label: 'Finance' },
  education: { emoji: '📚', label: 'Education' },
  spirituality: { emoji: '✨', label: 'Spirituality' },
  family: { emoji: '👨‍👩‍👧', label: 'Family' },
  recreation: { emoji: '🎮', label: 'Recreation' },
  travel: { emoji: '✈️', label: 'Travel' },
};

const STATUS_COLORS = {
  active: 'success',
  completed: 'info',
  paused: 'secondary',
  abandoned: 'secondary',
};

// Default empty goals for new users
const defaultGoals = [];

function GoalCard({ goal, onClick, onComplete, onDelete }) {
  const domain = DOMAIN_META[goal.domain] || { emoji: '🎯', label: goal.domain };
  const progress = goal.target_value > 0 
    ? Math.round((goal.current_value / goal.target_value) * 100) 
    : 0;

  return (
    <Card hover className="cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{domain.emoji}</span>
            <div>
              <h3 className="font-medium text-foreground">{goal.title}</h3>
              <p className="text-xs text-foreground-muted">{domain.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {goal.status !== 'completed' && (
              <button 
                className="p-1 hover:bg-secondary rounded text-success"
                onClick={(e) => { e.stopPropagation(); onComplete?.(goal.id); }}
                title="Mark complete"
              >
                <FiCheck className="w-4 h-4" />
              </button>
            )}
            <button 
              className="p-1 hover:bg-secondary rounded text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete?.(goal.id); }}
              title="Delete goal"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-3" />

        <div className="flex items-center justify-between">
          <Badge variant={STATUS_COLORS[goal.status] || 'secondary'}>
            {goal.status || 'active'}
          </Badge>
          <span className="text-sm text-foreground-muted">
            {goal.current_value || 0} / {goal.target_value || 1}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Goals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await getGoals();
    if (data) {
      setGoals(data);
    }
    setLoading(false);
  };

  const handleCreateGoal = async (newGoal) => {
    const { data, error } = await createGoal({
      ...newGoal,
      user_id: user.id,
      status: 'active',
      current_value: 0,
    });
    if (data) {
      setGoals([data, ...goals]);
      setShowAddModal(false);
    }
  };

  const handleUpdateProgress = async (goalId, progress) => {
    const { data, error } = await updateGoal(goalId, { current_value: progress });
    if (data) {
      setGoals(goals.map(g => g.id === goalId ? data : g));
    }
  };

  const handleCompleteGoal = async (goalId) => {
    const { data, error } = await completeGoal(goalId);
    if (data) {
      setGoals(goals.map(g => g.id === goalId ? data : g));
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const { error } = await deleteGoal(goalId);
    if (!error) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesFilter = filter === 'all' || goal.status === filter;
    const matchesSearch =
      goal.title?.toLowerCase().includes(search.toLowerCase()) ||
      goal.domain?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === 'active').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    paused: goals.filter((g) => g.status === 'paused').length,
  };

  if (loading) {
    return <LoadingOverlay message="Loading goals..." />;
  }

  return (
    <PageContainer
      title="Goals"
      subtitle="Track your personal goals and milestones"
      actions={
        <Button onClick={() => setShowAddModal(true)}>
          <FiPlus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      }
    >
      {/* Stats */}
      <Grid cols={{ default: 2, sm: 4 }} className="mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-foreground-muted">Total Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.active}</p>
            <p className="text-sm text-foreground-muted">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info">{stats.completed}</p>
            <p className="text-sm text-foreground-muted">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground-muted">{stats.paused}</p>
            <p className="text-sm text-foreground-muted">Paused</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <Grid cols={{ default: 1, md: 2, lg: 3 }} className="gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => console.log('Goal clicked:', goal.id)}
              onComplete={handleCompleteGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={FiTarget}
          title="No goals found"
          description={
            search ? 'Try adjusting your search' : 'Create your first goal to get started'
          }
          action={
            <Button onClick={() => setShowAddModal(true)}>
              <FiPlus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}

export default Goals;
