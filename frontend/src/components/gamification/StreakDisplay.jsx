import { Flame, Snowflake, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStreakFreeze } from '../../api/xp';
import { useState } from 'react';

export default function StreakDisplay({
  streak, streakFreezes, daysInactive,
  nextMilestone, nextMilestoneBonus, decayWarning,
  onFreezeUsed,
}) {
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');

  const handleFreeze = async () => {
    if (streakFreezes <= 0 || loading) return;
    setLoading(true);
    try {
      const { data } = await import('../../api/xp').then(m => m.useStreakFreeze());
      setMsg('Streak freeze used — streak protected!');
      onFreezeUsed?.();
    } catch {
      setMsg('Failed to use freeze');
    } finally {
      setLoading(false);
    }
  };

  // Build the last 7 days display
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayNum = 7 - i;
    return dayNum <= streak;
  }).reverse();

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Current streak</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {streak} <span className="text-sm font-normal text-gray-500">day{streak !== 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {/* Streak freeze badge */}
        {streakFreezes > 0 && (
          <button
            onClick={handleFreeze}
            disabled={loading || daysInactive === 0}
            className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-blue-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Snowflake className="w-3.5 h-3.5" />
            {streakFreezes} freeze{streakFreezes !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* 7-day dots */}
      <div className="flex items-center gap-2 mb-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center transition-colors ${
              days[i]
                ? 'bg-orange-500/30 border border-orange-500/50'
                : 'bg-dark-900 border border-white/5'
            }`}>
              <Flame className={`w-3 h-3 ${days[i] ? 'text-orange-400' : 'text-gray-700'}`} />
            </div>
            <span className="text-xs text-gray-600">{d}</span>
          </div>
        ))}
      </div>

      {/* Decay warning */}
      {decayWarning && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400">
            XP decay active — work out to stop losing XP
          </p>
        </div>
      )}

      {/* Next milestone */}
      {nextMilestone && (
        <div className="flex items-center justify-between text-xs bg-dark-900 rounded-xl px-3 py-2">
          <span className="text-gray-500">Next milestone</span>
          <span className="text-white font-medium">
            {nextMilestone} days
            <span className="text-yellow-400 ml-1.5">+{nextMilestoneBonus?.xp} XP</span>
          </span>
        </div>
      )}

      {msg && <p className="text-xs text-green-400 mt-2 text-center">{msg}</p>}
    </div>
  );
}