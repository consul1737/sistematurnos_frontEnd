<template>
  <v-container>
    <v-row justify="center">
      <v-col md="6" sm="6">
        <v-card>
          <v-card-title>
            {{ user.nombre || "Usuario no disponible" }}
          </v-card-title>
          <v-card-text>
            <h2>{{ user.email || "Correo no disponible" }}</h2>
            <h4>{{ user.telefono || "Teléfono no disponible" }}</h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    user: {
      nombre: "",
      email: "",
      telefono: "", // Aseguramos que el campo telefono esté en el data
    },
  }),
  created() {
    // Intenta obtener los datos del sessionStorage
    const sessionData = sessionStorage.getItem("session");
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        this.user = {
          nombre: parsedData.nombre || "Usuario no disponible",
          email: parsedData.email || "Correo no disponible",
          telefono: parsedData.telefono || "Teléfono no disponible", // Asignación de telefono
        };
      } catch (error) {
        console.error("Error al parsear sessionStorage: ", error);
      }
    } else {
      console.warn("No se encontró información en sessionStorage.");
    }
  },
};
</script>
