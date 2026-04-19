import LevelBadge from './LevelBadge';
import { Zap } from 'lucide-react';
export default function XpBar({ xp, level, progress }) {
  const { progressPct, xpToNext, next } = progress;
  const LEVEL_COLORS = {
    beginner: '#c8f53a', intermediate: '#60a5fa',
    advanced: '#c084fc', elite: '#fbbf24',
  };
  const color = LEVEL_COLORS[level] || '#c8f53a';

  return (
    <div style={{ background: '#141414', border: '1px solid rgba(200,245,58,0.15)', borderRadius: '20px', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(200,245,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: '18px', height: '18px', color: '#c8f53a' }} />
          </div>
          <div>
            <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Total XP</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {xp.toLocaleString()}
            </p>
          </div>
        </div>
        <LevelBadge level={level} size="md" />
      </div>

      {/* Bar */}
      <div style={{ height: '5px', background: '#1e1e1e', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%', borderRadius: '3px',
          width: `${progressPct}%`,
          background: color,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '7px' }}>
        <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>{progressPct}% to {next?.name || 'max'}</p>
        {next ? (
          <p style={{ fontSize: '11px', margin: 0 }}>
            <span style={{ color: '#fff', fontWeight: '600' }}>{xpToNext.toLocaleString()} XP</span>
            <span style={{ color: '#555' }}> needed</span>
          </p>
        ) : (
          <p style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600', margin: 0 }}>Max level!</p>
        )}
      </div>
    </div>
  );
}