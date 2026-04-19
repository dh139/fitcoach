import { useEffect } from 'react';
import { Star, X, ChevronRight } from 'lucide-react';
import LevelBadge from './LevelBadge';

const LEVEL_MESSAGES = {
  intermediate: "You're getting serious — keep pushing!",
  advanced:     "You're in elite territory now. Respect.",
  elite:        "You've reached the top. Absolute legend.",
};

export default function LevelUpModal({ previousLevel, newLevel, bonusXP = 200, onClose }) {
  // Auto-close after 8s
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      {/* Particle burst background effect using CSS */}
      <style>{`
        @keyframes pop { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .level-card { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .shimmer    { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      <div className="level-card bg-dark-800 border border-white/10 rounded-3xl p-8 w-full max-w-sm text-center relative overflow-hidden">
        {/* Decorative glow rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full border border-yellow-500/10 shimmer" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-yellow-500/10 shimmer" style={{ animationDelay: '0.3s' }} />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Star icon */}
        <div className="w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-5 relative z-10">
          <Star className="w-10 h-10 text-yellow-400" fill="currentColor" />
        </div>

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 relative z-10">Level up!</p>
        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
          You reached<br />
          <span className="text-yellow-400">{newLevel.charAt(0).toUpperCase() + newLevel.slice(1)}</span>
        </h2>

        {/* Level transition */}
        <div className="flex items-center justify-center gap-3 mb-4 relative z-10">
          <LevelBadge level={previousLevel} size="sm" />
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <LevelBadge level={newLevel} size="sm" />
        </div>

        <p className="text-sm text-gray-400 mb-5 relative z-10">
          {LEVEL_MESSAGES[newLevel] || 'Keep up the amazing work!'}
        </p>

        {/* Bonus XP pill */}
        <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium px-4 py-2 rounded-full mb-6 relative z-10">
          <Star className="w-3.5 h-3.5" />
          +{bonusXP} bonus XP awarded
        </div>

        <button
          onClick={onClose}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition-colors relative z-10"
        >
          Keep training
        </button>
      </div>
    </div>
  );
}