const MACRO_COLORS = {
  protein: '#3b82f6',
  carbs:   '#22c55e',
  fat:     '#f59e0b',
};

function DonutSegment({ pct, offset, color, radius = 40 }) {
  const C   = 2 * Math.PI * radius;
  const len = (pct / 100) * C;
  return (
    <circle
      cx="50" cy="50" r={radius}
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeDasharray={`${len} ${C - len}`}
      strokeDashoffset={-offset}
      strokeLinecap="butt"
      style={{ transition: 'stroke-dasharray 0.6s ease' }}
    />
  );
}

export default function MacroRing({ calories, goal = 2000, protein, carbs, fat }) {
  const totalMacroG = protein + carbs + fat || 1;
  const proteinPct  = Math.round((protein / totalMacroG) * 100);
  const carbsPct    = Math.round((carbs   / totalMacroG) * 100);
  const fatPct      = Math.max(0, 100 - proteinPct - carbsPct);

  const C      = 2 * Math.PI * 40;
  const pOff   = 0;
  const cOff   = -(proteinPct / 100) * C;
  const fOff   = cOff - (carbsPct / 100) * C;

  const goalPct = Math.min(100, Math.round((calories / goal) * 100));

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
          {/* Background track */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
          {totalMacroG > 1 ? (
            <>
              <DonutSegment pct={proteinPct} offset={pOff} color={MACRO_COLORS.protein} />
              <DonutSegment pct={carbsPct}   offset={cOff} color={MACRO_COLORS.carbs} />
              <DonutSegment pct={fatPct}     offset={fOff} color={MACRO_COLORS.fat} />
            </>
          ) : (
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
          )}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white leading-none">{calories}</span>
          <span className="text-xs text-gray-500">kcal</span>
        </div>
      </div>

      {/* Legend + goal bar */}
      <div className="flex-1 space-y-2">
        {/* Goal progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Daily goal</span>
            <span className="text-white font-medium">{calories} / {goal} kcal</span>
          </div>
          <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${goalPct}%`,
                background: goalPct >= 100 ? '#ef4444' : goalPct >= 80 ? '#f59e0b' : '#22c55e',
              }}
            />
          </div>
        </div>

        {/* Macro legend */}
        {[
          { key: 'protein', label: 'Protein', value: protein, color: MACRO_COLORS.protein },
          { key: 'carbs',   label: 'Carbs',   value: carbs,   color: MACRO_COLORS.carbs   },
          { key: 'fat',     label: 'Fat',      value: fat,     color: MACRO_COLORS.fat     },
        ].map(({ key, label, value, color }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <span className="text-xs text-white font-medium">{Math.round(value)}g</span>
          </div>
        ))}
      </div>
    </div>
  );
}