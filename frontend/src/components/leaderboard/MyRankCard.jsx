import { Trophy, TrendingUp, Zap, Target } from 'lucide-react';

const PERIOD_LABELS = { daily: 'today', weekly: 'this week', monthly: 'this month' };

export default function MyRankCard({ myStats }) {
  if (!myStats?.length) return null;

  return (
    <div className="bg-dark-800 border border-brand-500/20 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-medium text-white">Your rankings</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {myStats.map(({ period, rank, totalUsers, entry }) => (
          <div key={period} className="bg-dark-900 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 capitalize mb-1">{PERIOD_LABELS[period]}</p>
            <p className="text-xl font-bold text-white">
              {rank ? `#${rank}` : '—'}
            </p>
            {totalUsers > 0 && (
              <p className="text-xs text-gray-600">of {totalUsers}</p>
            )}
            {entry && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
                  <Zap className="w-2.5 h-2.5" />
                  {entry.verifiedXP} XP
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-teal-400">
                  <Target className="w-2.5 h-2.5" />
                  {entry.consistencyScore}% consistency
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}