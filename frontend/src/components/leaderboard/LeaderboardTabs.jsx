const TABS = [
  { key: 'daily',   label: 'Today' },
  { key: 'weekly',  label: 'This week' },
  { key: 'monthly', label: 'This month' },
];

export default function LeaderboardTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-dark-800 border border-white/10 rounded-xl w-fit">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === key
              ? 'bg-brand-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}