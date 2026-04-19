import { Trash2, Utensils } from 'lucide-react';
import { deleteLogEntry } from '../../api/calories';
import { useState } from 'react';

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function FoodLogList({ byMeal, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteLogEntry(id);
      onDelete(id);
    } finally {
      setDeleting(null);
    }
  };

  const hasAny = MEAL_ORDER.some((m) => byMeal[m]?.length > 0);
  if (!hasAny) {
    return (
      <div className="text-center py-10">
        <Utensils className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No food logged yet</p>
        <p className="text-xs text-gray-600 mt-1">Use search, photo, or manual entry above</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {MEAL_ORDER.map((mealType) => {
        const items = byMeal[mealType] || [];
        if (!items.length) return null;
        const mealCals = items.reduce((s, i) => s + i.calories, 0);

        return (
          <div key={mealType}>
            {/* Meal header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base" style={{ fontSize: 16 }}>{MEAL_ICONS[mealType]}</span>
                <span className="text-sm font-medium text-white capitalize">{mealType}</span>
              </div>
              <span className="text-xs text-gray-500">{mealCals} kcal</span>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 bg-dark-800 border border-white/5 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} {item.unit}
                      {item.protein > 0 && ` · P:${item.protein}g C:${item.carbs}g F:${item.fat}g`}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white flex-shrink-0">{item.calories} kcal</span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="w-7 h-7 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}