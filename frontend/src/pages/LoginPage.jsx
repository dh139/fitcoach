import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };
return (
  <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex' }}>
    {/* Left — branding panel (desktop) */}
    <div className="hidden lg:flex" style={{ width: '45%', background: '#0f0f0f', borderRight: '1px solid #1a1a1a', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', background: '#c8f53a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Dumbbell style={{ width: '20px', height: '20px', color: '#0d0d0d' }} />
        </div>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c8f53a' }}>FitCoach AI</span>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#c8f53a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Your AI fitness partner</p>
        <h1 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '800', color: '#fff', lineHeight: '1', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          TRAIN SMARTER.<br />
          <span style={{ color: '#c8f53a' }}>LEVEL UP.</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', maxWidth: '320px', margin: 0 }}>
          Verified workouts, anti-cheat XP, AI coaching, and real leaderboards. Built for people who are serious about progress.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {[['1,500+', 'exercises'], ['100%', 'anti-cheat'], ['AI-powered', 'coaching']].map(([val, lbl]) => (
          <div key={lbl}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#c8f53a', margin: 0 }}>{val}</p>
            <p style={{ fontSize: '11px', color: '#444', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lbl}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Right — login form */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: '#c8f53a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell style={{ width: '20px', height: '20px', color: '#0d0d0d' }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#c8f53a' }}>FitCoach AI</span>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Welcome back</h2>
        <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Sign in to continue your journey</p>

        {error && (
          <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#ff8888', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '7px' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#333' }} />
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '11px 14px 11px 38px', color: '#fff', fontSize: '13px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,245,58,0.4)'}
                onBlur={e  => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '7px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#333' }} />
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
                style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '11px 14px 11px 38px', color: '#fff', fontSize: '13px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,245,58,0.4)'}
                onBlur={e  => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#c8f53a', color: '#0d0d0d', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', transition: 'background 0.15s', opacity: loading ? 0.6 : 1 }}>
            {loading ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#444', marginTop: '20px' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#c8f53a', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  </div>
);
}