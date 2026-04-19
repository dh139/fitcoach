import { useState, useEffect, useCallback } from 'react';
import { BarChart2, Loader2, Info } from 'lucide-react';
import { getReport } from '../api/reports';
import ReportTabs    from '../components/reports/ReportTabs';
import ReportCard    from '../components/reports/ReportCard';
import ReportSkeleton from '../components/reports/ReportSkeleton';

const TYPE_DESCRIPTIONS = {
  daily:   'A summary of today — calories, workout quality, and what to do tomorrow.',
  weekly:  'Your week in review — consistency, strengths, weaknesses, and plateau detection.',
  monthly: 'Monthly progress — trends, habit formation, and a plan for next month.',
  yearly:  'Your year of fitness — total transformation, milestones, and vision ahead.',
};

export default function ReportsPage() {
  const [activeType,  setActiveType]  = useState('weekly');
  const [reportData,  setReportData]  = useState({});  // cached per type
  const [loading,     setLoading]     = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState('');

  const loadReport = useCallback(async (type, forceRefresh = false) => {
    // Use cached if available and not forcing
    if (reportData[type] && !forceRefresh) return;

    forceRefresh ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      const data = await getReport(type, forceRefresh);
      setReportData((prev) => ({ ...prev, [type]: data.data }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report. Try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [reportData]);

  // Load when tab changes
  useEffect(() => {
    loadReport(activeType);
  }, [activeType]);

  const current = reportData[activeType];
  const isLoading = loading && !current;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI reports</h1>
            <p className="text-xs text-gray-500">Powered by Groq — personalized fitness insights</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <ReportTabs active={activeType} onChange={setActiveType} />
        </div>

        {/* Type description */}
        <div className="flex items-start gap-2 bg-dark-800 border border-white/5 rounded-xl px-3 py-2.5 mb-5">
          <Info className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">{TYPE_DESCRIPTIONS[activeType]}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => loadReport(activeType, true)}
              className="text-xs text-red-300 hover:text-white mt-1 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && <ReportSkeleton />}

        {/* Report card */}
        {!isLoading && current && (
          <ReportCard
            report={current.report}
            context={current.context}
            generatedAt={current.generatedAt}
            onRefresh={() => loadReport(activeType, true)}
            refreshing={refreshing}
          />
        )}

        {/* Empty state — no data yet */}
        {!isLoading && !current && !error && (
          <div className="text-center py-16">
            <BarChart2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">No report yet</p>
            <p className="text-gray-600 text-xs mb-4">
              Complete some workouts and log meals to get your first AI report
            </p>
            <button
              onClick={() => loadReport(activeType, true)}
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Generate report now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}