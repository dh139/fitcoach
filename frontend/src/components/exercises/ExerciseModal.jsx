import { X, Heart, Zap, Target, Dumbbell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DIFFICULTY_COLORS = {
  beginner:     'text-green-400 bg-green-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced:     'text-red-400 bg-red-400/10',
};

export default function ExerciseModal({ exercise, isFavorited, onClose, onFavorite }) {
  const navigate = useNavigate();
  if (!exercise) return null;

  const diffClass = DIFFICULTY_COLORS[exercise.difficulty] || DIFFICULTY_COLORS.intermediate;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white capitalize">{exercise.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFavorite(exercise._id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isFavorited ? 'bg-red-500 text-white' : 'bg-dark-700 text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-dark-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-5">
          {/* GIF */}
       
<div className="aspect-square bg-dark-900 rounded-xl overflow-hidden relative">
  {exercise.gifUrl ? (
    <>
      {/* Skeleton */}
      <div
        id={`modal-skeleton-${exercise._id}`}
        className="absolute inset-0 bg-dark-700 animate-pulse rounded-xl"
      />
      <img
        src={exercise.gifUrl}
        alt={exercise.name}
        className="w-full h-full object-cover rounded-xl relative z-10"
        onLoad={(e) => {
          e.target.style.opacity = '1';
          const sk = document.getElementById(`modal-skeleton-${exercise._id}`);
          if (sk) sk.style.display = 'none';
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          const sk = document.getElementById(`modal-skeleton-${exercise._id}`);
          if (sk) {
            sk.classList.remove('animate-pulse');
            sk.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span style="color:#4b5563;font-size:12px">No preview available</span>
            </div>`;
          }
        }}
        style={{ opacity: 0, transition: 'opacity 0.3s' }}
      />
    </>
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <Zap className="w-12 h-12 text-gray-600" />
      <span className="text-xs text-gray-600">No preview</span>
    </div>
  )}
</div>

          {/* Details */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${diffClass}`}>
                {exercise.difficulty}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 capitalize">
                {exercise.bodyPart}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 capitalize">
                {exercise.equipment}
              </span>
            </div>

            {/* Target muscles */}
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Target className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide">Primary muscle</span>
              </div>
              <p className="text-sm text-white capitalize">{exercise.target}</p>
            </div>

            {exercise.secondaryMuscles?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wide">Secondary muscles</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.secondaryMuscles.map((m) => (
                    <span key={m} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calories */}
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3">
              <p className="text-xs text-brand-500 uppercase tracking-wide mb-1">Estimated burn</p>
              <p className="text-lg font-semibold text-white">
                ~{exercise.caloriesPerMinute} <span className="text-sm font-normal text-gray-400">cal / min</span>
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {exercise.instructions?.length > 0 && (
          <div className="px-5 pb-5">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
              Instructions
            </h3>
            <ol className="space-y-3">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 text-xs font-medium flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Start workout CTA */}
        <div className="px-5 pb-5">
          <button
            onClick={() => { onClose(); navigate('/workout'); }}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Start workout with this exercise
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}