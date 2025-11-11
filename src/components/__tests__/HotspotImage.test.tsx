import { screen } from '@testing-library/react'

import { HotspotImage } from '@/components/HotspotImage'
import { renderWithProviders } from '@/testing/renderWithProviders'

describe('HotspotImage', () => {
  it('renders hotspot markers', async () => {
    renderWithProviders(<HotspotImage />)

    const markers = await screen.findAllByRole('button', undefined, {
      timeout: 1000,
    })
    expect(markers.length).toBeGreaterThan(0)
  })
})
