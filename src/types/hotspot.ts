import type {
  HotspotDataFileSchema,
  HotspotSchema,
  HotspotShapeSchema,
} from '@/schemas/hotspot-schema'

export type HotspotShape = HotspotShapeSchema
export type Hotspot = HotspotSchema
export type HotspotDataFile = HotspotDataFileSchema

export type HotspotResponsiveCoords = Hotspot['coords']
export type HotspotCoords = Hotspot['coords']['default']
export type HotspotAnchor = HotspotCoords['anchor']
export type BreakpointKey = keyof HotspotResponsiveCoords
export type HotspotCategory = Hotspot['categories'][number]
export type HotspotSeverity = NonNullable<Hotspot['severity']>
export type HotspotLink = NonNullable<Hotspot['links']>[number]
export type HotspotMedia = NonNullable<Hotspot['media']>
