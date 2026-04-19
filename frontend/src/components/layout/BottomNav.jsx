import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, Flame, Trophy, Bot,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Home'      },
  { to: '/workout',     icon: Dumbbell,        label: 'Workout'   },
  { to: '/calories',    icon: Flame,           label: 'Calories'  },
  { to: '/leaderboard', icon: Trophy,          label: 'Ranks'     },
  { to: '/coach',       icon: Bot,             label: 'Coach'     },
];

export default function BottomNav() {
return (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 pb-safe"
    style={{ background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid #1a1a1a' }}>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 8px 4px' }}>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '3px',
          padding:        '6px 12px',
          borderRadius:   '12px',
          textDecoration: 'none',
          transition:     'all 0.12s',
          color:          isActive ? '#c8f53a' : '#444',
          minWidth:       '52px',
        })}>
          {({ isActive }) => (
            <>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(200,245,58,0.12)' : 'transparent', transition: 'all 0.12s' }}>
                <Icon style={{ width: '18px', height: '18px' }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.03em' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
}