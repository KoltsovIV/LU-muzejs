import { useRef } from 'react'
import styled from 'styled-components'

import { HotspotMarker } from '@/components/HotspotMarker'
import { useElementSize } from '@/hooks/useElementSize'
import { useHotspotContext } from '@/contexts/HotspotContext'

const WorkspaceWrapper = styled.div<{ $busy: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 24px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  isolation: isolate;
  pointer-events: ${({ $busy }) => ($busy ? 'none' : 'auto')};
`

const WorkspaceImage = styled.img<{ $isReady: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ $isReady }) => ($isReady ? 'none' : 'grayscale(0.6) brightness(0.6)')};
  transition: filter 300ms ease;
  pointer-events: none;
  user-select: none;
`

const Overlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 300ms ease;
  pointer-events: none;
`

const MarkerLayer = styled.div`
  position: absolute;
  inset: 0;
`

const ProgressContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 200ms ease;
  backdrop-filter: blur(4px);
`

const ProgressBar = styled.div<{ $progress: number }>`
  width: min(240px, 70%);
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => `${Math.round($progress * 100)}%`};
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primaryMuted} 0%,
      ${({ theme }) => theme.colors.primary} 100%
    );
    transition: width 200ms ease;
  }
`

const LoadingText = styled.span`
  font-size: 0.95rem;
  text-align: center;
`

const IMAGE_SRC = `${import.meta.env.BASE_URL}assets/hotspots/Background.png`

export const HotspotImage = () => {
  const {
    hotspots,
    selectedHotspotId,
    selectHotspot,
    status,
    loadingProgress,
    imageStatus,
  } = useHotspotContext()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const size = useElementSize(containerRef.current)
  const isReady = status === 'ready' && imageStatus === 'loaded'
  const showOverlay = !isReady

  return (
    <WorkspaceWrapper
      ref={containerRef}
      role="presentation"
      aria-busy={!isReady}
      $busy={!isReady}
    >
      <WorkspaceImage
        src={IMAGE_SRC}
        alt=""
        aria-hidden
        draggable={false}
        $isReady={isReady}
      />
      <Overlay $visible={showOverlay} />
      <MarkerLayer>
        {hotspots.map(hotspot => (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            containerSize={size}
            isActive={selectedHotspotId === hotspot.id}
            onSelect={selectHotspot}
            modalId="hotspot-details"
          />
        ))}
      </MarkerLayer>
      <ProgressContainer
        $visible={showOverlay}
        aria-hidden={isReady}
        aria-live="polite"
        aria-label="Workspace loading progress"
      >
        <LoadingText>
          {imageStatus === 'error'
            ? 'Image failed to load'
            : status === 'loading'
              ? 'Loading hotspots'
              : 'Preparing visual…'}
        </LoadingText>
        {imageStatus === 'error' ? null : (
          <ProgressBar $progress={loadingProgress} role="progressbar" />
        )}
      </ProgressContainer>
    </WorkspaceWrapper>
  )
}
