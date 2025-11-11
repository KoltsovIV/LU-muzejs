export const colors = {
  primary: '#1F6FEB',
  primaryMuted: '#A5C8FF',
  secondary: '#FF8A65',
  success: '#2EBD85',
  warning: '#FFB347',
  danger: '#FF5C5C',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#233041',
  border: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  overlay: 'rgba(15, 23, 42, 0.85)',
} as const

export type ColorKey = keyof typeof colors
