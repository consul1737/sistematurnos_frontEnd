<template>
  <div class="container">
    <h2>Iniciar sesión en WhatsApp</h2>
    <div v-if="!isConnected">
      <input v-model="userId" placeholder="Ingrese un ID de sesión" />
      <button @click="startSession" :disabled="!userId || isLoading">
        {{ isLoading ? "Generando QR..." : "Generar QR" }}
      </button>
    </div>

    <div v-if="qrCode">
      <h3>Escanea el código QR</h3>
      <v-img
        :src="qrCode"
        alt="QR Code"
        max-height="300"
        max-width="300"
        class="mx-auto"
      />
    </div>

    <div v-if="isConnected">
      <p>Sesión {{ userId }} conectada.</p>
      <button @click="resetQr" :disabled="isLoading">Reiniciar cliente</button>
    </div>

    <p v-if="status">{{ status }}</p>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      userId: "",
      qrCode: "",
      status: "",
      socket: null,
      isLoading: false,
      isConnected: false,
    };
  },
  created() {
    this.socket = io("http://localhost:3003");

    this.socket.on("qr", (data) => {
      if (data.sessionId === this.userId) {
        this.qrCode = data.qr;
        this.status = `Escanea el QR para la sesión ${this.userId}`;
        this.isLoading = false;
      }
    });

    // Evento para confirmar que la sesión se ha iniciado correctamente
    this.socket.on("started", (message) => {
      this.status = message;
      this.isConnected = true;
      this.isLoading = false;
      // Se oculta el input una vez se conecta
    });

    // Evento para notificar desconexión
    this.socket.on("stopped", (message) => {
      this.status = message;
      this.isConnected = false;
      this.qrCode = "";
      this.isLoading = false;
    });

    // Puedes definir un evento para error
    this.socket.on("error", (message) => {
      this.status = message;
      this.isLoading = false;
    });
  },
  methods: {
    startSession() {
      if (this.userId) {
        this.isLoading = true;
        this.socket.emit("start-session", this.userId);
      } else {
        this.status = "Por favor, ingrese un ID de sesión.";
      }
    },
    resetQr() {
      if (this.userId) {
        this.isLoading = true;
        this.socket.emit("reset-qr", this.userId);
        this.status = "Generando nuevo QR...";
      }
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}
input {
  padding: 8px;
  margin-right: 10px;
}
button {
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<!-- <template>
  <v-card class="w-full max-w-md mx-auto p-4">
    <v-card-title class="text-h6 text-center">Generar QR</v-card-title>

    <v-card-text class="text-center">
      <div v-if="qrCode">
        <v-img
          :src="qrCode"
          alt="QR Code"
          max-height="300"
          max-width="300"
          class="mx-auto"
        />
      </div>
      <div v-else>
        <p v-if="loading" class="text-green">Generando QR...</p>
        <p v-else-if="status" class="text-red">{{ status }}</p>
        <p v-else>El QR no está disponible aún.</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

export default {
  setup() {
    const qrCode = ref(null);
    const status = ref("");
    const loading = ref(false);
    const socket = io("http://localhost:3003");

    // Obtiene el userId desde sessionStorage
    const session = JSON.parse(sessionStorage.getItem("session"));
    const userId = session?.id;
    console.log("ID del usuario:", userId);

    if (!userId) {
      console.error("No se encontró el userId en la sesión.");
      status.value = "Error: No se encontró el usuario.";
    }

    console.log("Socket ID en el frontend:", socket.id);

    onMounted(() => {
      if (userId) {
        socket.emit("initialize-whatsapp", userId);
        console.log("Socket ID en el frontend:", socket.id);
      }

      console.log("Socket ID en el frontend:", socket.id);

      socket.on("connect", () => {
        console.log("Conectado al servidor de Socket.IO");
        console.log("Socket ID en el frontend:", socket.id);
      });

      socket.onAny((event, ...args) => {
        console.log("Evento recibido:", event, args);
      });

      socket.on("whatsapp-qr", (data) => {
        console.log("QR recibido:", data.qrCode);
        qrCode.value = data.qrCode;
        loading.value = false;
      });
      socket.on("whatsapp-ready", (data) => {
        console.log("WhatsApp inicializado para el usuario:", data.userId);
        status.value = "WhatsApp inicializado";
      });

      socket.on("whatsapp-error", (data) => {
        console.error("Error:", data.error);
        status.value = "Error: " + data.error;
        loading.value = false;
      });
    });

    onBeforeUnmount(() => {
      console.log("Desconectando socket...");
      socket.disconnect();
    });

    return { qrCode, status, loading };
  },
};
</script> -->

<!-- <script>
// import axios from "axios";
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: io("http://localhost:3003"),
      userId: userId,
      qrUrl: null,
      // loading: false,
      // error: null,
      // isFetching: false,
      // checkInterval: null,
    };
  },
  // mounted() {
  //   this.startFetchingQR(); // Inicia la actualización periódica al montar el componente
  // },

  methods: {
    // // Función para empezar a recibir el QR cada 30 segundos
    // startFetchingQR() {
    //   if (this.checkInterval) return; // Evita que se inicie múltiples veces
    //   this.fetchQR();
    //   this.checkInterval = setInterval(async () => {
    //     // Solo continúa si no se ha leído el QR
    //     if (this.error === "Ya tienes una cuenta asociada con Whatsapp.") {
    //       this.stopFetchingQR(); // Detiene la actualización periódica si el QR fue leído
    //       return;
    //     }
    //     await this.fetchQR();
    //   }, 20000); // 20 segundos
    // },
    // // Detiene la actualización periódica
    // stopFetchingQR() {
    //   if (this.checkInterval) {
    //     clearInterval(this.checkInterval);
    //     this.checkInterval = null;
    //   }
    // },
    // async fetchQR() {
    //   this.loading = true;
    //   try {
    //     this.error = null;
    //     this.qrUrl = null; // Reinicia el QR mientras se genera
    //     // Obtén el ID del usuario desde sessionStorage
    //     const session = JSON.parse(sessionStorage.getItem("session"));
    //     const userId = session?.id;
    //     if (!userId) {
    //       throw new Error("No se encontró el ID del usuario en la sesión.");
    //     }
    //     // Genera el código QR
    //     const response = await axios.get("/generate-qr", {
    //       params: { userId },
    //     });
    //     console.log("Respuesta del servidor:", response.data);
    //     const data = response.data;
    //     if (data?.message) {
    //       this.error = data.message;
    //       console.log("Mensaje del servidor:", data.message);
    //       return; // Detiene la ejecución si no hay un QR aún
    //     }
    //     if (!response.data?.isReady) {
    //       if (!data?.qrCode) {
    //         throw new Error("El servidor no devolvió un código QR válido.");
    //       }
    //       this.qrUrl = data.qrCode;
    //       this.error = null;
    //       // Inicia la verificación periódica
    //     } else {
    //       this.error = "Ya tienes una cuenta asociada con Whatsapp.";
    //     }
    //   } catch (error) {
    //     console.error("Error al generar el QR:", error);
    //     this.error = "No se pudo generar el QR. Intenta nuevamente más tarde.";
    //     this.qrUrl = null;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
  },
};
</script> -->
