import { breakpoints } from './breakpoints'
import { colors } from './colors'
import { shadows } from './shadows'
import { spacing } from './spacing'
import { typography } from './typography'

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  breakpoints,
} as const

export type AppTheme = typeof theme
