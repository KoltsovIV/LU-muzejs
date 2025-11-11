import { screen } from '@testing-library/react'

import { HotspotImage } from '@/components/HotspotImage'
import { renderWithProviders } from '@/testing/renderWithProviders'

describe('HotspotImage', () => {
  it('renders hotspot markers with counter', async () => {
    renderWithProviders(<HotspotImage />)

    const markers = await screen.findAllByRole('button', undefined, {
      timeout: 1000,
    })
    expect(markers.length).toBeGreaterThan(0)
    expect(screen.getByText(/hotspots/i)).toBeInTheDocument()
  })
})
