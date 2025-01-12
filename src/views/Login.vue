<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center" md="2" sm="3">
        <v-btn class="primary" @click="suForm = false">SIGN UP</v-btn>
      </v-col>
      <v-col class="text-center" md="2" sm="3">
        <v-btn class="primary" @click="suForm = true">SIGN IN</v-btn>
      </v-col>
    </v-row>

    <!-- Formulario de SIGN UP o SIGN IN  -->
    <v-row justify="center" class="mt-5">
      <v-col md="6" sm="6">
        <component :is="suForm ? 'SingIn' : 'SingUp'"></component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SingUp from "@/components/auth/SingUp.vue";
import SingIn from "@/components/auth/SingIn.vue";

export default {
  components: { SingUp, SingIn },
  data: () => ({
    suForm: true,
  }),

  methods: {
    async logout() {
      try {
        sessionStorage.removeItem("session"); // Elimina la sesión guardada
        this.alert = {
          show: true,
          type: "success",
          message: "Sesión cerrada exitosamente.",
        };
        this.$router.push({ name: "profile" }); // Redirige a la página de perfil
      } catch (error) {
        this.alert = {
          show: true,
          type: "error",
          message: "Error al cerrar la sesión.",
        };
      }
    },
  },
};
</script>
