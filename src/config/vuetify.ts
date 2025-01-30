import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Asegúrate de importar los estilos de Vuetify
import '@mdi/font/css/materialdesignicons.css' // Importar los íconos de Material Design
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Configuración de Vuetify con tema personalizado
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Establece el tema por defecto (puede ser 'light' o 'dark')
    themes: {
      light: {
        // Colores para el tema claro
        colors: {
          primary: '#2a2a2a', // Color primario
          secondary: '#03DAC6', // Color secundario
          background: '#FFFFFF', // Fondo blanco
          surface: '#F5F5F5', // Superficie de los elementos (tarjetas, botones, etc.)
          error: '#B00020', // Color de error
          info: '#2196F3', // Color de info
          success: '#4CAF50', // Color de éxito
          warning: '#FB8C00', // Color de advertencia
          onPrimary: '#FFFFFF', // Color del texto sobre el fondo primario
          onSecondary: '#000000', // Color del texto sobre el fondo secundario
          onBackground: '#000000', // Color del texto sobre el fondo
          onSurface: '#000000', // Color del texto sobre la superficie
        },
        variables: {
          fontFamily: 'Roboto Flex, sans-serif',
        },
      },
      dark: {
        // Colores para el tema oscuro
        colors: {
          primary: '#03DAC6', // Color primario (invertido en tema oscuro)
          secondary: '#6200EA', // Color secundario (invertido en tema oscuro)
          background: '#121212', // Fondo oscuro
          surface: '#333333', // Superficie más oscura
          error: '#CF6679', // Color de error
          info: '#2196F3', // Color de info
          success: '#4CAF50', // Color de éxito
          warning: '#FB8C00', // Color de advertencia
          onPrimary: '#000000', // Color del texto sobre el fondo primario
          onSecondary: '#FFFFFF', // Color del texto sobre el fondo secundario
          onBackground: '#FFFFFF', // Color del texto sobre el fondo
          onSurface: '#FFFFFF', // Color del texto sobre la superficie
        },
        variables: {
          fontFamily: 'Roboto Flex, sans-serif',
        },
      },
    },
  },
})

export default vuetify
