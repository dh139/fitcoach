import { useState, useEffect } from 'react';
import { Swords, UserPlus, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api        from '../../api/axiosInstance';
import { useToast } from '../ui/ToastContext';
import LevelBadge from '../gamification/LevelBadge';
import PageHeader from '../ui/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function RivalsPage() {
  const { user }               = useAuth();
  const { addToast }           = useToast();
  const [rivals,      setRivals]      = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('active');

  const load = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        api.get('/rivals'),
        api.get('/rivals/suggestions'),
      ]);
      setRivals(r.data.data);
      setSuggestions(s.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChallenge = async (userId, name) => {
    try {
      await api.post(`/rivals/challenge/${userId}`);
      addToast(`Challenge sent to ${name}!`, 'success');
      load();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send challenge', 'error');
    }
  };

  const handleRespond = async (id, accept) => {
    try {
      await api.post(`/rivals/${id}/respond`, { accept });
      addToast(accept ? 'Challenge accepted!' : 'Challenge declined', accept ? 'success' : 'info');
      load();
    } catch {
      addToast('Failed to respond', 'error');
    }
  };

  const myId     = user?._id;
  const active   = rivals.filter((r) => r.status === 'active');
  const pending  = rivals.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
      <PageHeader title="Rivals" subtitle="Challenge others to XP battles this week" />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-800 border border-white/10 rounded-xl mb-6">
        {[
          { key: 'active',  label: `Active (${active.length})`   },
          { key: 'pending', label: `Pending (${pending.length})`  },
          { key: 'find',    label: 'Find rivals'                  },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : (
        <>
          {/* Active battles */}
          {tab === 'active' && (
            <div className="space-y-3">
              {active.length === 0 ? (
                <div className="text-center py-12">
                  <Swords className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No active battles yet</p>
                  <button onClick={() => setTab('find')} className="text-brand-500 text-sm mt-2 hover:underline">
                    Find rivals →
                  </button>
                </div>
              ) : active.map((battle) => {
                const isChallenger = battle.challenger?._id === myId;
                const me    = isChallenger ? battle.challenger : battle.rival;
                const them  = isChallenger ? battle.rival      : battle.challenger;
                const myScore    = isChallenger ? battle.challengerScore : battle.rivalScore;
                const theirScore = isChallenger ? battle.rivalScore      : battle.challengerScore;
                const winning    = myScore >= theirScore;

                return (
                  <div key={battle._id} className={`bg-dark-800 border rounded-2xl p-4 ${winning ? 'border-brand-500/30' : 'border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-center">
                        <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-1 text-sm font-bold text-brand-400">
                          {me?.name?.slice(0, 1)}
                        </div>
                        <p className="text-xs text-white font-medium">You</p>
                        <p className="text-lg font-bold text-brand-400 tabular-nums">{myScore}</p>
                      </div>

                      <div className="text-center flex-shrink-0">
                        <div className="text-xl font-bold text-gray-500">VS</div>
                        <p className="text-xs text-gray-600 mt-1">{battle.weekKey}</p>
                      </div>

                      <div className="flex-1 text-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-1 text-sm font-bold text-red-400">
                          {them?.name?.slice(0, 1)}
                        </div>
                        <p className="text-xs text-white font-medium truncate">{them?.name}</p>
                        <p className="text-lg font-bold text-red-400 tabular-nums">{theirScore}</p>
                      </div>
                    </div>
                    <p className={`text-center text-xs mt-3 font-medium ${winning ? 'text-brand-400' : 'text-gray-500'}`}>
                      {winning ? 'You are winning — keep training!' : 'You are behind — time to grind!'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending */}
          {tab === 'pending' && (
            <div className="space-y-3">
              {pending.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-12">No pending challenges</p>
              ) : pending.map((battle) => {
                const isIncoming = battle.rival?._id === myId || battle.rival === myId;
                const other = isIncoming ? battle.challenger : battle.rival;

                return (
                  <div key={battle._id} className="bg-dark-800 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-sm font-bold text-gray-300">
                        {other?.name?.slice(0, 1)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{other?.name}</p>
                        <p className="text-xs text-gray-500">
                          {isIncoming ? 'challenged you!' : 'waiting for response'}
                        </p>
                      </div>
                      {other?.level && <LevelBadge level={other.level} size="sm" />}
                    </div>

                    {isIncoming && (
                      <div className="flex gap-2">
                        <button onClick={() => handleRespond(battle._id, true)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white transition-colors flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button onClick={() => handleRespond(battle._id, false)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-dark-700 border border-white/10 text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Find rivals */}
          {tab === 'find' && (
            <div className="space-y-2">
              {suggestions.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-12">No suggestions — complete some workouts first</p>
              ) : suggestions.map((u) => (
                <div key={u._id} className="flex items-center gap-3 bg-dark-800 border border-white/5 rounded-2xl p-3">
                  <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
                    {u.name?.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <LevelBadge level={u.level} size="sm" />
                      <span className="text-xs text-gray-600">{u.xp?.toLocaleString()} XP</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleChallenge(u._id, u.name)}
                    className="flex items-center gap-1.5 bg-brand-500/20 hover:bg-brand-500/40 border border-brand-500/30 text-brand-400 text-xs font-medium px-3 py-2 rounded-xl transition-colors flex-shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Challenge
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}