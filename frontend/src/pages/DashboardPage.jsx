import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getXpProfile, getXpHistory } from '../api/xp';
import { getWorkoutStats } from '../api/workout';
import XpBar from '../components/gamification/XpBar';
import StreakDisplay from '../components/gamification/StreakDisplay';
import LevelBadge from '../components/gamification/LevelBadge';
import LevelUpModal from '../components/gamification/LevelUpModal';
import XpHistoryList from '../components/gamification/XpHistoryList';
import { History, User } from 'lucide-react';
import {
  Dumbbell, LogOut, Loader2, Flame, Clock,
  Trophy, BarChart2, ChevronRight, Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [xpData, setXpData] = useState(null);
  const [xpHistory, setXpHistory] = useState([]);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUpInfo, setLevelUpInfo] = useState(null);

  useEffect(() => {
    Promise.all([
      getXpProfile(),
      getXpHistory({ limit: 8 }),
      getWorkoutStats(),
    ]).then(([xp, hist, stats]) => {
      setXpData(xp.data);
      setXpHistory(hist.data);
      setWorkoutStats(stats.data);
    }).finally(() => setLoading(false));

    const lvl = sessionStorage.getItem('levelUp');
    if (lvl) {
      setLevelUpInfo(JSON.parse(lvl));
      sessionStorage.removeItem('levelUp');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-4xl mx-auto px-5 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-zinc-400 text-sm">Welcome back,</p>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
              {user?.name || 'Athlete'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {xpData && <LevelBadge level={xpData.level} size="md" />}
            <button
              onClick={logout}
              className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* XP Bar */}
        {xpData && (
          <div className="mb-8">
            <XpBar 
              xp={xpData.xp} 
              level={xpData.level} 
              progress={xpData.progress} 
            />
          </div>
        )}

        {/* Streak */}
        {xpData && (
          <div className="mb-10">
            <StreakDisplay
              streak={xpData.streak}
              streakFreezes={xpData.streakFreezes}
              daysInactive={xpData.daysInactive}
              nextMilestone={xpData.nextStreakMilestone}
              nextMilestoneBonus={xpData.nextStreakMilestoneXP}
              decayWarning={xpData.decayWarning}
              onFreezeUsed={() => getXpProfile().then(r => setXpData(r.data))}
            />
          </div>
        )}

        {/* Quick Stats - Bigger & More Modern */}
        {workoutStats && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4 px-1">Your Stats</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  icon: Dumbbell, 
                  color: 'text-emerald-500', 
                  bg: 'bg-emerald-500/10', 
                  label: 'Total Workouts', 
                  value: workoutStats.totalWorkouts 
                },
                { 
                  icon: Flame,    
                  color: 'text-orange-400', 
                  bg: 'bg-orange-500/10', 
                  label: 'Calories Burned', 
                  value: `${workoutStats.totalCaloriesBurned.toLocaleString()} kcal` 
                },
                { 
                  icon: Clock,    
                  color: 'text-blue-400', 
                  bg: 'bg-blue-500/10', 
                  label: 'Minutes Trained', 
                  value: `${workoutStats.totalMinutesWorked} min` 
                },
                { 
                  icon: Zap,      
                  color: 'text-yellow-400', 
                  bg: 'bg-yellow-500/10', 
                  label: 'This Week', 
                  value: `${workoutStats.weeklyWorkouts} workouts` 
                },
              ].map(({ icon: Icon, color, bg, label, value }) => (
                <div 
                  key={label} 
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1 tracking-tighter">{value}</p>
                  <p className="text-zinc-400 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4 px-1">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/workout',     icon: Dumbbell,   label: 'Start Workout',    sub: 'Begin training • Earn XP',     color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { to: '/exercises',   icon: BarChart2,  label: 'Exercise Library', sub: 'Browse all exercises',         color: 'text-purple-400',  bg: 'bg-purple-500/10' },
              { to: '/leaderboard', icon: Trophy,     label: 'Leaderboard',      sub: 'See where you rank',           color: 'text-amber-400',   bg: 'bg-amber-500/10' },
              { to: '/reports',     icon: BarChart2,  label: 'AI Reports',       sub: 'Weekly insights & progress',   color: 'text-teal-400',    bg: 'bg-teal-500/10' },
              { to: '/calories',    icon: Flame,      label: 'Calorie Counter',  sub: 'Track macros & food',          color: 'text-orange-400',  bg: 'bg-orange-500/10' },
              { to: '/coach',       icon: Zap,        label: 'AI Coach',         sub: 'Get personalized advice',      color: 'text-sky-400',     bg: 'bg-sky-500/10' },
              { to: '/history', icon: History, label: 'Workout history', sub: 'Sessions + charts', color: 'text-blue-400', bg: 'bg-blue-500/10' },
{ to: '/profile', icon: User,    label: 'Profile',         sub: 'Edit your details', color: 'text-gray-400', bg: 'bg-gray-500/10' },
            ].map(({ to, icon: Icon, label, sub, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-6 transition-all hover:-translate-y-1 flex items-start gap-5"
              >
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors">{label}</p>
                  <p className="text-zinc-400 text-sm mt-1">{sub}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 ml-auto mt-1.5 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent XP Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent XP Activity</h2>
            <Link 
              to="/xp-history" 
              className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <XpHistoryList logs={xpHistory} />
        </div>
      </div>

      {/* Level-up Modal */}
      {levelUpInfo && (
        <LevelUpModal
          previousLevel={levelUpInfo.previousLevel}
          newLevel={levelUpInfo.newLevel}
          bonusXP={200}
          onClose={() => setLevelUpInfo(null)}
        />
      )}
    </div>
  );
}