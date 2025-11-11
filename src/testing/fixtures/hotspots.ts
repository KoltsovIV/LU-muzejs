import type { Hotspot } from '@/types/hotspot'

export const sampleHotspot: Hotspot = {
  id: 'sample-hotspot',
  title: 'Sample hotspot',
  shortTitle: 'Sample',
  description: 'Demonstrates a mocked hotspot used inside Storybook and automated tests.',
  ariaLabel: 'Open information about the sample hotspot',
  coords: {
    default: {
      anchor: 'center',
      x: 50,
      y: 50,
    },
  },
  shape: {
    type: 'circle',
    radius: 4,
  },
  media: {
    image: '/assets/hotspots/icons/info.svg',
  },
  categories: ['ergonomics'],
  severity: 'medium',
  links: [
    {
      label: 'Internal wiki',
      href: 'https://example.com/wiki',
    },
  ],
  updatedAt: new Date().toISOString(),
}

export const sampleHotspots: Hotspot[] = [
  sampleHotspot,
  {
    ...sampleHotspot,
    id: 'sample-keyboard',
    title: 'Keyboard alignment',
    shortTitle: 'Keyboard',
    description: 'Keep the keyboard centered to avoid twisting the upper body.',
    coords: {
      default: { anchor: 'center', x: 60, y: 60 },
    },
    shape: {
      type: 'rectangle',
      width: 12,
      height: 6,
      borderRadius: 2,
    },
    severity: 'low',
    categories: ['ergonomics'],
  },
  {
    ...sampleHotspot,
    id: 'sample-monitor',
    title: 'Monitor height',
    shortTitle: 'Monitor',
    description: 'Adjust the monitor so that your eyes meet the top third of the screen.',
    coords: {
      default: { anchor: 'center', x: 60, y: 30 },
    },
    shape: {
      type: 'polygon',
      points: [
        { x: -6, y: -6 },
        { x: 6, y: -6 },
        { x: 8, y: 6 },
        { x: -8, y: 6 },
      ],
    },
    severity: 'medium',
    categories: ['ergonomics'],
  },
]
