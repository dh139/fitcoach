import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Loader2 } from 'lucide-react';

const GOALS = [
  { value: 'lose_weight', label: 'Lose weight' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'improve_endurance', label: 'Improve endurance' },
  { value: 'stay_fit', label: 'Stay fit' },
  { value: 'gain_weight', label: 'Gain weight' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', weight: '', height: '',
    gender: 'male', fitnessGoal: 'stay_fit', activityLevel: 'moderate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FitCoach AI</span>
        </div>

        <div className="bg-dark-800 rounded-2xl border border-white/10 p-8">
          {/* Step indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-brand-500' : 'bg-white/10'}`} />
            ))}
          </div>

          <h1 className="text-xl font-semibold text-white mb-1">
            {step === 1 ? 'Create account' : 'Your fitness profile'}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {step === 1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Help us personalise your plan'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Alex Johnson"
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters"
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[['age','Age','yrs'],['weight','Weight','kg'],['height','Height','cm']].map(([name, label, unit]) => (
                    <div key={name}>
                      <label className="block text-sm text-gray-400 mb-1.5">{label} <span className="text-gray-600">({unit})</span></label>
                      <input type="number" name={name} value={form[name]} onChange={handleChange} placeholder="—"
                        className="w-full bg-dark-700 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Gender</label>
                  <div className="flex gap-2">
                    {['male','female','other'].map((g) => (
                      <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize border transition-colors ${form.gender === g ? 'bg-brand-500 border-brand-500 text-white' : 'bg-dark-700 border-white/10 text-gray-400 hover:border-brand-500/50'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fitness goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map(({ value, label }) => (
                      <button key={value} type="button" onClick={() => setForm({ ...form, fitnessGoal: value })}
                        className={`py-2.5 px-3 rounded-xl text-sm border transition-colors text-left ${form.fitnessGoal === value ? 'bg-brand-500/20 border-brand-500 text-brand-500' : 'bg-dark-700 border-white/10 text-gray-400 hover:border-brand-500/50'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 border border-white/10 text-gray-300 font-medium py-3 rounded-xl transition-colors">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : step === 1 ? 'Continue' : 'Create account'}
              </button>
            </div>
          </form>

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}