import { useState, useEffect } from 'react';
import { Trophy, Loader2, RefreshCw } from 'lucide-react';
import api          from '../../api/axiosInstance';
import ChallengeCard from './ChallengeCard';
import { useToast } from '../ui/ToastContext';
import PageHeader   from '../ui/PageHeader';

export default function ChallengesPage() {
  const { addToast }           = useToast();
  const [challenges, setChallenges] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/challenges');
      setChallenges(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleClaim = (result) => {
    addToast(result.message || 'XP claimed!', 'success');
    load(); // refresh progress
  };

  const daily  = challenges.filter((c) => c.type === 'daily');
  const weekly = challenges.filter((c) => c.type === 'weekly');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
      <PageHeader
        title="Challenges"
        subtitle="AI-generated daily and weekly goals"
        action={
          <button onClick={load} className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {daily.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Daily challenges</p>
              <div className="space-y-3">
                {daily.map((c) => <ChallengeCard key={c._id} challenge={c} onClaim={handleClaim} />)}
              </div>
            </div>
          )}
          {weekly.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Weekly challenges</p>
              <div className="space-y-3">
                {weekly.map((c) => <ChallengeCard key={c._id} challenge={c} onClaim={handleClaim} />)}
              </div>
            </div>
          )}
          {!daily.length && !weekly.length && (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No challenges yet</p>
              <button onClick={load} className="text-brand-500 text-sm mt-2 hover:underline">
                Generate challenges
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}