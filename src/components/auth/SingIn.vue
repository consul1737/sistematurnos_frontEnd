<template>
  <v-container>
    <v-card>
      <v-card-title>Sign in</v-card-title>
      <v-card-text>
        <v-form class="ma-3" @submit.prevent="signin" ref="signinForm">
          <!-- Campo Email -->
          <v-text-field
            label="E-mail"
            prepend-icon="mdi-email"
            :rules="emailRules"
            v-model="user.email"
          >
          </v-text-field>

          <!-- Campo Contraseña -->
          <v-text-field
            label="Password"
            prepend-icon="mdi-lock"
            type="password"
            :rules="passwordRules"
            v-model="user.password"
          >
          </v-text-field>

          <v-btn block class="primary mt-3" type="submit">Sign in</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Componente de alerta -->
    <MyAlerts :alert.sync="alert" />
  </v-container>
</template>

<script>
import { nameRules, emailRules, passwordRules } from "@/utils/validationRules";
import MyAlerts from "../MyAlerts.vue";

export default {
  components: { MyAlerts },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      nameRules,
      emailRules,
      passwordRules,
      alert: {
        show: false,
        type: "",
        message: "",
      },
    };
  },
  methods: {
    async signin() {
      let valid = this.$refs.signinForm.validate();
      if (valid) {
        try {
          const res = await this.axios.post("/signin", this.user);

          if (res.data.NotFound) {
            this.alert = {
              show: true,
              type: "error",
              message: "Usuario no encontrado.",
            };
          } else {
            sessionStorage.setItem("session", JSON.stringify(res.data)); // Guardar sesión
            this.$router.push("/home"); // Redirigir al Home
            this.alert = {
              show: true,
              type: "success",
              message: "Bienvenido",
            };
          }
        } catch (error) {
          this.alert = {
            show: true,
            type: "error",
            message:
              error.response?.data?.message || "Ocurrió un error inesperado.",
          };
        }
      } else {
        this.alert = {
          show: true,
          type: "error",
          message: "Por favor complete todos los campos correctamente.",
        };
        console.log(alert);
      }
    },
  },
};
</script>
