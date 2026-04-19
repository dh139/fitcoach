import { useState } from 'react';
import { Zap, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import api from '../../api/axiosInstance';

const DIFFICULTY_STYLES = {
  easy:   { badge: 'bg-green-500/20  text-green-400  border-green-500/30',  bar: '#22c55e' },
  medium: { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', bar: '#eab308' },
  hard:   { badge: 'bg-red-500/20    text-red-400    border-red-500/30',    bar: '#ef4444' },
};

const TYPE_LABELS = { daily: 'Today', weekly: 'This week' };

export default function ChallengeCard({ challenge, onClaim }) {
  const [claiming, setClaiming] = useState(false);
  const [claimed,  setClaimed]  = useState(challenge.completed);
  const styles = DIFFICULTY_STYLES[challenge.difficulty] || DIFFICULTY_STYLES.medium;
  const canClaim = challenge.progressPct >= 100 && !claimed;

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const { data } = await api.post(`/challenges/${challenge._id}/claim`);
      setClaimed(true);
      onClaim?.(data);
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className={`bg-dark-800 border rounded-2xl p-4 transition-all ${
      claimed ? 'border-brand-500/30 bg-brand-500/5' : 'border-white/10'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {challenge.difficulty}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {TYPE_LABELS[challenge.type] || challenge.type}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">{challenge.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{challenge.description}</p>
        </div>

        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0 bg-yellow-500/10 px-2 py-1 rounded-xl">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">+{challenge.xpReward}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">
            {challenge.progress}/{challenge.target?.value} {challenge.target?.metric}
          </span>
          <span className="text-white font-medium">{challenge.progressPct}%</span>
        </div>
        <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${challenge.progressPct}%`, background: styles.bar }}
          />
        </div>
      </div>

      {/* Claim button */}
      {claimed ? (
        <div className="flex items-center gap-2 text-brand-400 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Completed! XP awarded
        </div>
      ) : (
        <button
          onClick={handleClaim}
          disabled={!canClaim || claiming}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            canClaim
              ? 'bg-brand-500 hover:bg-brand-600 text-white'
              : 'bg-dark-700 text-gray-600 cursor-not-allowed'
          }`}
        >
          {claiming
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</>
            : canClaim ? 'Claim reward' : 'Keep going...'
          }
        </button>
      )}
    </div>
  );
}