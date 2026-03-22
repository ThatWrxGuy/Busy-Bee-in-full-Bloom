// Modern UI Dashboard — shadcn/ui style
// Drop-in replacement demonstrating the modern aesthetic

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Input } from './components/ui/input'
import { Skeleton } from './components/ui/skeleton'
import { Progress } from './components/ui/progress'

// Icons (using Lucide React - install separately)
const icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Grid: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  RefreshCw: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOMAIN_META = {
  health:        { color: 'green',  emoji: '🏃' },
  career:        { color: 'blue',   emoji: '💼' },
  mindset:       { color: 'purple', emoji: '🧠' },
  habits:        { color: 'orange', emoji: '🔄' },
  relationships: { color: 'pink',   emoji: '👥' },
  finance:       { color: 'yellow', emoji: '💰' },
}

function greeting(name) {
  const h = new Date().getHours()
  const time = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  const first = name?.split(' ')[0] || 'there'
  return `Good ${time}, ${first} 👋`
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, helpText, trend, loading }) {
  if (loading) return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon />
          </div>
          {trend != null && (
            <span className={`text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {helpText && <p className="text-xs text-muted-foreground mt-1">{helpText}</p>}
      </CardContent>
    </Card>
  )
}

function GoalCard({ goal }) {
  const statusVariant = { active: 'success', completed: 'info', paused: 'secondary' }
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium truncate flex-1">{goal.title}</span>
          <Badge variant={statusVariant[goal.status] || 'outline'}>{goal.status}</Badge>
        </div>
        <Progress value={goal.progress} className="mb-2 h-1.5" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{goal.progress}% complete</span>
          {goal.category && <Badge variant="outline" className="text-xs">{goal.category}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

function TaskItem({ task, onToggle }) {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary/30 cursor-pointer transition-colors"
      onClick={() => onToggle(task.id)}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.is_completed ? 'bg-green-500 border-green-500' : 'border-input'
        }`}
      >
        {task.is_completed && <CheckIcon />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        {task.due_date && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ClockIcon /> {task.due_date}
          </p>
        )}
      </div>
      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'warning' : 'outline'} className="flex-shrink-0">
        {task.priority}
      </Badge>
    </div>
  )
}

// Simple icon components
function CheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}

function ClockIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

function TrendingUpIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}

function ZapIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
}

function PlusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

function GridIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
}

function RefreshCwIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
}

function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}

function RecommendationCard({ rec, onComplete }) {
  const priorityVariant = { high: 'destructive', medium: 'warning', low: 'outline' }
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <Badge variant={priorityVariant[rec.priority] || 'outline'}>{rec.priority}</Badge>
          {!rec.is_completed && (
            <Button size="sm" variant="outline" onClick={() => onComplete(rec.id)}>
              <CheckIcon /> Done
            </Button>
          )}
        </div>
        <p className="font-semibold text-sm mb-1">{rec.title}</p>
        <p className="text-xs text-muted-foreground">{rec.description}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link to={to} className="no-underline">
      <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon />
        </div>
        <span className="text-xs font-medium text-center">{label}</span>
      </div>
    </Link>
  )
}

// ─── Domain Scores Widget ──────────────────────────────────────────────────────

function DomainScoresWidget({ loading }) {
  const [progress, setProgress] = useState({})
  const [widgetLoading, setWidgetLoading] = useState(true)

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setProgress({
        health: { completion_rate: 75, current_streak: 12 },
        career: { completion_rate: 60, current_streak: 5 },
        mindset: { completion_rate: 85, current_streak: 21 },
        habits: { completion_rate: 45, current_streak: 3 },
        relationships: { completion_rate: 70, current_streak: 8 },
        finance: { completion_rate: 55, current_streak: 0 },
      })
      setWidgetLoading(false)
    }, 500)
  }, [])

  const isLoading = loading || widgetLoading
  const domainOrder = ['health', 'career', 'mindset', 'habits', 'relationships', 'finance']

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <GridIcon />
            </div>
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Life Domains
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/domains">
              View all <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[0,1,2,3,4,5].map(i => <Skeleton key={i} className="h-7 w-full" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {domainOrder.map(id => {
              const meta = DOMAIN_META[id]
              const p = progress[id]
              const rate = p?.completion_rate || 0
              const streak = p?.current_streak || 0
              
              return (
                <div key={id} className="cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{meta.emoji}</span>
                      <span className="text-sm font-medium capitalize">{id}</span>
                      {streak >= 7 && (
                        <Badge variant="warning" className="text-xs">🔥 {streak}d</Badge>
                      )}
                    </div>
                    <span className="text-xs font-bold">{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-1.5" />
                </div>
              )
            })}

            {/* Today's check-in summary */}
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {Object.values(progress).filter(p => (p?.current_streak || 0) > 0).length} domains active this week
              </span>
              <Button size="sm" variant="outline" asChild>
                <Link to="/domains">Check In</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

function ModernDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => { loadDashboard() }, [])

  const loadDashboard = async () => {
    setLoading(true)
    // Simulated API call
    setTimeout(() => {
      setData({
        overview: {
          active_goals: 8,
          completed_goals: 24,
          pending_recommendations: 5,
          streak_days: 12,
        },
        goals: [
          { id: 1, title: 'Run 5K three times a week', progress: 75, status: 'active', category: 'Health' },
          { id: 2, title: 'Read 12 books this year', progress: 45, status: 'active', category: 'Mindset' },
          { id: 3, title: 'Save $10,000 for emergency fund', progress: 60, status: 'active', category: 'Finance' },
        ],
        top_recommendations: [
          { id: 1, title: 'Morning meditation session', due_date: 'Today', priority: 'high', is_completed: false },
          { id: 2, title: 'Review investment portfolio', due_date: 'Tomorrow', priority: 'medium', is_completed: false },
          { id: 3, title: 'Schedule weekly call with mentor', due_date: 'Fri', priority: 'low', is_completed: false },
          { id: 4, title: 'Update LinkedIn profile', due_date: 'Sat', priority: 'medium', is_completed: true },
        ],
        recent_activity: [
          { id: 1, title: 'Complete daily workout', description: 'Great job on your 5K run!', priority: 'high' },
          { id: 2, title: 'Weekly finance review', description: 'You are on track to meet your savings goal', priority: 'medium' },
        ],
      })
      setLoading(false)
    }, 800)
  }

  const handleToggleTask = async (taskId) => {
    console.log('Toggle task:', taskId)
    loadDashboard()
  }

  const handleCompleteRec = async (recId) => {
    console.log('Complete recommendation:', recId)
    loadDashboard()
  }

  const overview = data?.overview || {}
  const goals = data?.goals || []
  const tasks = data?.top_recommendations || []
  const recs = data?.recent_activity || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold">{greeting('John')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={loadDashboard} disabled={loading}>
            <RefreshCwIcon />
          </Button>
          <Button asChild>
            <Link to="/goals"><PlusIcon /> New Goal</Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard loading={loading} icon={TrendingUpIcon} label="Active Goals" value={overview.active_goals || 0} />
        <StatCard loading={loading} icon={CheckIcon} label="Completed" value={overview.completed_goals || 0} />
        <StatCard loading={loading} icon={ClockIcon} label="Pending" value={overview.pending_recommendations || 0} helpText="Recommendations" />
        <StatCard loading={loading} icon={ZapIcon} label="Streak" value={`${overview.streak_days || 0}d`} trend={12} />
      </div>

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Active Goals</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/goals">View all <ArrowRightIcon /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {goals.slice(0, 3).map(goal => <GoalCard key={goal.id} goal={goal} />)}
                  {goals.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-2xl mb-2">🎯</p>
                      <p className="text-muted-foreground">No goals yet.</p>
                      <Button size="sm" asChild className="mt-2">
                        <Link to="/goals"><PlusIcon /> Create your first goal</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/tasks">View all <ArrowRightIcon /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 4).map(task => (
                    <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No tasks yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right col - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-0"><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <QuickAction icon={PlusIcon} label="New Goal" to="/goals" />
                <QuickAction icon={CheckIcon} label="Tasks" to="/tasks" />
                <QuickAction icon={GridIcon} label="Domains" to="/domains" />
                <QuickAction icon={TrendingUpIcon} label="Analytics" to="/my-analytics" />
                <QuickAction icon={ZapIcon} label="Finance" to="/finance" />
                <QuickAction icon={ClockIcon} label="Help" to="/help" />
              </div>
            </CardContent>
          </Card>

          {/* Domain Scores — new widget */}
          <DomainScoresWidget loading={loading} />

          {/* AI Recommendations */}
          {recs.length > 0 && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recs.slice(0, 3).map(rec => (
                    <RecommendationCard key={rec.id} rec={rec} onComplete={handleCompleteRec} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard
