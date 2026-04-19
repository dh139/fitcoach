export default function StatCard({ icon: Icon, iconColor, iconBg, label, value, sub, trend }) {
  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-4 fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend > 0  ? 'bg-green-500/20 text-green-400' :
            trend < 0  ? 'bg-red-500/20   text-red-400'   :
                         'bg-dark-700     text-gray-500'
          }`}>
            {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '—'}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}