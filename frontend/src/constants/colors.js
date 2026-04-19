// Single source of truth for all brand colors
// Use these instead of hardcoding hex values in components

export const COLORS = {
  // Brand
  lime:          '#c8f53a',
  limeHover:     '#a8d420',
  limeLight:     '#e8ff6a',
  limeDim:       'rgba(200,245,58,0.12)',
  limeBorder:    'rgba(200,245,58,0.2)',

  // Surfaces
  bg:            '#0d0d0d',
  surface1:      '#141414',
  surface2:      '#1a1a1a',
  surface3:      '#222222',
  surface4:      '#2a2a2a',
  surface5:      '#333333',

  // Text
  textPrimary:   '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary:  '#555555',

  // Semantic
  danger:        '#ff4444',
  dangerDim:     'rgba(255,68,68,0.12)',
  dangerBorder:  'rgba(255,68,68,0.25)',

  warn:          '#f59e0b',
  warnDim:       'rgba(245,158,11,0.12)',

  info:          '#3b82f6',
  infoDim:       'rgba(59,130,246,0.12)',

  coach:         '#a855f7',
  coachDim:      'rgba(168,85,247,0.12)',
  coachBorder:   'rgba(168,85,247,0.2)',

  // Levels
  beginner:      '#c8f53a',
  intermediate:  '#60a5fa',
  advanced:      '#c084fc',
  elite:         '#fbbf24',
};

export const LEVEL_STYLES = {
  beginner:     { bg: 'rgba(200,245,58,0.1)',  text: '#c8f53a',  border: 'rgba(200,245,58,0.2)' },
  intermediate: { bg: 'rgba(59,130,246,0.1)',  text: '#60a5fa',  border: 'rgba(59,130,246,0.2)' },
  advanced:     { bg: 'rgba(168,85,247,0.1)',  text: '#c084fc',  border: 'rgba(168,85,247,0.2)' },
  elite:        { bg: 'rgba(245,158,11,0.1)',  text: '#fbbf24',  border: 'rgba(245,158,11,0.2)' },
};

export const BODYPART_COLORS = {
  chest:         { bg: 'rgba(239,68,68,0.12)',   text: '#fca5a5' },
  back:          { bg: 'rgba(59,130,246,0.12)',   text: '#93c5fd' },
  shoulders:     { bg: 'rgba(168,85,247,0.12)',   text: '#d8b4fe' },
  'upper arms':  { bg: 'rgba(249,115,22,0.12)',   text: '#fdba74' },
  'lower arms':  { bg: 'rgba(245,158,11,0.12)',   text: '#fcd34d' },
  'upper legs':  { bg: 'rgba(20,184,166,0.12)',   text: '#5eead4' },
  'lower legs':  { bg: 'rgba(6,182,212,0.12)',    text: '#67e8f9' },
  waist:         { bg: 'rgba(236,72,153,0.12)',   text: '#f9a8d4' },
  cardio:        { bg: 'rgba(200,245,58,0.12)',   text: '#c8f53a' },
};