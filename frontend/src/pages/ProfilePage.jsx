import { useState } from 'react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../components/ui/ToastContext';
import api          from '../api/axiosInstance';
import LevelBadge   from '../components/gamification/LevelBadge';
import PageHeader   from '../components/ui/PageHeader';
import {
  User, Scale, Ruler, Target, Activity,
  Loader2, Save, Trophy, Flame, Clock, Zap,
} from 'lucide-react';

const GOALS = [
  { value: 'lose_weight',        label: 'Lose weight'        },
  { value: 'build_muscle',       label: 'Build muscle'       },
  { value: 'improve_endurance',  label: 'Improve endurance'  },
  { value: 'stay_fit',           label: 'Stay fit'           },
  { value: 'gain_weight',        label: 'Gain weight'        },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary',   label: 'Sedentary',    sub: 'Little or no exercise' },
  { value: 'light',       label: 'Light',        sub: '1–3 days/week' },
  { value: 'moderate',    label: 'Moderate',     sub: '3–5 days/week' },
  { value: 'active',      label: 'Active',       sub: '6–7 days/week' },
  { value: 'very_active', label: 'Very active',  sub: 'Twice/day' },
];

const inputCls = 'w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { addToast }         = useToast();
  const [saving, setSaving]  = useState(false);

  const [form, setForm] = useState({
    name:          user?.name          || '',
    age:           user?.age           || '',
    weight:        user?.weight        || '',
    height:        user?.height        || '',
    gender:        user?.gender        || 'male',
    fitnessGoal:   user?.fitnessGoal   || 'stay_fit',
    activityLevel: user?.activityLevel || 'moderate',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Rough TDEE calculation for motivation
  const tdee = (() => {
    const w = Number(form.weight);
    const h = Number(form.height);
    const a = Number(form.age);
    if (!w || !h || !a) return null;
    const bmr = form.gender === 'female'
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5;
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    return Math.round(bmr * (multipliers[form.activityLevel] || 1.55));
  })();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/update-profile', form);
      updateUser(data.user);
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
      <PageHeader title="Profile" subtitle="Manage your fitness details" />

      {/* Avatar + level */}
      <div className="flex items-center gap-4 bg-dark-800 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-brand-400">
            {user?.name?.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-white truncate">{user?.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <LevelBadge level={user?.level || 'beginner'} size="sm" />
            <span className="text-xs text-gray-500">{user?.xp?.toLocaleString()} XP total</span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { icon: Trophy, color: 'text-amber-400',  bg: 'bg-amber-500/10',  label: 'Workouts', value: user?.totalWorkouts || 0 },
          { icon: Flame,  color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Cal burned',value: user?.totalCaloriesBurned?.toLocaleString() || 0 },
          { icon: Clock,  color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: 'Minutes',  value: user?.totalMinutesWorked || 0 },
          { icon: Zap,    color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Streak',   value: `${user?.streak || 0}d` },
        ].map(({ icon: Icon, color, bg, label, value }) => (
          <div key={label} className="bg-dark-800 border border-white/5 rounded-xl p-3 text-center">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center mx-auto mb-1.5`}>
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <p className="text-sm font-bold text-white tabular-nums">{value}</p>
            <p className="text-xs text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="space-y-5">
        {/* Personal */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" /> Personal details
          </p>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Full name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Your name" className={inputCls} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'age',    label: 'Age',    unit: 'yrs', icon: User   },
              { key: 'weight', label: 'Weight', unit: 'kg',  icon: Scale  },
              { key: 'height', label: 'Height', unit: 'cm',  icon: Ruler  },
            ].map(({ key, label, unit }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1.5">
                  {label} <span className="text-gray-600">({unit})</span>
                </label>
                <input type="number" value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="—" className={inputCls} />
              </div>
            ))}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Gender</label>
            <div className="flex gap-2">
              {['male', 'female', 'other'].map((g) => (
                <button key={g} type="button" onClick={() => set('gender', g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize border transition-colors ${
                    form.gender === g
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-dark-700 border-white/10 text-gray-400 hover:border-brand-500/50'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" /> Fitness goal
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map(({ value, label }) => (
              <button key={value} onClick={() => set('fitnessGoal', value)}
                className={`py-3 px-3 rounded-xl text-sm border transition-colors text-left ${
                  form.fitnessGoal === value
                    ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                    : 'bg-dark-700 border-white/10 text-gray-400 hover:border-brand-500/40'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity level */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" /> Activity level
          </p>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(({ value, label, sub }) => (
              <button key={value} onClick={() => set('activityLevel', value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${
                  form.activityLevel === value
                    ? 'bg-brand-500/20 border-brand-500'
                    : 'bg-dark-700 border-white/10 hover:border-brand-500/40'
                }`}>
                <div>
                  <p className={`text-sm font-medium ${form.activityLevel === value ? 'text-brand-400' : 'text-white'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
                {form.activityLevel === value && (
                  <div className="w-4 h-4 rounded-full border-2 border-brand-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TDEE estimate */}
        {tdee && (
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Flame className="w-5 h-5 text-brand-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Estimated daily calories (TDEE)</p>
              <p className="text-xs text-gray-400 mt-0.5">
                ~<span className="text-brand-400 font-bold">{tdee}</span> kcal/day based on your profile
              </p>
            </div>
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          {saving
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            : <><Save className="w-5 h-5" /> Save changes</>
          }
        </button>
      </div>
    </div>
  );
}