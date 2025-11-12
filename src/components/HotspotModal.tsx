import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import styled from 'styled-components'

import type { Hotspot } from '@/types/hotspot'
import { useI18n } from '@/contexts/I18nContext'

type HotspotModalProps = {
  hotspot: Hotspot | null
  isOpen: boolean
  onClose: () => void
  modalId: string
  updatedAt?: string
}

const DialogOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 200ms ease;

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

const DialogContainer = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: min(880px, 100%);
  max-height: calc(100vh - 2 * ${({ theme }) => theme.spacing.lg});
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 24px 24px 0 0;
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0%' : '8%')});
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition:
    transform 240ms ease,
    opacity 240ms ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    border-radius: 24px;
  }
`

const DialogBody = styled.div`
  padding: ${({ theme }) =>
    `${theme.spacing.sm} ${theme.spacing.lg} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    flex-direction: row;
    align-items: flex-start;
  }
`

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};
`

const CategoryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

const CategoryTag = styled.li`
  padding: 0.35rem 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const LinkList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  list-style: none;
`

const LinkItem = styled.li`
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
      outline: none;
    }
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.25);
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

const ScrollArea = styled.div`
  overflow-y: auto;
  max-height: 100%;
`

const trapFocus = (event: ReactKeyboardEvent<HTMLElement>, modal: HTMLElement) => {
  if (event.key !== 'Tab') {
    return
  }

  const focusables = modal.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
  )

  if (focusables.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
  } else if (document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

export const HotspotModal = ({
  hotspot,
  isOpen,
  onClose,
  modalId,
  updatedAt,
}: HotspotModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const { t } = useI18n()

  const close = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const dialog = dialogRef.current
    const previousActive = document.activeElement as HTMLElement | null

    const focusCloseButton = () => {
      const closeBtn = dialog?.querySelector<HTMLButtonElement>('button[data-close]')
      closeBtn?.focus()
    }

    focusCloseButton()

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown)
      previousActive?.focus()
    }
  }, [isOpen, close])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!dialogRef.current) return
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      trapFocus(event, dialogRef.current)
    },
    [close],
  )

  const metaLine = useMemo(() => {
    if (!hotspot?.categories?.length) return ''
    return hotspot.categories.join(' · ')
  }, [hotspot])

  return (
    <DialogOverlay
      role="presentation"
      aria-hidden={!isOpen}
      $isOpen={isOpen}
      onClick={close}
    >
      <DialogContainer
        id={modalId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        aria-describedby={`${modalId}-description`}
        $isOpen={isOpen}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        onClick={event => event.stopPropagation()}
      >
        <CloseButton type="button" onClick={close} data-close aria-label={t('close')}>
          ×
        </CloseButton>
        <ScrollArea>
          <DialogBody id={`${modalId}-description`}>
            <div>
              <ImagePreview src={DETAIL_IMAGE_PATH} alt={hotspot?.title ?? ''} />
            </div>
            <DetailContent>
              <HeadingStack>
                {hotspot?.severity ? (
                  <SeverityPill $tone={hotspot.severity}>{hotspot.severity}</SeverityPill>
                ) : null}
                <DetailTitle id={`${modalId}-title`}>{hotspot?.title ?? ''}</DetailTitle>
                {metaLine ? <MetaLine>{metaLine}</MetaLine> : null}
                {updatedAt ? <MetaLine>{t('lastUpdated', updatedAt)}</MetaLine> : null}
              </HeadingStack>
              <Description>{hotspot?.description ?? t('noHotspotSelected')}</Description>
              {hotspot?.categories?.length ? (
                <CategoryList>
                  {hotspot.categories.map(category => (
                    <CategoryTag key={category}>{category}</CategoryTag>
                  ))}
                </CategoryList>
              ) : null}
              {hotspot?.links && hotspot.links.length > 0 ? (
                <LinkSection links={hotspot.links} />
              ) : null}
            </DetailContent>
          </DialogBody>
        </ScrollArea>
      </DialogContainer>
    </DialogOverlay>
  )
}

const LinkSection = ({ links }: { links: NonNullable<Hotspot['links']> }) => {
  const { t } = useI18n()
  return (
    <section aria-label={t('continue')}>
      <LinkList>
        {links.map(link => (
          <LinkItem key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </LinkItem>
        ))}
      </LinkList>
    </section>
  )
}

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    flex: 1;
  }
`

const HeadingStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const SeverityPill = styled.span<{ $tone?: Hotspot['severity'] }>`
  align-self: flex-start;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme, $tone }) => {
    if ($tone === 'high') return theme.colors.danger
    if ($tone === 'medium') return theme.colors.warning
    if ($tone === 'low') return theme.colors.success
    return theme.colors.textMuted
  }};
`

const DetailTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 600;
`

const MetaLine = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const ImagePreview = styled.img`
  width: 100%;
  max-width: 320px;
  border-radius: 20px;
  border: none;
  display: block;
  flex-shrink: 0;
`

const DETAIL_IMAGE_PATH = '/assets/hotspots/.jne_itme.png'
