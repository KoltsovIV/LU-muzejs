import { z } from 'zod'

export const hotspotAnchorSchema = z.enum(['center', 'top-left'])

export const coordsSchema = z.object({
  anchor: hotspotAnchorSchema,
  x: z
    .number({
      required_error: 'coords.x is required',
    })
    .min(0)
    .max(100),
  y: z
    .number({
      required_error: 'coords.y is required',
    })
    .min(0)
    .max(100),
})

export const responsiveCoordsSchema = z
  .object({
    default: coordsSchema,
  })
  .catchall(coordsSchema)

export const hotspotShapeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('circle'),
    radius: z.number().positive(),
  }),
  z.object({
    type: z.literal('rectangle'),
    width: z.number().positive(),
    height: z.number().positive(),
    borderRadius: z.number().min(0).max(50).optional(),
  }),
  z.object({
    type: z.literal('polygon'),
    points: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
        }),
      )
      .min(3),
  }),
])

export const hotspotCategorySchema = z.enum([
  'ergonomics',
  'physical',
  'environment',
  'psychological',
  'organizational',
  'other',
])

export const hotspotMediaSchema = z
  .object({
    image: z.string().min(1).optional(),
    gallery: z.array(z.string().min(1)).min(1).optional(),
  })
  .optional()

export const hotspotLinkSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().url({ message: 'links.href must be a valid URL' }),
  })
  .array()
  .optional()

export const hotspotSeveritySchema = z.enum(['low', 'medium', 'high']).optional()

export const hotspotSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().optional(),
  description: z.string().min(1),
  ariaLabel: z.string().min(1),
  coords: responsiveCoordsSchema,
  shape: hotspotShapeSchema,
  media: hotspotMediaSchema,
  categories: z.array(hotspotCategorySchema).min(1),
  severity: hotspotSeveritySchema,
  links: hotspotLinkSchema,
  updatedAt: z.string().optional(),
})

export const hotspotDataFileSchema = z.object({
  language: z.string().min(2),
  updatedAt: z.string().min(4),
  hotspots: z.array(hotspotSchema).min(12),
})

export type HotspotShapeSchema = z.infer<typeof hotspotShapeSchema>
export type HotspotSchema = z.infer<typeof hotspotSchema>
export type HotspotDataFileSchema = z.infer<typeof hotspotDataFileSchema>
