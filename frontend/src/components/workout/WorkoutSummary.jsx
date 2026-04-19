import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Zap, Flame, Clock, Star, ChevronRight } from 'lucide-react';
import { formatTime } from './WorkoutTimer';

export default function WorkoutSummary({ result }) {
  const navigate = useNavigate();

  const { workout, validation, xpEarned, totalCaloriesBurned, didLevelUp, previousLevel, newLevel } = result.data || {};
  const verified = validation?.isVerified ?? false;

  // Trigger level-up modal for Dashboard
  useEffect(() => {
    if (didLevelUp && newLevel) {
      sessionStorage.setItem('levelUp', JSON.stringify({
        previousLevel: previousLevel || newLevel - 1,
        newLevel: newLevel,
      }));
    }
  }, [didLevelUp, previousLevel, newLevel]);

  // Safety check
  if (!result?.data) {
    return <div className="text-center py-20">No workout data found.</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col max-w-lg mx-auto px-4 py-8">
      {/* Status hero */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
          verified ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {verified
            ? <CheckCircle2 className="w-10 h-10 text-green-400" />
            : <XCircle className="w-10 h-10 text-red-400" />
          }
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {verified ? 'Workout Complete!' : 'Session Not Verified'}
        </h1>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          {verified
            ? 'Great job — your XP has been added to your profile!'
            : validation?.reason || 'Your workout could not be verified.'
          }
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 text-center">
          <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">+{xpEarned || 0}</p>
          <p className="text-xs text-gray-500 mt-0.5">XP earned</p>
        </div>
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalCaloriesBurned || 0}</p>
          <p className="text-xs text-gray-500 mt-0.5">calories burned</p>
        </div>
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 text-center">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{formatTime(workout?.durationSeconds || 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">duration</p>
        </div>
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 text-center">
          <Star className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{validation?.qualityScore || 0}</p>
          <p className="text-xs text-gray-500 mt-0.5">quality score</p>
        </div>
      </div>

      {/* Verification breakdown */}
      {verified && validation?.details && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Verification Details</p>
          {[
            { label: 'Minimum duration (2 min)', pass: validation.details.durationValid },
            { label: 'Exercises completed',       pass: validation.details.exerciseCountValid },
            { label: 'No rapid clicking',         pass: validation.details.clickSpacingValid },
          ].map(({ label, pass }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                pass ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {pass
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400" />
                }
              </div>
              <span className={`text-sm ${pass ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Exercise log */}
      {workout?.exerciseLogs?.length > 0 && (
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Exercises Completed</p>
          {workout.exerciseLogs.map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-white capitalize">{log.exerciseName}</span>
              <span className="text-xs text-gray-500">
                {log.setsCompleted > 0
                  ? `${log.setsCompleted} sets × ${log.repsCompleted} reps`
                  : `${log.durationSeconds || 0}s`
                }
                <span className="text-orange-400 ml-2">{log.caloriesBurned || 0} cal</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3 mt-auto">
        <button
          onClick={() => navigate('/workout')}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          Start New Workout <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-dark-800 border border-white/10 hover:border-white/20 text-gray-300 font-medium py-4 rounded-2xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}