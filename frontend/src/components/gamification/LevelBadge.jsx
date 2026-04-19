import { LEVEL_STYLES } from '../../constants/colors';

export default function LevelBadge({ level, size = 'md' }) {
  const s = LEVEL_STYLES[level] || LEVEL_STYLES.beginner;
  const sizes = {
    sm: { padding: '2px 8px',  fontSize: '10px', gap: '4px', dotSize: '5px' },
    md: { padding: '4px 10px', fontSize: '11px', gap: '5px', dotSize: '6px' },
    lg: { padding: '6px 14px', fontSize: '13px', gap: '6px', dotSize: '7px' },
  };
  const sz = sizes[size] || sizes.md;

  return (
    <span style={{
      display:      'inline-flex',
      alignItems:   'center',
      gap:          sz.gap,
      padding:      sz.padding,
      borderRadius: '20px',
      fontSize:     sz.fontSize,
      fontWeight:   '600',
      letterSpacing: '0.04em',
      background:   s.bg,
      color:        s.text,
      border:       `1px solid ${s.border}`,
      textTransform: 'capitalize',
    }}>
      <span style={{ width: sz.dotSize, height: sz.dotSize, borderRadius: '50%', background: s.text, display: 'inline-block' }} />
      {level}
    </span>
  );
}