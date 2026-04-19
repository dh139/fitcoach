import { Zap, Flame, TrendingDown, Star, ArrowUpRight } from 'lucide-react';

const SOURCE_CONFIG = {
  workout_complete: { icon: Zap,          color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Workout' },
  streak_bonus:     { icon: Flame,        color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Streak bonus' },
  comeback_bonus:   { icon: ArrowUpRight, color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Comeback' },
  level_up_bonus:   { icon: Star,         color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Level up' },
  xp_decay:         { icon: TrendingDown, color: 'text-red-400',    bg: 'bg-red-500/10',    label: 'Decay' },
  manual:           { icon: Zap,          color: 'text-gray-400',   bg: 'bg-gray-500/10',   label: 'Manual' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function XpHistoryList({ logs }) {
  if (!logs?.length) {
    return (
      <div className="text-center py-8">
        <Zap className="w-8 h-8 text-gray-700 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No XP history yet — complete a workout!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        const cfg = SOURCE_CONFIG[log.source] || SOURCE_CONFIG.manual;
        const Icon = cfg.icon;
        const positive = log.amount > 0;

        return (
          <div key={log._id} className="flex items-center gap-3 bg-dark-800 border border-white/5 rounded-xl p-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{cfg.label}</p>
              <p className="text-xs text-gray-500">{timeAgo(log.createdAt)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-bold tabular-nums ${positive ? 'text-green-400' : 'text-red-400'}`}>
                {positive ? '+' : ''}{log.amount} XP
              </p>
              <p className="text-xs text-gray-600">{log.balanceAfter.toLocaleString()} total</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}