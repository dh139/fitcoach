import { TrendingUp, Info } from 'lucide-react';

const PILLARS = [
  { key: 'weightProgress',   label: 'Weight progress', color: '#a855f7', weight: '30%' },
  { key: 'consistency',      label: 'Consistency',      color: '#22c55e', weight: '30%' },
  { key: 'strengthIncrease', label: 'Strength quality', color: '#3b82f6', weight: '20%' },
  { key: 'dietAdherence',    label: 'Diet adherence',   color: '#f59e0b', weight: '20%' },
];

function PillarBar({ label, score, color, weight, detail }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{weight}</span>
          <span className="text-white font-medium tabular-nums">{score}/100</span>
        </div>
      </div>
      <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, score)}%`, background: color }}
        />
      </div>
      {detail && <p className="text-xs text-gray-600">{detail}</p>}
    </div>
  );
}

export default function ImprovementScore({ data }) {
  if (!data) return null;
  const { composite, breakdown } = data;

  const grade =
    composite >= 80 ? { label: 'Excellent', color: 'text-green-400' } :
    composite >= 60 ? { label: 'Good',      color: 'text-blue-400'  } :
    composite >= 40 ? { label: 'Fair',      color: 'text-yellow-400'} :
                      { label: 'Needs work',color: 'text-red-400'   };

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Improvement score</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white tabular-nums">{composite}</p>
          <p className={`text-xs font-medium ${grade.color}`}>{grade.label}</p>
        </div>
      </div>

      {/* Composite ring */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="-rotate-90 w-full h-full">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(composite / 100) * 201} 201`}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#a855f7"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{composite}</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-xs text-gray-500 leading-relaxed">
            Based on your workout progression, consistency, session quality, and diet logging over the last 30 days.
          </p>
        </div>
      </div>

      {/* Pillar bars */}
      <div className="space-y-4">
        {PILLARS.map(({ key, label, color, weight }) => {
          const pillar = breakdown[key];
          if (!pillar) return null;
          return (
            <PillarBar
              key={key}
              label={label}
              score={pillar.score}
              color={color}
              weight={weight}
              detail={pillar.detail}
            />
          );
        })}
      </div>
    </div>
  );
}