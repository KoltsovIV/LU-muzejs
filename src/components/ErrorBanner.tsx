import styled from 'styled-components'

import { useHotspotContext } from '@/contexts/HotspotContext'
import { useI18n } from '@/contexts/I18nContext'

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 16px;
  background: rgba(255, 92, 92, 0.12);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 92, 92, 0.3);
`

const RetryButton = styled.button`
  align-self: flex-start;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryMuted};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`

export const ErrorBanner = () => {
  const { error, retry } = useHotspotContext()
  const { t } = useI18n()

  if (!error) return null

  return (
    <Banner role="alert">
      <span>{error}</span>
      <RetryButton type="button" onClick={retry}>
        {t('retry')}
      </RetryButton>
    </Banner>
  )
}
