import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Dumbbell } from 'lucide-react';
import LevelBadge from '../gamification/LevelBadge';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard':   'Dashboard',
  '/workout':     'Workout',
  '/exercises':   'Exercises',
  '/calories':    'Calories',
  '/reports':     'AI Reports',
  '/leaderboard': 'Leaderboard',
  '/coach':       'AI Coach',
  '/profile':     'Profile',
  '/history':     'Workout history',
};

export default function TopBar() {
  const { user }   = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();
  const title      = PAGE_TITLES[location.pathname] || 'FitCoach AI';
  const canGoBack  = location.pathname !== '/dashboard';

  return (
    <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-dark-800/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 pt-safe">
      {canGoBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Dumbbell className="w-4 h-4 text-white" />
        </div>
      )}

      <h1 className="text-sm font-semibold text-white flex-1">{title}</h1>

      {user && (
        <div className="flex items-center gap-2">
          <LevelBadge level={user.level || 'beginner'} size="sm" />
        </div>
      )}
    </header>
  );
}