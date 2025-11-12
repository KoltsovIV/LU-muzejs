import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  supportedLanguages,
  translations,
  type SupportedLanguage,
  type TranslationDictionary,
} from '@/i18n/translations'

const LOCAL_STORAGE_KEY = 'interactive-hotspots:language'

type TranslationKey = keyof TranslationDictionary
type TranslationParams<K extends TranslationKey> = TranslationDictionary[K] extends (
  ...args: infer P
) => string
  ? P
  : []
type TranslationReturn<K extends TranslationKey> = TranslationDictionary[K] extends (
  ...args: infer _P
) => infer R
  ? R
  : TranslationDictionary[K]

type I18nContextValue = {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  supportedLanguages: typeof supportedLanguages
  t: <K extends TranslationKey>(
    key: K,
    ...params: TranslationParams<K>
  ) => TranslationReturn<K>
  dictionary: TranslationDictionary
}

const defaultLanguage: SupportedLanguage = 'lv'

const resolveInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return defaultLanguage
  }

  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
  if (
    stored &&
    (supportedLanguages as Array<{ code: string }>).some(item => item.code === stored)
  ) {
    return stored as SupportedLanguage
  }

  const browserLang = window.navigator.language.slice(0, 2).toLowerCase()
  if (
    (supportedLanguages as Array<{ code: string }>).some(
      item => item.code === browserLang,
    )
  ) {
    return browserLang as SupportedLanguage
  }

  return defaultLanguage
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(resolveInitialLanguage)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LOCAL_STORAGE_KEY, language)
  }, [language])

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang)
  }, [])

  const dictionary = translations[language]

  const t = useCallback(
    <K extends TranslationKey>(
      key: K,
      ...params: TranslationParams<K>
    ): TranslationReturn<K> => {
      const entry = dictionary[key]
      if (typeof entry === 'function') {
        return (entry as (...args: unknown[]) => TranslationReturn<K>)(...params)
      }
      return entry as TranslationReturn<K>
    },
    [dictionary],
  )

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      supportedLanguages,
      t,
      dictionary,
    }),
    [language, setLanguage, t, dictionary],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
