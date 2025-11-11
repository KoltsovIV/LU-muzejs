import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HotspotModal } from '@/components/HotspotModal'
import { sampleHotspot } from '@/testing/fixtures/hotspots'
import { renderWithProviders } from '@/testing/renderWithProviders'

describe('HotspotModal', () => {
  it('focuses the close button on open and closes with Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderWithProviders(
      <HotspotModal
        hotspot={sampleHotspot}
        isOpen
        onClose={onClose}
        modalId="hotspot-modal"
        updatedAt="2025-02-11"
      />,
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })
})
