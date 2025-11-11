import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { computeMarkerLayout } from '@/utils/coordinates'
import type { Hotspot } from '@/types/hotspot'

import { VisuallyHidden } from './VisuallyHidden'

type HotspotMarkerProps = {
  hotspot: Hotspot
  containerSize: { width: number; height: number }
  isActive: boolean
  onSelect: (id: string) => void
  modalId: string
}

const severityStyles = {
  low: css`
    background: radial-gradient(
      circle at center,
      ${({ theme }) => theme.colors.primaryMuted} 0%,
      ${({ theme }) => theme.colors.primary} 70%
    );
  `,
  medium: css`
    background: radial-gradient(
      circle at center,
      ${({ theme }) => theme.colors.warning} 0%,
      ${({ theme }) => theme.colors.secondary} 70%
    );
  `,
  high: css`
    background: radial-gradient(
      circle at center,
      ${({ theme }) => theme.colors.danger} 0%,
      ${({ theme }) => theme.colors.secondary} 70%
    );
  `,
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
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.secondary};
  padding: 0;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
  box-shadow: ${({ theme }) => theme.shadows.md};
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

  ${({ $severity }) =>
    $severity
      ? severityStyles[$severity]
      : css`
          background: radial-gradient(
            circle at center,
            ${({ theme }) => theme.colors.primaryMuted} 0%,
            ${({ theme }) => theme.colors.primary} 70%
          );
        `}

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      box-shadow: ${theme.shadows.lg};
      transform: scale(1.06);
    `}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }

  &:hover {
    transform: scale(1.05);
  }
`

const MarkerGlyph = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 60%;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.9)};
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
    const shortLabel = hotspot.shortTitle ?? hotspot.title.slice(0, 3)

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
        <MarkerGlyph $isActive={isActive}>{shortLabel}</MarkerGlyph>
        <VisuallyHidden>{hotspot.title}</VisuallyHidden>
      </MarkerButton>
    )
  },
)

HotspotMarker.displayName = 'HotspotMarker'
