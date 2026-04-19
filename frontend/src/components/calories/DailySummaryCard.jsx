import MacroRing from './MacroRing';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';

function formatDate(dateStr) {
  const d     = new Date(dateStr + 'T00:00:00');
  const today = new Date().toISOString().slice(0, 10);
  const yest  = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === yest)  return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function DailySummaryCard({ totals, date, onDateChange, calorieGoal = 2000 }) {
  const goBack = () => {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().slice(0, 10));
  };
  const goForward = () => {
    const d     = new Date(date + 'T00:00:00');
    const today = new Date().toISOString().slice(0, 10);
    d.setDate(d.getDate() + 1);
    if (d.toISOString().slice(0, 10) <= today) {
      onDateChange(d.toISOString().slice(0, 10));
    }
  };
  const isToday = date === new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
      {/* Date nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-lg bg-dark-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{formatDate(date)}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <button
          onClick={goForward}
          disabled={isToday}
          className="w-8 h-8 rounded-lg bg-dark-700 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <MacroRing
        calories={totals.calories}
        goal={calorieGoal}
        protein={totals.protein}
        carbs={totals.carbs}
        fat={totals.fat}
      />

      {/* Fiber bonus */}
      {totals.fiber > 0 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Flame className="w-3 h-3 text-green-400" /> Fiber
          </span>
          <span className="text-xs text-white">{Math.round(totals.fiber)}g</span>
        </div>
      )}
    </div>
  );
}