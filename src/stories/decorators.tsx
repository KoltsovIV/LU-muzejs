import type { Decorator } from '@storybook/react'
import type { ReactNode } from 'react'

import { HotspotProvider } from '@/contexts/HotspotContext'
import { I18nProvider } from '@/contexts/I18nContext'
import { sampleHotspots } from '@/testing/fixtures/hotspots'

type ProviderProps = {
  children: ReactNode
}

export const Providers = ({ children }: ProviderProps) => (
  <I18nProvider>
    <HotspotProvider
      fetchOnMount={false}
      initialData={{ hotspots: sampleHotspots, updatedAt: '2025-02-11' }}
    >
      {children}
    </HotspotProvider>
  </I18nProvider>
)

// eslint-disable-next-line react-refresh/only-export-components
export const withHotspotProviders: Decorator = (Story, context) => (
  <Providers>
    <Story {...context} />
  </Providers>
)
