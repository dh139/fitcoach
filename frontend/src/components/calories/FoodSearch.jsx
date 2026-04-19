import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2, X } from 'lucide-react';
import { searchFood } from '../../api/calories';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function FoodSearch({ onAdd, defaultMeal = 'snack' }) {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty,      setQty]      = useState(1);
  const [meal,     setMeal]     = useState(defaultMeal);
  const [adding,   setAdding]   = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFood(query);
        setResults(data.data || []);
      } finally {
        setLoading(false);
      }
    }, 450);
  }, [query]);

  const handleSelect = (food) => {
    setSelected(food);
    setQuery(food.name);
    setResults([]);
    setQty(1);
  };

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    const macro = selected.perServing;
    try {
      await onAdd({
        name:     selected.name,
        brand:    selected.brand || '',
        quantity: qty,
        unit:     selected.servingSize || 'serving',
        calories: Math.round(macro.calories * qty),
        protein:  Math.round(macro.protein  * qty * 10) / 10,
        carbs:    Math.round(macro.carbs    * qty * 10) / 10,
        fat:      Math.round(macro.fat      * qty * 10) / 10,
        fiber:    Math.round((macro.fiber || 0) * qty * 10) / 10,
        mealType: meal,
        source:   'search',
      });
      setQuery('');
      setSelected(null);
      setQty(1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Search foods — try 'Dal', 'Banana', 'Chicken'..."
          className="w-full bg-dark-700 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(''); setSelected(null); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {(results.length > 0 || loading) && !selected && (
        <div className="bg-dark-700 border border-white/10 rounded-xl overflow-hidden">
          {loading && (
            <div className="flex items-center gap-2 p-3 text-gray-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </div>
          )}
          {results.map((food, i) => (
            <button
              key={i}
              onClick={() => handleSelect(food)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-dark-600 border-b border-white/5 last:border-0 transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{food.name}</p>
                <p className="text-xs text-gray-500">
                  {food.brand && `${food.brand} · `}{food.servingSize}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-white">{food.perServing.calories}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected food — configure and add */}
      {selected && (
        <div className="bg-dark-700 border border-brand-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.servingSize} per serving</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">
                {Math.round(selected.perServing.calories * qty)} kcal
              </p>
              <p className="text-xs text-gray-500">
                P: {Math.round(selected.perServing.protein * qty)}g ·
                C: {Math.round(selected.perServing.carbs * qty)}g ·
                F: {Math.round(selected.perServing.fat * qty)}g
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Quantity */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Servings</label>
              <div className="flex items-center gap-2 bg-dark-800 rounded-xl p-2">
                <button onClick={() => setQty(q => Math.max(0.5, q - 0.5))}
                  className="w-7 h-7 rounded-lg bg-dark-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg leading-none">−</button>
                <span className="flex-1 text-center text-sm text-white font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 0.5)}
                  className="w-7 h-7 rounded-lg bg-dark-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg leading-none">+</button>
              </div>
            </div>

            {/* Meal type */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Meal</label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 capitalize"
              >
                {MEAL_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {adding
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
              : <><Plus className="w-4 h-4" /> Add to log</>
            }
          </button>
        </div>
      )}
    </div>
  );
}