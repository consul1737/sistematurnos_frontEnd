<template>
  <v-container>
    <MyAlerts v-model:alert="alert" :timeout="3000" />
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
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MyAlerts from '../MyAlerts.vue'
import BaseInput from './form/BaseInput.vue'
import { signupFields } from './form/logic/formSingUp'
import axios from 'axios' // Asegúrate de tener axios importado correctamente

// Declaración de los datos reactivamente
const user = ref({
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  direccion: '',
  pais: '',
  password: '',
  rol_id: 2,
})

const fields = signupFields // Los campos definidos en formSingUp.js
const alert = ref({
  show: false,
  type: '',
  message: '',
})

// Método para realizar el registro de usuario
const signup = async () => {
  const form = ref(null)
  const valid = form.value.validate()
  console.log(valid)

  if (!valid) {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Por favor complete todos los campos correctamente.',
    }
    return
  }

  try {
    await axios.post('/signup', user.value)
    form.value.reset()
    // Aquí puedes agregar algo más si el registro es exitoso, como redirigir o mostrar un mensaje
  } catch (err) {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Ocurrió un error en el registro.' + err,
    }
  }
}
</script>
