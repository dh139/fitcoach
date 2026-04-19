export default function ReportSection({ title, icon: Icon, iconColor, items = [], type = 'list', children }) {
  if (!items.length && !children) return null;

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor || 'bg-dark-700'}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>

      {children && <div className="text-sm text-gray-300 leading-relaxed">{children}</div>}

      {items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
                ${type === 'highlight'   ? 'bg-green-500/20 text-green-400' :
                  type === 'improvement' ? 'bg-yellow-500/20 text-yellow-400' :
                  type === 'action'      ? 'bg-blue-500/20 text-blue-400' :
                  'bg-dark-700 text-gray-400'}`}>
                {type === 'highlight' ? '✓' : type === 'improvement' ? '!' : type === 'action' ? '→' : i + 1}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}