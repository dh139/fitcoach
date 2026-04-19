import {
  Star, TrendingUp, TrendingDown, Zap, Target,
  Utensils, Dumbbell, AlertTriangle, MessageSquare,
  RefreshCw, Loader2,
} from 'lucide-react';
import ReportSection from './ReportSection';
import WeeklyChart   from './WeeklyChart';

function ScoreMeter({ value, label, color }) {
  const clamp = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-4">
      <div className="flex items-end justify-between mb-2">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-white tabular-nums">{clamp}</p>
      </div>
      <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${clamp}%`,
            background: color,
          }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5">
        {clamp >= 80 ? 'Excellent' : clamp >= 60 ? 'Good' : clamp >= 40 ? 'Fair' : 'Needs work'}
      </p>
    </div>
  );
}

export default function ReportCard({ report, context, generatedAt, onRefresh, refreshing }) {
  const r = report;
  if (!r) return null;

  const timeAgo = generatedAt
    ? (() => {
        const diff  = Date.now() - new Date(generatedAt).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        if (mins < 1)   return 'just now';
        if (mins < 60)  return `${mins}m ago`;
        return `${hours}h ago`;
      })()
    : '';

  return (
    <div className="space-y-4">
      {/* Score meters */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreMeter
          value={r.overallScore}
          label="Overall score"
          color="linear-gradient(90deg, #a855f7, #3b82f6)"
        />
        <ScoreMeter
          value={r.consistencyScore}
          label="Consistency"
          color="linear-gradient(90deg, #22c55e, #16a34a)"
        />
      </div>

      {/* Context stats strip */}
      {context && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Workouts',  value: context.workouts?.total || 0 },
            { label: 'Minutes',   value: context.workouts?.totalMinutes || 0 },
            { label: 'Cal burned',value: context.workouts?.totalCaloriesBurned || 0 },
            { label: 'XP earned', value: context.xp?.earned || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-dark-800 border border-white/5 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-white tabular-nums">{value.toLocaleString()}</p>
              <p className="text-xs text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Motivation message */}
      {r.motivationMessage && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 flex gap-3">
          <MessageSquare className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-300 italic leading-relaxed">
            "{r.motivationMessage}"
          </p>
        </div>
      )}

      {/* Summary */}
      {r.summary && (
        <ReportSection title="Summary" icon={Star} iconColor="bg-yellow-500/20 text-yellow-400">
          {r.summary}
        </ReportSection>
      )}

      {/* Plateau warning */}
      {r.plateauWarning && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-300 mb-1">Plateau detected</p>
            <p className="text-sm text-yellow-400/80">{r.plateauWarning}</p>
          </div>
        </div>
      )}

      {/* Highlights */}
      <ReportSection
        title="Highlights"
        icon={TrendingUp}
        iconColor="bg-green-500/20 text-green-400"
        items={r.highlights || []}
        type="highlight"
      />

      {/* Workout feedback */}
      {r.workoutFeedback && (
        <ReportSection title="Workout analysis" icon={Dumbbell} iconColor="bg-blue-500/20 text-blue-400">
          {r.workoutFeedback}
        </ReportSection>
      )}

      {/* Diet feedback */}
      {r.dietFeedback && (
        <ReportSection title="Nutrition feedback" icon={Utensils} iconColor="bg-orange-500/20 text-orange-400">
          {r.dietFeedback}
        </ReportSection>
      )}

      {/* Session chart */}
      {context?.workouts?.sessions?.length > 0 && (
        <WeeklyChart sessions={context.workouts.sessions} />
      )}

      {/* Improvements */}
      <ReportSection
        title="Areas to improve"
        icon={TrendingDown}
        iconColor="bg-yellow-500/20 text-yellow-400"
        items={r.improvements || []}
        type="improvement"
      />

      {/* Next steps */}
      <ReportSection
        title="Recommended actions"
        icon={Target}
        iconColor="bg-purple-500/20 text-purple-400"
        items={r.nextSteps || []}
        type="action"
      />

      {/* Footer — regenerate */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-600">
          Generated {timeAgo}
        </p>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl"
        >
          {refreshing
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating...</>
            : <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
          }
        </button>
      </div>
    </div>
  );
}