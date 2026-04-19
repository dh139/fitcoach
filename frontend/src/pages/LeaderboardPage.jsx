import { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Info } from 'lucide-react';
import { useAuth }          from '../context/AuthContext';
import { getLeaderboard, getMyStats } from '../api/leaderboard';
import LeaderboardTabs  from '../components/leaderboard/LeaderboardTabs';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import MyRankCard       from '../components/leaderboard/MyRankCard';

function timeAgo(dateStr) {
  if (!dateStr) return 'never';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  return `${hours}h ago`;
}

export default function LeaderboardPage() {
  const { user }   = useAuth();
  const [period,   setPeriod]   = useState('weekly');
  const [entries,  setEntries]  = useState([]);
  const [myRank,   setMyRank]   = useState(null);
  const [myStats,  setMyStats]  = useState([]);
  const [builtAt,  setBuiltAt]  = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading,  setLoading]  = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const [lb, stats] = await Promise.all([
        getLeaderboard({ period, page: pg, limit: 50 }),
        pg === 1 ? getMyStats() : Promise.resolve(null),
      ]);
      setEntries(lb.data.entries || []);
      setMyRank(lb.data.myRank  || null);
      setBuiltAt(lb.data.builtAt);
      setPagination(lb.data.pagination || { page: 1, totalPages: 1, total: 0 });
      if (stats) setMyStats(stats.data || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load(1);
  };

  const handlePeriodChange = (p) => {
    setPeriod(p);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl font-bold text-white">Leaderboard</h1>
            </div>
            <p className="text-xs text-gray-500">
              Ranked by verified XP, consistency & improvement
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Anti-cheat notice */}
        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5 mb-5">
          <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">
            Rankings use only <span className="font-medium text-blue-200">verified workout XP</span> — sessions that passed anti-cheat validation. Fake completions are excluded.
          </p>
        </div>

        {/* My rank across all periods */}
        <MyRankCard myStats={myStats} />

        {/* Period tabs */}
        <div className="mb-5">
          <LeaderboardTabs active={period} onChange={handlePeriodChange} />
        </div>

        {/* Last updated */}
        {builtAt && (
          <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Updated {timeAgo(builtAt)} · refreshes hourly
          </p>
        )}

        {/* Score formula */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Verified XP',   pct: '50%', color: 'text-yellow-400' },
            { label: 'Consistency',   pct: '25%', color: 'text-teal-400' },
            { label: 'Improvement',   pct: '25%', color: 'text-purple-400' },
          ].map(({ label, pct, color }) => (
            <div key={label} className="bg-dark-800 border border-white/5 rounded-xl p-3 text-center">
              <p className={`text-base font-bold ${color}`}>{pct}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <LeaderboardTable
          entries={entries}
          myUserId={user?._id}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              disabled={pagination.page <= 1}
              onClick={() => load(pagination.page - 1)}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => load(pagination.page + 1)}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Total entries note */}
        {!loading && pagination.total > 0 && (
          <p className="text-center text-xs text-gray-600 mt-4">
            {pagination.total} athlete{pagination.total !== 1 ? 's' : ''} ranked {period === 'daily' ? 'today' : period === 'weekly' ? 'this week' : 'this month'}
          </p>
        )}
      </div>
    </div>
  );
}