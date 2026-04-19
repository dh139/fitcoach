import { useState } from 'react';
import { Heart, Zap, Clock, Dumbbell } from 'lucide-react';

const DIFFICULTY_COLORS = {
  beginner:     'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  advanced:     'text-red-400 bg-red-400/10 border-red-400/20',
};

const BODYPART_COLORS = {
  chest:         'bg-red-500/20 text-red-300',
  back:          'bg-blue-500/20 text-blue-300',
  shoulders:     'bg-purple-500/20 text-purple-300',
  'upper arms':  'bg-orange-500/20 text-orange-300',
  'lower arms':  'bg-amber-500/20 text-amber-300',
  'upper legs':  'bg-teal-500/20 text-teal-300',
  'lower legs':  'bg-cyan-500/20 text-cyan-300',
  waist:         'bg-pink-500/20 text-pink-300',
  cardio:        'bg-green-500/20 text-green-300',
};

// Placeholder SVG shown while GIF loads or if it fails
function ExercisePlaceholder({ name }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-dark-900">
      <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center">
        <Dumbbell className="w-6 h-6 text-brand-500" />
      </div>
      <span className="text-xs text-gray-600">{initials}</span>
    </div>
  );
}

export default function ExerciseCard({ exercise, isFavorited, onSelect, onFavorite }) {
  const [imgState, setImgState] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const diffClass = DIFFICULTY_COLORS[exercise.difficulty] || DIFFICULTY_COLORS.intermediate;
  const bpClass   = BODYPART_COLORS[exercise.bodyPart]    || 'bg-gray-500/20 text-gray-300';

  return (
    <div
      onClick={() => onSelect(exercise)}
      className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/50 hover:bg-dark-700 transition-all duration-200 group"
    >
      {/* GIF / image area */}
      <div className="relative aspect-square bg-dark-900 overflow-hidden">

        {/* Skeleton shown while loading */}
        {imgState === 'loading' && (
          <div className="absolute inset-0 bg-dark-700 animate-pulse" />
        )}

        {/* Actual GIF — hidden until loaded */}
        {exercise.gifUrl ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            onLoad={()  => setImgState('loaded')}
            onError={() => setImgState('error')}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imgState === 'loaded' ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            loading="lazy"
          />
        ) : null}

        {/* Fallback if no URL or load failed */}
        {(!exercise.gifUrl || imgState === 'error') && imgState !== 'loading' && (
          <ExercisePlaceholder name={exercise.name} />
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(exercise._id); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-black/50 text-white/60 hover:text-white hover:bg-black/70'
          }`}
        >
          <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Difficulty badge */}
        <div className={`absolute bottom-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full border ${diffClass}`}>
          {exercise.difficulty}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white capitalize mb-1.5 line-clamp-1">
          {exercise.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${bpClass}`}>
            {exercise.bodyPart}
          </span>
          <span className="text-xs text-gray-500 capitalize flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {exercise.target}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>~{exercise.caloriesPerMinute} cal/min</span>
        </div>
      </div>
    </div>
  );
}