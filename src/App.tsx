import { HotspotProvider } from '@/contexts/HotspotContext'
import { I18nProvider } from '@/contexts/I18nContext'
import { InteractiveHotspotPage } from '@/pages/InteractiveHotspotPage'

const App = () => (
  <I18nProvider>
    <HotspotProvider>
      <InteractiveHotspotPage />
    </HotspotProvider>
  </I18nProvider>
)

export default App
