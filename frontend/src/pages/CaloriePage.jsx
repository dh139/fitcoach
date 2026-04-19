import { useState, useEffect, useCallback } from 'react';
import { Flame, Search, Camera, PenLine, Loader2, TrendingUp } from 'lucide-react';
import { getDayLog, logFood, getWeeklySummary } from '../api/calories';
import DailySummaryCard from '../components/calories/DailySummaryCard';
import FoodSearch       from '../components/calories/FoodSearch';
import PhotoAnalyzer    from '../components/calories/PhotoAnalyzer';
import ManualEntry      from '../components/calories/ManualEntry';
import FoodLogList      from '../components/calories/FoodLogList';

const INPUT_TABS = [
  { key: 'search', label: 'Search',  icon: Search },
  { key: 'photo',  label: 'Photo',   icon: Camera },
  { key: 'manual', label: 'Manual',  icon: PenLine },
];

const getMealForTime = () => {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 14) return 'lunch';
  if (h < 19) return 'dinner';
  return 'snack';
};

export default function CaloriePage() {
  const today = new Date().toISOString().slice(0, 10);

  const [date,         setDate]         = useState(today);
  const [activeTab,    setActiveTab]    = useState('search');
  const [dayLog,       setDayLog]       = useState({ entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }, byMeal: {} });
  const [weeklySummary,setWeeklySummary] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const loadDay = useCallback(async () => {
    setLoading(true);
    try {
      const [day, weekly] = await Promise.all([
        getDayLog(date),
        getWeeklySummary(),
      ]);
      setDayLog(day.data);
      setWeeklySummary(weekly.data || []);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { loadDay(); }, [loadDay]);

  const handleAdd = async (foodData) => {
    await logFood({ ...foodData, loggedDate: date });
    await loadDay();
  };

  const handleDelete = (deletedId) => {
    setDayLog((prev) => {
      const entries = prev.entries.filter((e) => e._id !== deletedId);
      const totals  = entries.reduce(
        (acc, e) => ({ calories: acc.calories + e.calories, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat, fiber: acc.fiber + e.fiber }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );
      const byMeal = { breakfast: [], lunch: [], dinner: [], snack: [] };
      entries.forEach((e) => byMeal[e.mealType]?.push(e));
      return { entries, totals, byMeal };
    });
  };

  // Weekly bar chart data
  const maxCal = Math.max(2000, ...weeklySummary.map((d) => d.calories));

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Calorie counter</h1>
            <p className="text-xs text-gray-500">Track food, macros, and daily intake</p>
          </div>
        </div>

        {/* Daily summary + date nav */}
        <div className="mb-4">
          <DailySummaryCard
            totals={dayLog.totals}
            date={date}
            onDateChange={setDate}
          />
        </div>

        {/* Weekly mini chart */}
        {weeklySummary.length > 0 && (
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <p className="text-sm font-medium text-white">7-day overview</p>
            </div>
            <div className="flex items-end gap-2 h-16">
              {weeklySummary.map((day) => {
                const heightPct = maxCal > 0 ? (day.calories / maxCal) * 100 : 0;
                const isToday   = day.date === today;
                const isSelected = day.date === date;
                const dayLabel  = new Date(day.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'narrow' });
                return (
                  <button
                    key={day.date}
                    onClick={() => setDate(day.date)}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isSelected ? 'bg-brand-500' : isToday ? 'bg-brand-500/40' : 'bg-dark-600 group-hover:bg-dark-500'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-brand-500' : 'text-gray-600'}`}>{dayLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input tabs */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex gap-1 p-1 bg-dark-900 rounded-xl mb-5">
            {INPUT_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'search' && (
            <FoodSearch onAdd={handleAdd} defaultMeal={getMealForTime()} />
          )}
          {activeTab === 'photo' && (
            <PhotoAnalyzer onAdd={handleAdd} defaultMeal={getMealForTime()} />
          )}
          {activeTab === 'manual' && (
            <ManualEntry onAdd={handleAdd} defaultMeal={getMealForTime()} />
          )}
        </div>

        {/* Food log */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            {date === today ? "Today's log" : `Log for ${date}`}
            {dayLog.entries.length > 0 && (
              <span className="text-gray-500 font-normal ml-2">({dayLog.entries.length} items)</span>
            )}
          </h2>
          {loading
            ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>
            : <FoodLogList byMeal={dayLog.byMeal} onDelete={handleDelete} />
          }
        </div>
      </div>
    </div>
  );
}