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
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="fetchQR"
      >
        Obtener QR
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      qrUrl: null,
      loading: false,
      error: null,
      isFetching: false,
      checkInterval: null,
      codigoPedido: false,
    };
  },

  methods: {
    async fetchQR() {
      if (this.isFetching) return;
      this.codigoPedido = true;
      this.loading = true;
      this.isFetching = true;
      try {
        this.error = null;
        this.qrUrl = null; // Reinicia el QR mientras se genera

        // Genera el código QR
        const response = await axios.get("/generate-qr");
        console.log("Respuesta del servidor:", response.data);
        const data = response.data;

        if (data?.message) {
          this.error = data.message;
          console.log("Mensaje del servidor:", data.message);
          return; // Detiene la ejecución si no hay un QR aún
        }

        if (!data?.qrCode) {
          throw new Error("El servidor no devolvió un código QR válido.");
        }

        this.qrUrl = data.qrCode;
        this.error = null;

        // Inicia la verificación periódica
        if (this.codigoPedido) {
          this.startCheckingStatus();
        }
      } catch (error) {
        console.error("Error al generar el QR:", error);
        this.error = "No se pudo generar el QR. Intenta nuevamente más tarde.";
        this.qrUrl = null;
      } finally {
        this.loading = false;
        this.isFetching = false;
      }
    },

    startCheckingStatus() {
      // Verifica cada 3 segundos si el QR fue leído
      this.checkInterval = setInterval(async () => {
        try {
          const response = await axios.get("/check-qr-status"); // Endpoint para verificar el estado
          const isRead = response.data?.isRead;
          console.log("Respuesta del servidor2 :", response.data);

          if (isRead) {
            // Si el QR fue leído, detén el intervalo
            this.stopCheckingStatus();
            this.error = "El QR fue leído correctamente.";
          }
        } catch (error) {
          console.error("Error al verificar el estado del QR:", error);
          this.error = "Error al verificar el estado. Intenta nuevamente.";
        }
      }, 5000); // Intervalo de 3 segundos
    },

    stopCheckingStatus() {
      // Detiene el intervalo
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    },
  },

  beforeDestroy() {
    // Asegúrate de limpiar el intervalo si el componente se destruye
    this.stopCheckingStatus();
  },
};
</script>
