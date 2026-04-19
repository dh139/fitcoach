import { useState, useEffect } from 'react';
import { Search, Plus, X, Dumbbell, ChevronRight, Loader2 } from 'lucide-react';
import { fetchExercises } from '../../api/exercises';

export default function WorkoutSetup({ onStart }) {
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [search,      setSearch]      = useState('');
  const [results,     setResults]     = useState([]);
  const [selected,    setSelected]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [starting,    setStarting]    = useState(false);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchExercises({ search, limit: 8 });
        setResults(data.data);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const toggle = (ex) => {
    setSelected((prev) =>
      prev.find((e) => e._id === ex._id)
        ? prev.filter((e) => e._id !== ex._id)
        : [...prev, ex]
    );
  };

  const handleStart = async () => {
    if (selected.length === 0) return;
    setStarting(true);
    try {
      await onStart({ workoutName, exercises: selected });
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white p-4 max-w-2xl mx-auto">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">New workout</h1>
        <p className="text-gray-400 text-sm">Add exercises to get started</p>
      </div>

      {/* Workout name */}
      <div className="mb-6">
        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Workout name</label>
        <input
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Search exercises */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Add exercises</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, muscle, equipment..."
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Search results */}
        {(results.length > 0 || loading) && (
          <div className="mt-2 bg-dark-800 border border-white/10 rounded-xl overflow-hidden">
            {loading && (
              <div className="flex items-center gap-2 p-3 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Searching...
              </div>
            )}
            {results.map((ex) => {
              const isAdded = selected.find((e) => e._id === ex._id);
              return (
                <button
                  key={ex._id}
                  onClick={() => toggle(ex)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-dark-700 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-900 overflow-hidden flex-shrink-0">
                    {ex.gifUrl
                      ? <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Dumbbell className="w-4 h-4 text-gray-600" /></div>
                    }
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm text-white capitalize truncate">{ex.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{ex.bodyPart} · {ex.equipment}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isAdded ? 'bg-brand-500 text-white' : 'bg-dark-600 text-gray-400'
                  }`}>
                    {isAdded ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected exercises */}
      {selected.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            Selected ({selected.length})
          </label>
          <div className="space-y-2">
            {selected.map((ex) => (
              <div key={ex._id} className="flex items-center gap-3 bg-dark-800 border border-white/10 rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-dark-900 overflow-hidden flex-shrink-0">
                  {ex.gifUrl
                    ? <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Dumbbell className="w-4 h-4 text-gray-600" /></div>
                  }
                </div>
                <span className="flex-1 text-sm text-white capitalize truncate">{ex.name}</span>
                <button onClick={() => toggle(ex)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={selected.length === 0 || starting}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base"
      >
        {starting
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Starting...</>
          : <><ChevronRight className="w-5 h-5" /> Start workout ({selected.length} exercise{selected.length !== 1 ? 's' : ''})</>
        }
      </button>
    </div>
  );
}