import type { Decorator, Preview } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import { GlobalStyle } from '@/styles/GlobalStyle'
import { theme } from '@/theme'

const withTheme: Decorator = (Story, context) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Story {...context} />
  </ThemeProvider>
)

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
