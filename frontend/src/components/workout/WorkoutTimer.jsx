import { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WorkoutTimer({ seconds, isRunning }) {
  const MIN_SECONDS = 120; // 2 minutes
  const progress    = Math.min(100, (seconds / MIN_SECONDS) * 100);
  const unlocked    = seconds >= MIN_SECONDS;

  // Circumference of the SVG circle
  const R   = 54;
  const C   = 2 * Math.PI * R;
  const dash = C - (progress / 100) * C;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
          <circle
            cx="60" cy="60" r={R}
            fill="none"
            stroke={unlocked ? '#22c55e' : '#3b82f6'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{formatTime(seconds)}</span>
          <span className={`text-xs mt-0.5 ${unlocked ? 'text-green-400' : 'text-gray-500'}`}>
            {unlocked ? 'XP unlocked' : `${formatTime(MIN_SECONDS - seconds)} to go`}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
        {isRunning ? 'Session active' : 'Paused'}
      </div>
    </div>
  );
}