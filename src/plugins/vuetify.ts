/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')

const vuetify = createVuetify({
  theme: {
    defaultTheme: colorScheme.matches ? 'dark' : 'light',
    utilities: false,
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})

colorScheme.addEventListener('change', event => {
  vuetify.theme.global.name.value = event.matches ? 'dark' : 'light'
})

export default vuetify
