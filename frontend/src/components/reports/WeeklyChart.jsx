export default function WeeklyChart({ sessions = [] }) {
  if (!sessions.length) return null;

  const maxDuration = Math.max(10, ...sessions.map((s) => s.duration));
  const maxCalories = Math.max(100, ...sessions.map((s) => s.calories));

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
      <p className="text-sm font-medium text-white mb-4">Session breakdown</p>
      <div className="space-y-2">
        {sessions.map((session, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {new Date(session.date + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short'
                })}
              </span>
              <span className="text-gray-500">
                {session.duration}min · {session.calories}kcal · Q:{session.quality}
              </span>
            </div>
            {/* Duration bar */}
            <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${(session.duration / maxDuration) * 100}%` }}
              />
            </div>
            {/* Exercises done */}
            {session.exercises?.length > 0 && (
              <p className="text-xs text-gray-600 truncate">
                {session.exercises.slice(0, 3).join(' · ')}
                {session.exercises.length > 3 && ` +${session.exercises.length - 3} more`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}