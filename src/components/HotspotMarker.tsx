import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { computeMarkerLayout } from '@/utils/coordinates'
import type { Hotspot } from '@/types/hotspot'

import { VisuallyHidden } from './VisuallyHidden'

type HotspotMarkerProps = {
  hotspot: Hotspot
  containerSize: { width: number; height: number }
  isActive: boolean
  onSelect: (id: string | null) => void
  modalId: string
}

const MarkerButton = styled.button<{
  $isActive: boolean
  $shape: Hotspot['shape']['type']
  $borderRadius?: number
  $clipPath?: string
  $severity?: Hotspot['severity']
}>`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: transparent;
  background: transparent;
  padding: 0;
  transition:
    transform 120ms ease,
    opacity 120ms ease;
  box-shadow: none;
  touch-action: manipulation;

  ${({ $shape, $borderRadius }) =>
    $shape === 'circle'
      ? css`
          border-radius: 9999px;
        `
      : css`
          border-radius: ${$borderRadius ?? 12}px;
        `}

  ${({ $clipPath }) =>
    $clipPath
      ? css`
          clip-path: ${$clipPath};
        `
      : undefined}

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      transform: scale(1.06);
      box-shadow: ${theme.shadows.md};
    `}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:hover {
    transform: scale(1.05);
  }
`

export const HotspotMarker = memo(
  ({ hotspot, containerSize, isActive, onSelect, modalId }: HotspotMarkerProps) => {
    const layout = computeMarkerLayout(hotspot, containerSize)

    const handleClick = useCallback(() => {
      onSelect(isActive ? null : hotspot.id)
    }, [hotspot.id, isActive, onSelect])

    if (!layout) {
      return null
    }

    const { left, top, width, height, clipPath } = layout
    return (
      <MarkerButton
        type="button"
        aria-label={hotspot.ariaLabel}
        aria-controls={modalId}
        aria-expanded={isActive}
        aria-pressed={isActive}
        onClick={handleClick}
        $isActive={isActive}
        $shape={hotspot.shape.type}
        $borderRadius={
          hotspot.shape.type === 'rectangle' ? hotspot.shape.borderRadius : undefined
        }
        $clipPath={clipPath}
        $severity={hotspot.severity}
        style={{
          left,
          top,
          width,
          height,
        }}
      >
        <VisuallyHidden>{hotspot.title}</VisuallyHidden>
      </MarkerButton>
    )
  },
)

HotspotMarker.displayName = 'HotspotMarker'
