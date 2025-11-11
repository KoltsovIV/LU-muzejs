export const typography = {
  fontFamily: `'Inter', 'Roboto', 'Segoe UI', sans-serif`,
  fontSizeBase: '16px',
  headings: {
    h1: { size: '2rem', lineHeight: 1.2, weight: 700 },
    h2: { size: '1.5rem', lineHeight: 1.3, weight: 600 },
    h3: { size: '1.25rem', lineHeight: 1.35, weight: 600 },
  },
  body: {
    regular: { size: '1rem', lineHeight: 1.5, weight: 400 },
    small: { size: '0.875rem', lineHeight: 1.45, weight: 400 },
  },
} as const

export type Typography = typeof typography
