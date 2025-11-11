import type {
  BreakpointKey,
  Hotspot,
  HotspotCoords,
  HotspotResponsiveCoords,
} from '@/types/hotspot'

import type { Size } from '@/hooks/useElementSize'

const breakpointSteps: Array<{ key: BreakpointKey; minWidth: number }> = [
  { key: 'xl', minWidth: 1280 },
  { key: 'lg', minWidth: 1024 },
  { key: 'md', minWidth: 768 },
  { key: 'sm', minWidth: 480 },
  { key: 'default', minWidth: 0 },
]

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const resolveResponsiveCoords = (
  coords: HotspotResponsiveCoords,
  containerWidth: number,
): HotspotCoords => {
  for (const step of breakpointSteps) {
    if (containerWidth >= step.minWidth && coords[step.key]) {
      return coords[step.key]!
    }
  }
  return coords.default
}

export type MarkerLayout = {
  left: number
  top: number
  width: number
  height: number
  clipPath?: string
}

const toPixels = (percent: number, total: number) => (percent / 100) * total

export const mapHotspotCoordsToPixels = (
  coords: HotspotResponsiveCoords,
  containerSize: Size,
) => {
  const resolved = resolveResponsiveCoords(coords, containerSize.width)
  const x = toPixels(clamp(resolved.x, 0, 100), containerSize.width)
  const y = toPixels(clamp(resolved.y, 0, 100), containerSize.height)
  return { x, y, anchor: resolved.anchor }
}

export const recalcCoordsForAspectRatio = (
  coords: HotspotResponsiveCoords,
  originalSize: Size,
  nextSize: Size,
) => {
  const resolved = resolveResponsiveCoords(coords, originalSize.width)
  const scaleX = nextSize.width / originalSize.width
  const scaleY = nextSize.height / originalSize.height

  return {
    anchor: resolved.anchor,
    x: clamp(resolved.x * scaleX, 0, 100),
    y: clamp(resolved.y * scaleY, 0, 100),
  }
}

export const computeMarkerLayout = (
  hotspot: Hotspot,
  containerSize: Size,
): MarkerLayout | null => {
  const { width: containerWidth, height: containerHeight } = containerSize
  if (containerWidth === 0 || containerHeight === 0) {
    return null
  }

  const resolvedCoords = resolveResponsiveCoords(hotspot.coords, containerWidth)
  const base = mapHotspotCoordsToPixels(hotspot.coords, containerSize)
  const baseX = base.x
  const baseY = base.y

  switch (hotspot.shape.type) {
    case 'circle': {
      const radiusPx = toPixels(hotspot.shape.radius, containerWidth)
      const size = Math.max(radiusPx * 2, 16)
      const left = resolvedCoords.anchor === 'center' ? baseX - radiusPx : baseX
      const top = resolvedCoords.anchor === 'center' ? baseY - radiusPx : baseY
      return { left, top, width: size, height: size }
    }
    case 'rectangle': {
      const width = Math.max(toPixels(hotspot.shape.width, containerWidth), 16)
      const height = Math.max(toPixels(hotspot.shape.height, containerHeight), 16)
      const left = resolvedCoords.anchor === 'center' ? baseX - width / 2 : baseX
      const top = resolvedCoords.anchor === 'center' ? baseY - height / 2 : baseY
      return { left, top, width, height }
    }
    case 'polygon': {
      const absolutePoints = hotspot.shape.points.map(point => ({
        x: baseX + toPixels(point.x, containerWidth),
        y: baseY + toPixels(point.y, containerHeight),
      }))
      const xs = absolutePoints.map(point => point.x)
      const ys = absolutePoints.map(point => point.y)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)
      const width = Math.max(maxX - minX, 16)
      const height = Math.max(maxY - minY, 16)
      const clipPath = absolutePoints
        .map(point => {
          const relativeX = ((point.x - minX) / width) * 100
          const relativeY = ((point.y - minY) / height) * 100
          return `${relativeX.toFixed(2)}% ${relativeY.toFixed(2)}%`
        })
        .join(', ')
      return { left: minX, top: minY, width, height, clipPath: `polygon(${clipPath})` }
    }
    default:
      return null
  }
}
