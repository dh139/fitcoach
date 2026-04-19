import LeaderboardRow from './LeaderboardRow';
import { Trophy, Loader2 } from 'lucide-react';

export default function LeaderboardTable({ entries, myUserId, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div className="text-center py-20">
        <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No ranked users yet for this period.</p>
        <p className="text-gray-600 text-xs mt-1">Complete a verified workout to appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Score legend */}
      <div className="flex items-center justify-end gap-4 px-3 pb-1">
        <span className="text-xs text-gray-600 hidden sm:block">consistency</span>
        <span className="text-xs text-gray-600 w-[52px] text-center">XP</span>
        <span className="text-xs text-gray-600 w-12 text-center">score</span>
      </div>

      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.rank}
          entry={entry}
          isMe={entry.user?.toString() === myUserId || entry.userId === myUserId}
        />
      ))}
    </div>
  );
}