import type { Meta, StoryObj } from '@storybook/react'

import { HotspotImage } from '@/components/HotspotImage'
import { withHotspotProviders } from './decorators'

const meta: Meta<typeof HotspotImage> = {
  title: 'Interactive/HotspotImage',
  component: HotspotImage,
  decorators: [withHotspotProviders],
}

export default meta
type Story = StoryObj<typeof HotspotImage>

export const Default: Story = {}
