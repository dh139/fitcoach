const TABS = [
  { key: 'daily',   label: 'Today',      sub: 'Daily recap' },
  { key: 'weekly',  label: 'This week',  sub: 'Weekly review' },
  { key: 'monthly', label: 'This month', sub: 'Monthly progress' },
  { key: 'yearly',  label: 'This year',  sub: 'Year in review' },
];

export default function ReportTabs({ active, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-dark-800 border border-white/10 rounded-2xl">
      {TABS.map(({ key, label, sub }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-colors ${
            active === key
              ? 'bg-brand-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-dark-700'
          }`}
        >
          <span className="text-sm font-medium">{label}</span>
          <span className={`text-xs mt-0.5 ${active === key ? 'text-white/70' : 'text-gray-600'}`}>
            {sub}
          </span>
        </button>
      ))}
    </div>
  );
}