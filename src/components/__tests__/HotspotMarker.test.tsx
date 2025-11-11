import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HotspotMarker } from '@/components/HotspotMarker'
import { sampleHotspot } from '@/testing/fixtures/hotspots'
import { renderWithProviders } from '@/testing/renderWithProviders'

describe('HotspotMarker', () => {
  it('toggles aria-expanded state when activated', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()

    renderWithProviders(
      <div style={{ width: 800, height: 600, position: 'relative' }}>
        <HotspotMarker
          hotspot={sampleHotspot}
          containerSize={{ width: 800, height: 600 }}
          isActive={false}
          onSelect={handleSelect}
          modalId="modal"
        />
      </div>,
    )

    const button = screen.getByRole('button', { name: /sample hotspot/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)

    expect(handleSelect).toHaveBeenCalledWith(sampleHotspot.id)
  })
})
