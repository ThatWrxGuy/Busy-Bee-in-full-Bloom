/**
 * Busy Bee Tasks - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiClock, FiMoreVertical, FiCheck } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Checkbox,
  LoadingOverlay,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';

// Mock data - EXAMPLES ONLY for users to reference when creating their own tasks
// In production, this would be empty or fetched from user's personal data
// These examples show the types of tasks users might create for each domain

// Example tasks by domain:
// - Health: "Schedule health checkup", "Buy vitamins", "Book yoga class"
// - Career: "Update LinkedIn", "Send follow-up email", "Prepare for interview"
// - Finance: "Update budget spreadsheet", "Review investments", "Pay bills"
// - Mindset: "Meditation session", "Journaling", "Read 30 minutes"
// - Relationships: "Call mom", "Plan date night", "Send birthday card"
// - Habits: "Morning workout", "Evening wind-down", "Meal prep"
// - Education: "Complete course module", "Practice coding", "Read documentation"
// - Family: "Grocery shopping", "Plan weekend activity", "Family dinner"
// - Spirituality: "Gratitude journal", "Meditate", "Volunteer"

const mockTasks = [
  {
    id: 1,
    title: 'Review quarterly goals',
    priority: 'high',
    due: 'Today',
    is_completed: false,
    category: 'Work',
  },
  {
    id: 2,
    title: 'Schedule health checkup',
    priority: 'medium',
    due: 'Tomorrow',
    is_completed: false,
    category: 'Health',
  },
  {
    id: 3,
    title: 'Update budget spreadsheet',
    priority: 'low',
    due: 'Fri',
    is_completed: false,
    category: 'Finance',
  },
  {
    id: 4,
    title: 'Meditation session',
    priority: 'medium',
    due: 'Daily',
    is_completed: true,
    category: 'Mindset',
  },
  {
    id: 5,
    title: 'Call mom',
    priority: 'high',
    due: 'Sun',
    is_completed: false,
    category: 'Relationships',
  },
  {
    id: 6,
    title: 'Grocery shopping',
    priority: 'low',
    due: 'Today',
    is_completed: false,
    category: 'Habits',
  },
];

const PRIORITY_COLORS = {
  high: 'destructive',
  medium: 'warning',
  low: 'success',
};

function TaskItem({ task, onToggle }) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={() => onToggle(task.id)}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${task.is_completed ? 'text-foreground-muted line-through' : 'text-foreground'}`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {task.category}
          </Badge>
          <span className="text-xs text-foreground-muted flex items-center gap-1">
            <FiClock className="w-3 h-3" /> {task.due}
          </span>
        </div>
      </div>
      <Badge variant={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
      <button className="p-1 hover:bg-secondary rounded">
        <FiMoreVertical className="w-4 h-4 text-foreground-muted" />
      </button>
    </div>
  );
}

function Tasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed' && !task.is_completed) return false;
    if (filter === 'pending' && task.is_completed) return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => !t.is_completed).length,
    completed: tasks.filter((t) => t.is_completed).length,
  };

  if (loading) {
    return <LoadingOverlay message="Loading tasks..." />;
  }

  return (
    <PageContainer
      title="Tasks"
      subtitle="Manage your daily tasks and to-dos"
      actions={
        <Button>
          <FiPlus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      }
    >
      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <Card className="flex-1">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-foreground-muted">Total</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            <p className="text-sm text-foreground-muted">Pending</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-sm text-foreground-muted">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={FiCheck}
          title="No tasks found"
          description={
            search ? 'Try adjusting your search' : 'Create your first task to get started'
          }
          action={
            <Button>
              <FiPlus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}

export default Tasks;
