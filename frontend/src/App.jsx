import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/ToastContext';
import AppShell from './components/layout/AppShell';

// New imports added
import ErrorBoundary from './components/ui/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import ChallengesPage from './components/challenges/ChallengesPage';
import RivalsPage from './components/rivals/RivalsPage';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutPage from './pages/WorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import CaloriePage from './pages/CaloriePage';
import ReportsPage from './pages/ReportsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CoachPage from './pages/CoachPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';
import ProfilePage from './pages/ProfilePage';

// Guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login"    element={<PublicRoute><LoginPage    /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected Routes — Wrapped with AppShell */}
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path="/"            element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"   element={<DashboardPage      />} />
        <Route path="/workout"     element={<WorkoutPage         />} />
        <Route path="/exercises"   element={<ExercisesPage       />} />
        <Route path="/calories"    element={<CaloriePage         />} />
        <Route path="/reports"     element={<ReportsPage         />} />
        <Route path="/leaderboard" element={<LeaderboardPage     />} />
        <Route path="/coach"       element={<CoachPage           />} />
        <Route path="/history"     element={<WorkoutHistoryPage  />} />
        <Route path="/profile"     element={<ProfilePage         />} />

        {/* Newly Added Routes */}
        <Route path="/challenges"  element={<ChallengesPage />} />
        <Route path="/rivals"      element={<RivalsPage     />} />

        {/* 404 Not Found inside AppShell (shows sidebar + nav) */}
        <Route path="*"            element={<NotFoundPage />} />
      </Route>

      {/* Global Fallback (only if something goes wrong outside protected routes) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}