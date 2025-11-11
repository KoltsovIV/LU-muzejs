import styled from 'styled-components'

import { useI18n } from '@/contexts/I18nContext'

const SwitcherWrapper = styled.div`
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  gap: 0.25rem;
`

const SwitchButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 180ms ease,
    color 180ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryMuted};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`

export const LanguageSwitcher = () => {
  const { language, setLanguage, supportedLanguages, t } = useI18n()

  return (
    <SwitcherWrapper role="group" aria-label={t('changeLanguage')}>
      {supportedLanguages.map(item => (
        <SwitchButton
          key={item.code}
          type="button"
          $active={language === item.code}
          onClick={() => {
            if (language !== item.code) {
              setLanguage(item.code)
            }
          }}
        >
          {item.label}
        </SwitchButton>
      ))}
    </SwitcherWrapper>
  )
}
