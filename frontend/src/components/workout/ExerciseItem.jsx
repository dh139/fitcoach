import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Minus, Timer } from 'lucide-react';

export default function ExerciseItem({ exercise, log, onUpdate, isActive }) {
  const [mode, setMode] = useState('sets'); // 'sets' | 'timed'

  const isCompleted = log.setsCompleted > 0 || log.durationSeconds > 0;

  const handleSetsDone = () => {
    const now = Date.now();
    const newClicks = [...(log.clickTimestamps || []), now];
    onUpdate(exercise._id, {
      setsCompleted:   (log.setsCompleted || 0) + 1,
      repsCompleted:   log.repsCompleted || 10,
      clickTimestamps: newClicks,
      completedAt:     new Date().toISOString(),
    });
  };

  const handleTimedDone = (secs) => {
    const now = Date.now();
    const newClicks = [...(log.clickTimestamps || []), now];
    onUpdate(exercise._id, {
      durationSeconds: (log.durationSeconds || 0) + secs,
      clickTimestamps: newClicks,
      completedAt:     new Date().toISOString(),
    });
  };

  const adjustReps = (delta) => {
    onUpdate(exercise._id, { repsCompleted: Math.max(1, (log.repsCompleted || 10) + delta) });
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isCompleted
        ? 'border-brand-500/40 bg-brand-500/5'
        : isActive
        ? 'border-white/20 bg-dark-700'
        : 'border-white/10 bg-dark-800'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? 'text-brand-500' : 'text-gray-600'
        }`}>
          {isCompleted
            ? <CheckCircle2 className="w-8 h-8" />
            : <Circle className="w-8 h-8" />
          }
        </div>

        {/* GIF thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-dark-900 overflow-hidden flex-shrink-0">
          {exercise.gifUrl ? (
            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
              GIF
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white capitalize truncate">{exercise.name}</p>
          <p className="text-xs text-gray-500 capitalize">{exercise.target} · {exercise.equipment}</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-dark-900 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setMode('sets')}
            className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'sets' ? 'bg-dark-600 text-white' : 'text-gray-500'}`}
          >
            Sets
          </button>
          <button
            onClick={() => setMode('timed')}
            className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'timed' ? 'bg-dark-600 text-white' : 'text-gray-500'}`}
          >
            Timed
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4">
        {mode === 'sets' ? (
          <div className="flex items-center gap-3">
            {/* Reps counter */}
            <div className="flex items-center gap-2 bg-dark-900 rounded-xl p-2">
              <button onClick={() => adjustReps(-1)} className="w-7 h-7 rounded-lg bg-dark-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm text-white w-8 text-center tabular-nums">{log.repsCompleted || 10}</span>
              <button onClick={() => adjustReps(1)} className="w-7 h-7 rounded-lg bg-dark-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-500 ml-1">reps</span>
            </div>

            {/* Mark set done */}
            <button
              onClick={handleSetsDone}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors bg-brand-500/20 text-brand-500 hover:bg-brand-500/30 border border-brand-500/30"
            >
              {log.setsCompleted > 0 ? `+ Set ${log.setsCompleted + 1}` : 'Mark set done'}
            </button>

            {log.setsCompleted > 0 && (
              <span className="text-xs text-gray-500 bg-dark-900 px-2.5 py-1.5 rounded-lg">
                {log.setsCompleted} set{log.setsCompleted !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">Log time:</span>
            {[30, 60, 90, 120].map((secs) => (
              <button
                key={secs}
                onClick={() => handleTimedDone(secs)}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-dark-900 hover:bg-brand-500/20 hover:text-brand-500 text-gray-400 transition-colors border border-white/5 hover:border-brand-500/30"
              >
                {secs}s
              </button>
            ))}
            {log.durationSeconds > 0 && (
              <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1.5 rounded-lg flex-shrink-0">
                {log.durationSeconds}s done
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}