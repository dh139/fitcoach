import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function ManualEntry({ onAdd, defaultMeal = 'snack' }) {
  const [form, setForm] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '',
    quantity: 1, unit: 'serving', mealType: defaultMeal,
  });
  const [adding, setAdding] = useState(false);
  const [error,  setError]  = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.calories) {
      setError('Food name and calories are required');
      return;
    }
    setError('');
    setAdding(true);
    try {
      await onAdd({
        name:     form.name.trim(),
        quantity: Number(form.quantity) || 1,
        unit:     form.unit || 'serving',
        calories: Number(form.calories) || 0,
        protein:  Number(form.protein)  || 0,
        carbs:    Number(form.carbs)    || 0,
        fat:      Number(form.fat)      || 0,
        mealType: form.mealType,
        source:   'manual',
      });
      setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: 1, unit: 'serving', mealType: defaultMeal });
    } finally {
      setAdding(false);
    }
  };

  const inputCls = 'w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors';

  return (
    <div className="space-y-3">
      <input
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        placeholder="Food name (e.g. Dal Tadka, Chicken Breast)"
        className={inputCls}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Calories *</label>
          <input type="number" value={form.calories} onChange={(e) => set('calories', e.target.value)}
            placeholder="e.g. 250" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Quantity</label>
          <div className="flex gap-2">
            <input type="number" value={form.quantity} onChange={(e) => set('quantity', e.target.value)}
              className={`${inputCls} w-16`} />
            <input value={form.unit} onChange={(e) => set('unit', e.target.value)}
              placeholder="serving" className={`${inputCls} flex-1`} />
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2">
        {[['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={(e) => set(key, e.target.value)}
              placeholder="0" className={inputCls} />
          </div>
        ))}
      </div>

      {/* Meal type */}
      <div className="flex gap-2">
        {MEAL_TYPES.map((m) => (
          <button key={m} onClick={() => set('mealType', m)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-colors border ${
              form.mealType === m
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-dark-700 border-white/10 text-gray-400 hover:border-brand-500/50'
            }`}>
            {m}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {adding ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : <><Plus className="w-4 h-4" />Add entry</>}
      </button>
    </div>
  );
}