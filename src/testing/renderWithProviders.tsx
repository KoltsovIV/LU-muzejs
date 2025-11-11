import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'

import { GlobalStyle } from '@/styles/GlobalStyle'
import { theme } from '@/theme'
import { I18nProvider } from '@/contexts/I18nContext'
import { HotspotProvider } from '@/contexts/HotspotContext'
import { sampleHotspots } from './fixtures/hotspots'

type Options = Parameters<typeof render>[1] & {
  withHotspots?: boolean
}

export const renderWithProviders = (
  ui: ReactElement,
  { withHotspots = true, ...options }: Options = {},
) => {
  const initialData = withHotspots
    ? { hotspots: sampleHotspots, updatedAt: '2025-02-11' }
    : undefined

  return render(
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <I18nProvider>
        <HotspotProvider fetchOnMount={Boolean(!initialData)} initialData={initialData}>
          {ui}
        </HotspotProvider>
      </I18nProvider>
    </ThemeProvider>,
    options,
  )
}
