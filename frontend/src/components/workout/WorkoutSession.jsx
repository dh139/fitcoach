import { useState, useEffect, useRef, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import WorkoutTimer from './WorkoutTimer';
import ExerciseItem from './ExerciseItem';
import { completeWorkout } from '../../api/workout';

export default function WorkoutSession({ workout, exercises, onComplete, onCancel }) {
  const [seconds,    setSeconds]    = useState(0);
  const [logs,       setLogs]       = useState(() =>
    exercises.reduce((acc, ex) => ({
      ...acc,
      [ex._id]: { setsCompleted: 0, repsCompleted: 10, durationSeconds: 0, clickTimestamps: [], completedAt: null },
    }), {})
  );
  const [finishing,  setFinishing]  = useState(false);
  const [showQuit,   setShowQuit]   = useState(false);
  const intervalRef = useRef(null);

  // Tick the timer every second
  useEffect(() => {
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const updateLog = useCallback((exerciseId, updates) => {
    setLogs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], ...updates },
    }));
  }, []);

  const completedCount = Object.values(logs).filter(
    (l) => l.setsCompleted > 0 || l.durationSeconds > 0
  ).length;

  const handleFinish = async () => {
    setFinishing(true);
    clearInterval(intervalRef.current);
    try {
      const exerciseLogs = exercises.map((ex) => ({
        exercise:        ex._id,
        exerciseName:    ex.name,
        ...logs[ex._id],
      }));
      const result = await completeWorkout({ workoutId: workout._id, exerciseLogs });
      onComplete(result);
    } catch (err) {
      console.error(err);
      setFinishing(false);
    }
  };

  const MIN_SECONDS    = 120;
  const canFinish      = seconds >= MIN_SECONDS && completedCount >= 1;
  const progressPct    = Math.round((completedCount / exercises.length) * 100);

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b border-white/10">
        <button
          onClick={() => setShowQuit(true)}
          className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-white">{workout.workoutName}</p>
          <p className="text-xs text-gray-500">{completedCount}/{exercises.length} exercises done</p>
        </div>
        <button
          onClick={handleFinish}
          disabled={!canFinish || finishing}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            canFinish && !finishing
              ? 'bg-brand-500 hover:bg-brand-600 text-white'
              : 'bg-dark-700 text-gray-600 cursor-not-allowed'
          }`}
        >
          {finishing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finish'}
        </button>
      </div>

      {/* Timer + progress */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <WorkoutTimer seconds={seconds} isRunning={!finishing} />

        {/* Right side stats */}
        <div className="space-y-4 text-right">
          <div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-gray-500">exercises done</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{progressPct}%</p>
            <p className="text-xs text-gray-500">complete</p>
          </div>
        </div>
      </div>

      {/* Anti-cheat warning banner */}
      {seconds < MIN_SECONDS && (
        <div className="mx-4 mt-3 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-yellow-400">
            Complete at least 2 min of activity to earn XP — anti-cheat protection active
          </p>
        </div>
      )}

      {seconds >= MIN_SECONDS && completedCount >= 1 && (
        <div className="mx-4 mt-3 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-xs text-green-400">
            XP unlocked — you can finish anytime now
          </p>
        </div>
      )}

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {exercises.map((ex, i) => (
          <ExerciseItem
            key={ex._id}
            exercise={ex}
            log={logs[ex._id]}
            onUpdate={updateLog}
            isActive={i === exercises.findIndex((e) => !(logs[e._id]?.setsCompleted > 0 || logs[e._id]?.durationSeconds > 0))}
          />
        ))}
      </div>

      {/* Finish button — sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent">
        <button
          onClick={handleFinish}
          disabled={!canFinish || finishing}
          className={`w-full py-4 rounded-2xl font-medium text-base transition-all ${
            canFinish && !finishing
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg'
              : 'bg-dark-700 text-gray-600 cursor-not-allowed'
          }`}
        >
          {finishing
            ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Saving...</span>
            : canFinish
            ? 'Finish workout & earn XP'
            : `${Math.max(0, MIN_SECONDS - seconds)}s remaining to unlock XP`
          }
        </button>
      </div>

      {/* Quit confirm dialog */}
      {showQuit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Quit workout?</h3>
            <p className="text-sm text-gray-400 mb-5">Your progress won't be saved and you won't earn XP.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuit(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Keep going
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}