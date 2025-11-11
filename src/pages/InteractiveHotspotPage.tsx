import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { useHotspotContext } from '@/contexts/HotspotContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { HotspotImage } from '@/components/HotspotImage'
import { HotspotModal } from '@/components/HotspotModal'
import { ErrorBanner } from '@/components/ErrorBanner'
import { VisuallyHidden } from '@/components/VisuallyHidden'
import { useI18n } from '@/contexts/I18nContext'

const PageWrapper = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    gap: ${({ theme }) => theme.spacing['2xl']};
    padding: ${({ theme }) => theme.spacing['2xl']};
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => `${theme.breakpoints.md}px`}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 2vw + 1rem, 2.4rem);
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 36rem;
  line-height: 1.5;
`

const ContentLayout = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => `${theme.breakpoints.lg}px`}) {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
  }
`

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const SidebarCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const SidebarHeading = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const SidebarDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`

const StatusAnnouncer = styled(VisuallyHidden).attrs({
  role: 'status',
  'aria-live': 'polite',
})``

const modalId = 'hotspot-details'

export const InteractiveHotspotPage = () => {
  const { status, hotspotsMap, selectedHotspotId, selectHotspot, updatedAt } =
    useHotspotContext()
  const { t } = useI18n()

  const selectedHotspot = useMemo(() => {
    if (!selectedHotspotId) return null
    return hotspotsMap.get(selectedHotspotId) ?? null
  }, [hotspotsMap, selectedHotspotId])

  useEffect(() => {
    if (status !== 'ready') {
      return
    }
    // ensure page scroll resets to top on language change or reload
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [status])

  return (
    <PageWrapper>
      <Header>
        <TitleBlock>
          <Title>{t('pageTitle')}</Title>
          <Subtitle>{t('pageSubtitle')}</Subtitle>
        </TitleBlock>
        <LanguageSwitcher />
      </Header>

      <ContentLayout>
        <div>
          <HotspotImage />
        </div>
        <Sidebar aria-live="polite">
          <ErrorBanner />
          {status === 'loading' ? <Subtitle>{t('loadingData')}</Subtitle> : null}
          {status === 'ready' && !selectedHotspot ? (
            <Subtitle>{t('noHotspotSelected')}</Subtitle>
          ) : null}
          {status === 'ready' && selectedHotspot ? (
            <SidebarCard>
              <SidebarHeading>{selectedHotspot.title}</SidebarHeading>
              <SidebarDescription>{selectedHotspot.description}</SidebarDescription>
            </SidebarCard>
          ) : null}
          {status === 'ready' && updatedAt ? (
            <SidebarDescription aria-live="polite">
              {t('lastUpdated', new Date(updatedAt).toLocaleDateString())}
            </SidebarDescription>
          ) : null}
        </Sidebar>
      </ContentLayout>

      <StatusAnnouncer>
        {status === 'loading'
          ? t('ariaLiveLoading')
          : status === 'ready'
            ? t('ariaLiveReady')
            : status === 'error'
              ? t('ariaLiveError')
              : ''}
      </StatusAnnouncer>

      <HotspotModal
        hotspot={selectedHotspot}
        isOpen={Boolean(selectedHotspot)}
        onClose={() => selectHotspot(null)}
        modalId={modalId}
        updatedAt={updatedAt}
      />

      <VisuallyHidden as="div" aria-live="polite">
        {selectedHotspot ? selectedHotspot.title : t('noHotspotSelected')}
      </VisuallyHidden>
    </PageWrapper>
  )
}
