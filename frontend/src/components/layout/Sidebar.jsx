import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LevelBadge from '../gamification/LevelBadge';
import {
  LayoutDashboard, Dumbbell, BookOpen, Flame,
  BarChart2, Trophy, Bot, LogOut, User, Settings,
  Swords,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/workout',      icon: Dumbbell,        label: 'Workout'     },
  { to: '/exercises',    icon: BookOpen,        label: 'Exercises'   },
  { to: '/calories',     icon: Flame,           label: 'Calories'    },
  { to: '/reports',      icon: BarChart2,       label: 'Reports'     },
  { to: '/leaderboard',  icon: Trophy,          label: 'Leaderboard' },
  { to: '/coach',        icon: Bot,             label: 'AI Coach'    },
  { to: '/challenges', icon: Trophy,  label: 'Challenges' },
{ to: '/rivals',     icon: Swords,  label: 'Rivals'     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  return (
  <aside className="hidden lg:flex flex-col w-56 h-screen fixed left-0 top-0 z-30"
    style={{ background: '#0d0d0d', borderRight: '1px solid #1a1a1a' }}>

    {/* Logo */}
    <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', background: '#c8f53a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Dumbbell style={{ width: '18px', height: '18px', color: '#0d0d0d' }} />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#c8f53a', letterSpacing: '-0.01em' }}>FitCoach AI</span>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          padding:      '9px 10px',
          borderRadius: '10px',
          fontSize:     '13px',
          fontWeight:   '500',
          textDecoration: 'none',
          transition:   'all 0.12s',
          background:   isActive ? 'rgba(200,245,58,0.1)' : 'transparent',
          color:        isActive ? '#c8f53a' : '#666',
          border:       isActive ? '1px solid rgba(200,245,58,0.15)' : '1px solid transparent',
        })}>
          <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* User */}
    <div style={{ padding: '12px 8px', borderTop: '1px solid #1a1a1a' }}>
      <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.12s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#c8f53a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: '700', color: '#0d0d0d' }}>
          {user?.name?.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#fff', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
          <LevelBadge level={user?.level || 'beginner'} size="sm" />
        </div>
      </NavLink>
      <button onClick={() => { logout(); navigate('/login'); }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#555', transition: 'all 0.12s', marginTop: '2px' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,68,68,0.08)'; e.currentTarget.style.color = '#ff8888'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; }}>
        <LogOut style={{ width: '14px', height: '14px' }} /> Sign out
      </button>
    </div>
  </aside>
);
}