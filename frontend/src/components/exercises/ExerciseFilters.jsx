export default function ExerciseFilters({ filters, options, onChange, onClear }) {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.bodyPart}
        onChange={(e) => onChange('bodyPart', e.target.value)}
        className="bg-dark-700 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors min-w-[140px]"
      >
        <option value="">All body parts</option>
        {options.bodyParts?.map((bp) => (
          <option key={bp} value={bp}>{bp}</option>
        ))}
      </select>

      <select
        value={filters.equipment}
        onChange={(e) => onChange('equipment', e.target.value)}
        className="bg-dark-700 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors min-w-[140px]"
      >
        <option value="">All equipment</option>
        {options.equipment?.map((eq) => (
          <option key={eq} value={eq}>{eq}</option>
        ))}
      </select>

      <select
        value={filters.difficulty}
        onChange={(e) => onChange('difficulty', e.target.value)}
        className="bg-dark-700 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
      >
        <option value="">All levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {hasActive && (
        <button
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-white border border-white/10 px-3 py-2 rounded-xl transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}