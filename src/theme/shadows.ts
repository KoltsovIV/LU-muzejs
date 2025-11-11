export const shadows = {
  xs: '0 1px 2px rgba(15, 23, 42, 0.12)',
  sm: '0 4px 10px rgba(15, 23, 42, 0.16)',
  md: '0 8px 20px rgba(15, 23, 42, 0.2)',
  lg: '0 16px 40px rgba(15, 23, 42, 0.24)',
} as const

export type Shadows = typeof shadows
