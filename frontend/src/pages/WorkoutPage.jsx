// components/workout/WorkoutSetup.jsx
import { useState } from 'react';

export default function WorkoutSetup({ onStart }) {
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [selectedExercises, setSelectedExercises] = useState([]); // you'll expand this later

  const handleSubmit = () => {
    onStart({ workoutName, exercises: selectedExercises });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-zinc-800">
        <h1 className="text-4xl font-bold tracking-tighter">New workout</h1>
        <p className="text-zinc-400 mt-2 text-lg">Add exercises to get started</p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-10 overflow-auto">
        
        {/* Workout Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-3">
            WORKOUT NAME
          </label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl px-6 py-5 text-xl focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Add Exercises */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-3">
            ADD EXERCISES
          </label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 text-2xl">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search by name, muscle, equipment..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl pl-16 pr-6 py-5 text-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Optional: Quick suggestions or selected list can go here */}
          {selectedExercises.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-zinc-400 mb-3">Selected ({selectedExercises.length})</p>
              {/* Render selected exercises chips */}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={handleSubmit}
          disabled={selectedExercises.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-all font-semibold text-xl py-6 rounded-3xl flex items-center justify-center gap-3 active:scale-[0.985]"
        >
          Start workout
          <span className="text-base opacity-75">({selectedExercises.length} exercises)</span>
        </button>
      </div>
    </div>
  );
}