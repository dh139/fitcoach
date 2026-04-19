import { useState, useEffect } from 'react';
import { useNavigate }          from 'react-router-dom';
import { getWorkoutHistory, getWorkoutStats } from '../api/workout';
import { getXpHistory }         from '../api/xp';
import { getWeeklySummary }     from '../api/calories';
import PageHeader               from '../components/ui/PageHeader';
import StatCard                 from '../components/ui/StatCard';
import WorkoutFrequencyChart    from '../components/charts/WorkoutFrequencyChart';
import CalorieProgressChart     from '../components/charts/CalorieProgressChart';
import XpGrowthChart            from '../components/charts/XpGrowthChart';
import {
  Dumbbell, Flame, Clock, Zap,
  CheckCircle2, XCircle, ChevronRight, Loader2,
} from 'lucide-react';
import { formatTime }           from '../components/workout/WorkoutTimer';

function WorkoutItem({ workout, onClick }) {
  const date     = new Date(workout.startTime);
  const verified = workout.isVerified;

  return (
    <button
      onClick={() => onClick(workout)}
      className="w-full flex items-center gap-4 bg-dark-800 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all text-left group"
    >
      {/* Status icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        verified ? 'bg-green-500/20' : 'bg-red-500/20'
      }`}>
        {verified
          ? <CheckCircle2 className="w-5 h-5 text-green-400" />
          : <XCircle      className="w-5 h-5 text-red-400" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{workout.workoutName}</p>
        <p className="text-xs text-gray-500">
          {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          {' · '}{formatTime(workout.durationSeconds)}
          {' · '}{workout.totalExercises} exercises
        </p>
      </div>

      {/* Stats */}
      <div className="text-right flex-shrink-0 space-y-0.5">
        <p className="text-sm font-medium text-white">
          {verified ? `+${workout.xpEarned} XP` : '0 XP'}
        </p>
        <p className="text-xs text-gray-500">{workout.totalCaloriesBurned} kcal</p>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
    </button>
  );
}

export default function WorkoutHistoryPage() {
  const navigate = useNavigate();
  const [workouts,   setWorkouts]   = useState([]);
  const [stats,      setStats]      = useState(null);
  const [xpLogs,     setXpLogs]     = useState([]);
  const [calData,    setCalData]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(true);
  const [loadingMore,setLoadingMore]= useState(false);

  useEffect(() => {
    Promise.all([
      getWorkoutHistory({ page: 1, limit: 10 }),
      getWorkoutStats(),
      getXpHistory({ limit: 14 }),
      getWeeklySummary(),
    ]).then(([hist, s, xp, cal]) => {
      setWorkouts(hist.data);
      setHasMore(hist.pagination.page < hist.pagination.totalPages);
      setStats(s.data);
      setXpLogs(xp.data);
      setCalData(cal.data);
    }).finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    const next = page + 1;
    const data = await getWorkoutHistory({ page: next, limit: 10 });
    setWorkouts((prev) => [...prev, ...data.data]);
    setHasMore(data.pagination.page < data.pagination.totalPages);
    setPage(next);
    setLoadingMore(false);
  };

  // Build frequency data for chart
  const freqData = workouts.slice(0, 14).map((w) => ({
    date:    new Date(w.startTime).toISOString().slice(0, 10),
    minutes: Math.round(w.durationSeconds / 60),
    count:   1,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
      <PageHeader
        title="Workout history"
        subtitle="Your verified sessions and progress charts"
        action={
          <button
            onClick={() => navigate('/workout')}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            New workout
          </button>
        }
      />

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Dumbbell} iconColor="text-brand-500" iconBg="bg-brand-500/10"
            label="Total workouts"  value={stats.totalWorkouts} />
          <StatCard icon={Clock}    iconColor="text-blue-400"   iconBg="bg-blue-500/10"
            label="Minutes trained" value={stats.totalMinutesWorked.toLocaleString()} />
          <StatCard icon={Flame}    iconColor="text-orange-400" iconBg="bg-orange-500/10"
            label="Calories burned" value={stats.totalCaloriesBurned.toLocaleString()} />
          <StatCard icon={Zap}      iconColor="text-yellow-400" iconBg="bg-yellow-500/10"
            label="This week"       value={`${stats.weeklyWorkouts} sessions`} />
        </div>
      )}

      {/* Charts */}
      <div className="space-y-4 mb-6">
        {freqData.length > 0 && (
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
            <p className="text-sm font-medium text-white mb-4">Session duration</p>
            <WorkoutFrequencyChart data={freqData} />
          </div>
        )}

        {calData.length > 0 && (
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
            <p className="text-sm font-medium text-white mb-4">Calorie intake — last 7 days</p>
            <CalorieProgressChart data={calData} />
          </div>
        )}

        {xpLogs.length > 0 && (
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
            <p className="text-sm font-medium text-white mb-4">XP growth</p>
            <XpGrowthChart logs={xpLogs} />
          </div>
        )}
      </div>

      {/* Workout list */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white mb-3">All sessions</p>
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No workouts yet</p>
            <button onClick={() => navigate('/workout')}
              className="text-brand-500 text-sm mt-2 hover:underline">
              Start your first workout →
            </button>
          </div>
        ) : (
          workouts.map((w) => (
            <WorkoutItem key={w._id} workout={w} onClick={() => {}} />
          ))
        )}

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}