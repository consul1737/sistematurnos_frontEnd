<template>
  <v-card class="width-full">
    <v-card-title>Generar QR</v-card-title>
    <v-card-text>
      <div v-if="qrUrl">
        <v-img :src="qrUrl" alt="QR Code" max-height="300" max-width="300" />
      </div>
      <div v-else>
        <p v-if="loading">Generando QR...</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else>El QR no está disponible aún.</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="#2E7D32"
        class="text-none text-subtitle-1"
        size="small"
        variant="flat"
        :loading="loading"
        :disabled="loading"
        @click="fetchQR"
        style="color: azure"
      >
        Vincular cuenta de whatsapp
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import axios from '../config/axios'

export default {
  data() {
    return {
      qrUrl: null,
      loading: false,
      error: null,
      isFetching: false,
      checkInterval: null,
    }
  },
  mounted() {
    this.startFetchingQR() // Inicia la actualización periódica al montar el componente
  },

  methods: {
    // Función para empezar a recibir el QR cada 30 segundos
    startFetchingQR() {
      if (this.checkInterval) return // Evita que se inicie múltiples veces

      this.fetchQR()

      this.checkInterval = setInterval(async () => {
        // Solo continúa si no se ha leído el QR
        if (this.error === 'Ya tienes una cuenta asociada con Whatsapp.') {
          this.stopFetchingQR() // Detiene la actualización periódica si el QR fue leído
          return
        }
        await this.fetchQR()
      }, 20000) // 20 segundos
    },

    // Detiene la actualización periódica
    stopFetchingQR() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }
    },
    async fetchQR() {
      this.loading = true
      try {
        this.error = null
        this.qrUrl = null // Reinicia el QR mientras se genera

        // Genera el código QR
        const response = await axios.get('/generate-qr')
        console.log('Respuesta del servidor:', response.data)
        const data = response.data

        if (data?.message) {
          this.error = data.message
          console.log('Mensaje del servidor:', data.message)
          return // Detiene la ejecución si no hay un QR aún
        }

        if (!response.data?.isReady) {
          if (!data?.qrCode) {
            throw new Error('El servidor no devolvió un código QR válido.')
          }

          this.qrUrl = data.qrCode
          this.error = null

          // Inicia la verificación periódica
        } else {
          this.error = 'Ya tienes una cuenta asociada con Whatsapp.'
        }
      } catch (error) {
        console.error('Error al generar el QR:', error)
        this.error = 'No se pudo generar el QR. Intenta nuevamente más tarde.'
        this.qrUrl = null
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
