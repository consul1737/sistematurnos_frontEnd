<template>
  <v-card>
    <v-card-title>Generar QR</v-card-title>
    <v-card-text>
      <div v-if="qrUrl">
        <v-img :src="qrUrl" alt="QR Code" max-height="300" max-width="300" />
      </div>
      <div v-else>
        <p v-if="error">{{ error }}</p>
        <p v-else>El QR no está disponible aún.</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :loading="loading" :disabled="loading" @click="fetchQR">
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
      error: null,
      loading: false,
    };
  },
  methods: {
    async fetchQR() {
      this.loading = true;
      try {
        this.error = null;
        const response = await axios.get("/generate-qr");
        const qrCode = response.data?.qrCode;
        if (!qrCode) {
          throw new Error("El servidor no devolvió un código QR válido.");
        }
        this.qrUrl = qrCode;
      } catch (error) {
        console.error("Error al obtener el QR:", error);
        this.error = "No se pudo generar el QR. Intenta nuevamente más tarde.";
        this.qrUrl = null;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
