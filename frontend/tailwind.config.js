export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand
        lime: {
          DEFAULT: '#c8f53a',
          hover:   '#a8d420',
          light:   '#e8ff6a',
          dim:     'rgba(200,245,58,0.12)',
        },
        // Dark surfaces (replaces old dark-* scale)
        surface: {
          base:    '#0d0d0d',
          1:       '#141414',
          2:       '#1a1a1a',
          3:       '#222222',
          4:       '#2a2a2a',
          5:       '#333333',
        },
        // Semantic
        danger:  '#ff4444',
        warn:    '#f59e0b',
        info:    '#3b82f6',
        coach:   '#a855f7',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal:      '400',
        medium:      '500',
        semibold:    '600',
        bold:        '700',
        extrabold:   '800',
      },
      borderRadius: {
        sm:  '6px',
        md:  '12px',
        lg:  '20px',
        xl:  '28px',
        '2xl': '36px',
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1':      ['32px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2':      ['22px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':      ['16px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      animation: {
        'fade-up':  'fadeUp 0.3s ease forwards',
        'pulse-lime': 'pulseLime 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLime: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,245,58,0)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(200,245,58,0.15)' },
        },
      },
    },
  },
  plugins: [],
};