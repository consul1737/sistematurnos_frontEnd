<template>
  <v-app>
    <!-- Mostrar NavBar solo si hay sesión activa -->
    <NavBar v-if="isAuthenticated" />

    <!-- Contenido principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/sidebar/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      isAuthenticated: !!sessionStorage.getItem("session"), // Verificar autenticación
    };
  },
  watch: {
    // Escuchar cambios de ruta para actualizar autenticación
    $route() {
      this.isAuthenticated = !!sessionStorage.getItem("session");
    },
  },
};
</script>
