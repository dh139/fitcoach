export default function ReportSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-dark-700 rounded-2xl" />
        <div className="h-24 bg-dark-700 rounded-2xl" />
      </div>
      {/* Summary block */}
      <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-dark-700 rounded-lg w-1/3" />
        <div className="h-3 bg-dark-700 rounded-lg w-full" />
        <div className="h-3 bg-dark-700 rounded-lg w-4/5" />
        <div className="h-3 bg-dark-700 rounded-lg w-3/5" />
      </div>
      {/* Bullets */}
      {[1, 2].map((i) => (
        <div key={i} className="bg-dark-800 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="h-4 bg-dark-700 rounded-lg w-1/4" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-dark-700 rounded-full flex-shrink-0" />
              <div className="h-3 bg-dark-700 rounded-lg flex-1" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}