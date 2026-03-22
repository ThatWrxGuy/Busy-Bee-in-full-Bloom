import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';

// Lazy load all pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Finance = lazy(() => import('./pages/Finance'));
const Admin = lazy(() => import('./pages/Admin'));
const Analytics = lazy(() => import('./pages/Analytics'));
const UserAnalytics = lazy(() => import('./pages/UserAnalytics'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Demo = lazy(() => import('./pages/Demo'));
const Goals = lazy(() => import('./pages/Goals'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Help = lazy(() => import('./pages/Help'));
const Domains = lazy(() => import('./pages/Domains'));
const ExecutiveBrief = lazy(() => import('./pages/ExecutiveBrief'));
const TreeOfLife = lazy(() => import('./pages/TreeOfLife'));
const Metatron = lazy(() => import('./pages/Metatron'));
const Health = lazy(() => import('./pages/Health'));
const Career = lazy(() => import('./pages/Career'));
const Mindset = lazy(() => import('./pages/Mindset'));
const Habits = lazy(() => import('./pages/Habits'));
const Relationships = lazy(() => import('./pages/Relationships'));
const Education = lazy(() => import('./pages/Education'));
const Spirituality = lazy(() => import('./pages/Spirituality'));
const Family = lazy(() => import('./pages/Family'));
const Recreation = lazy(() => import('./pages/Recreation'));
const Travel = lazy(() => import('./pages/Travel'));
const Gamification = lazy(() => import('./pages/Gamification'));

// Design System Layout
import { Layout } from './components';

// Design System Loading State
import { LoadingOverlay } from './components';

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingOverlay message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingOverlay fullScreen message="Loading Busy Bee..." />;
  }

  return (
    <Suspense fallback={<LoadingOverlay fullScreen message="Loading page..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected routes with Design System Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="finance"
            element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Admin routes - protected, not shown in sidebar */}
          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute requireAdmin>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-analytics"
            element={
              <ProtectedRoute>
                <UserAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="domains"
            element={
              <ProtectedRoute>
                <Domains />
              </ProtectedRoute>
            }
          />
          <Route
            path="briefs"
            element={
              <ProtectedRoute>
                <ExecutiveBrief />
              </ProtectedRoute>
            }
          />
          <Route
            path="tree"
            element={
              <ProtectedRoute>
                <TreeOfLife />
              </ProtectedRoute>
            }
          />
          <Route
            path="metatron"
            element={
              <ProtectedRoute>
                <Metatron />
              </ProtectedRoute>
            }
          />
          <Route
            path="goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="health"
            element={
              <ProtectedRoute>
                <Health />
              </ProtectedRoute>
            }
          />
          <Route
            path="career"
            element={
              <ProtectedRoute>
                <Career />
              </ProtectedRoute>
            }
          />
          <Route
            path="mindset"
            element={
              <ProtectedRoute>
                <Mindset />
              </ProtectedRoute>
            }
          />
          <Route
            path="habits"
            element={
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            }
          />
          <Route
            path="relationships"
            element={
              <ProtectedRoute>
                <Relationships />
              </ProtectedRoute>
            }
          />
          <Route
            path="education"
            element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            }
          />
          <Route
            path="spirituality"
            element={
              <ProtectedRoute>
                <Spirituality />
              </ProtectedRoute>
            }
          />
          <Route
            path="family"
            element={
              <ProtectedRoute>
                <Family />
              </ProtectedRoute>
            }
          />
          <Route
            path="recreation"
            element={
              <ProtectedRoute>
                <Recreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="travel"
            element={
              <ProtectedRoute>
                <Travel />
              </ProtectedRoute>
            }
          />
          <Route
            path="gamification"
            element={
              <ProtectedRoute>
                <Gamification />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
