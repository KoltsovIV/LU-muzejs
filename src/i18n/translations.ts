const baseTranslations = {
  en: {
    languageLabel: 'English',
    pageTitle: 'Interactive risk map',
    pageSubtitle:
      'Explore 12 workplace risk zones. Tap a marker to learn about ergonomic, environmental and organizational safety tips.',
    loading: 'Loading workspace…',
    loadingData: 'Loading hotspots',
    loadingImage: 'Preparing visual…',
    retry: 'Retry',
    errorLoadingData:
      'We could not load hotspot information. Check your connection and try again.',
    errorLoadingImage:
      'We could not load the illustration. Refresh the page or check your connection.',
    noHotspotSelected: 'Select a hotspot to see the details.',
    close: 'Close',
    continue: 'Continue',
    changeLanguage: 'Change language',
    hotspotsCounter: (count: number) => `${count} interactive hotspots`,
    lastUpdated: (value: string) => `Last updated: ${value}`,
    indicatorLabel: 'Workspace loading progress',
    ariaLiveReady: 'Hotspot data loaded',
    ariaLiveError: 'Failed to load hotspot data',
    ariaLiveLoading: 'Loading hotspot data',
  },
  lv: {
    languageLabel: 'Latviešu',
    pageTitle: 'Interaktīvā risku karte',
    pageSubtitle:
      'Iepazīstiet 12 darba vides risku zonas. Pieskarieties punktam, lai uzzinātu ergonomikas, vides un organizatoriskos drošības padomus.',
    loading: 'Notiek darba vides ielāde…',
    loadingData: 'Ielādējam interaktīvos punktus',
    loadingImage: 'Sagatavojam ilustrāciju…',
    retry: 'Mēģināt vēlreiz',
    errorLoadingData:
      'Neizdevās ielādēt hotspotus. Pārbaudiet savienojumu un mēģiniet atkārtoti.',
    errorLoadingImage:
      'Neizdevās ielādēt ilustrāciju. Atsvaidziniet lapu vai pārbaudiet savienojumu.',
    noHotspotSelected: 'Izvēlieties punktu, lai apskatītu informāciju.',
    close: 'Aizvērt',
    continue: 'Turpināt',
    changeLanguage: 'Mainīt valodu',
    hotspotsCounter: (count: number) => `${count} interaktīvie punkti`,
    lastUpdated: (value: string) => `Pēdējo reizi atjaunots: ${value}`,
    indicatorLabel: 'Darba vietas ielādes progress',
    ariaLiveReady: 'Hotspot dati ielādēti',
    ariaLiveError: 'Hotspotu ielāde neizdevās',
    ariaLiveLoading: 'Notiek hotspotu ielāde',
  },
}

export type SupportedLanguage = keyof typeof baseTranslations
export type TranslationDictionary = (typeof baseTranslations)['en']

export const supportedLanguages: Array<{ code: SupportedLanguage; label: string }> = [
  { code: 'lv', label: baseTranslations.lv.languageLabel },
  { code: 'en', label: baseTranslations.en.languageLabel },
]

export const translations = baseTranslations
