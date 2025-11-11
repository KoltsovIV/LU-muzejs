import type { Meta, StoryObj } from '@storybook/react'

import { InteractiveHotspotPage } from '@/pages/InteractiveHotspotPage'
import { withHotspotProviders } from './decorators'

const meta: Meta<typeof InteractiveHotspotPage> = {
  title: 'Pages/InteractiveHotspotPage',
  component: InteractiveHotspotPage,
  decorators: [withHotspotProviders],
}

export default meta
type Story = StoryObj<typeof InteractiveHotspotPage>

export const Default: Story = {}
