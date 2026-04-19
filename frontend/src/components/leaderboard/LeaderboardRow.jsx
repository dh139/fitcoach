import { Flame, Zap, Star } from 'lucide-react';
import LevelBadge from '../gamification/LevelBadge';

const RANK_STYLES = {
  1: { bg: 'bg-amber-500/10 border-amber-500/30',  num: 'text-amber-400',  crown: '🥇' },
  2: { bg: 'bg-gray-400/10 border-gray-400/20',    num: 'text-gray-300',   crown: '🥈' },
  3: { bg: 'bg-orange-600/10 border-orange-600/20',num: 'text-orange-500', crown: '🥉' },
};

export default function LeaderboardRow({ entry, isMe }) {
  const rankStyle = RANK_STYLES[entry.rank];
  const isTop3    = entry.rank <= 3;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
      isMe
        ? 'bg-brand-500/10 border-brand-500/40'
        : isTop3
        ? `${rankStyle.bg}`
        : 'bg-dark-800 border-white/5 hover:border-white/10'
    }`}>

      {/* Rank */}
      <div className={`w-8 text-center flex-shrink-0 font-bold text-sm ${
        isTop3 ? rankStyle.num : 'text-gray-600'
      }`}>
        {isTop3 ? rankStyle.crown : `#${entry.rank}`}
      </div>

      {/* Avatar / initials */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
        isMe ? 'bg-brand-500 text-white' : 'bg-dark-700 text-gray-400'
      }`}>
        {entry.avatar
          ? <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
          : entry.name?.slice(0, 2).toUpperCase()
        }
      </div>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate ${isMe ? 'text-brand-400' : 'text-white'}`}>
            {entry.name} {isMe && <span className="text-xs text-brand-500">(you)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <LevelBadge level={entry.level} size="sm" />
          {entry.streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-orange-400">
              <Flame className="w-3 h-3" />
              {entry.streak}d
            </span>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Consistency */}
        <div className="hidden sm:flex flex-col items-center">
          <span className="text-xs text-white font-medium">{entry.consistencyScore}</span>
          <span className="text-xs text-gray-600">consistency</span>
        </div>

        {/* XP */}
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="flex items-center gap-0.5 text-sm font-bold text-yellow-400">
            <Zap className="w-3 h-3" />
            {entry.verifiedXP.toLocaleString()}
          </span>
          <span className="text-xs text-gray-600">XP</span>
        </div>

        {/* Total score pill */}
        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
          isTop3 ? 'bg-dark-700' : 'bg-dark-900'
        }`}>
          <span className="text-sm font-bold text-white">{entry.totalScore}</span>
          <span className="text-xs text-gray-600">score</span>
        </div>
      </div>
    </div>
  );
}