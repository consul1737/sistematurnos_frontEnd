<template>
  <v-container>
    <v-card>
      <v-card-title>Sign Up</v-card-title>
      <v-card-text>
        <v-form class="ma-3" @submit.prevent="signup" ref="signupForm">
          <!-- Campo Nombre -->
          <BaseInput
            v-for="(field, index) in fields"
            :key="index"
            v-model="user[field.name]"
            :label="field.label"
            :icon="field.icon"
            :rules="field.rules"
            :type="field.type"
          />
          <!-- Opciones de usuario -->
          <v-radio-group
            v-model="user.rol_id"
            row
            :rules="[(v) => !!v || 'Elija un tipo de usuario']"
          >
            <v-radio label="Usuario" :value="2"></v-radio>
            <v-radio label="Vendedor" :value="1"></v-radio>
          </v-radio-group>

          <v-btn block class="primary mt-3" type="submit">Sign Up</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <MyAlerts :alert.sync="alert" />
  </v-container>
</template>

<script>
// import { nameRules, emailRules, passwordRules } from "@/utils/validationRules";
import MyAlerts from "../MyAlerts.vue";
import BaseInput from "./formulario/BaseInput.vue";
import { signupFields } from "./formulario/logic/formSingUp";

export default {
  components: { MyAlerts, BaseInput },
  data() {
    return {
      user: {
        nombre: "",
        email: "",
        telefono: "",
        ciudad: "",
        direccion: "",
        pais: "",
        password: "",
        rol_id: 2,
      },
      fields: signupFields,
      alert: {
        show: false,
        type: "",
        message: "",
      },
    };
  },
  methods: {
    async signup() {
      let valid = this.$refs.signupForm.validate();
      console.log(valid);

      if (!valid) {
        this.alert = {
          show: true,
          type: "error",
          message: "Por favor complete todos los campos correctamente.",
        };
        return; // Detén la ejecución si no es válido
      }
      if (valid) {
        try {
          const res = await this.axios.post("/signup", this.user);
          this.$refs.signupForm.reset();
          //   console.log(res);
        } catch (error) {
          this.alert = {
            show: true,
            type: "error",
            message: "Ocurrió un error en el registro.",
          };
        }
      }
    },
  },
};
</script>
