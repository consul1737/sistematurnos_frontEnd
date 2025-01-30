<template>
  <v-container>
    <MyAlerts v-model:alert="alert" :timeout="3000" />

    <v-card>
      <v-card-title>Sign in</v-card-title>
      <v-card-text>
        <v-form
          class="d-flex flex-column h-50"
          ref="signinForm"
          @submit.prevent="signin"
          lazy-validation
        >
          <!-- Campo Email -->
          <v-text-field
            variant="outlined"
            clearable
            label="E-mail"
            density="compact"
            :rules="emailRules"
            v-model="user.email"
          />

          <!-- Campo Contraseña -->
          <v-text-field
            v-model="user.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            :rules="passwordRules"
            density="compact"
            label="Password"
            variant="outlined"
            @click:append-inner="visible = !visible"
          />

          <v-btn block class="primary mt-3" type="submit">Sign in</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Componente de alerta -->
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { emailRules, passwordRules } from '../../utils/validationRules'
import MyAlerts from '../MyAlerts.vue'
import axiosInstance from '../../config/axios'
import { useAuth } from '../../composables/useAuth.js'
import { useRouter } from 'vue-router'

// Importar las interfaces de autenticación
import { User, Alert } from '../auth/interfaces/authInterfaces'

const visible = ref(false)

// Referencias a la forma y datos del usuario
const signinForm = ref(null)
const user = ref<User>({
  email: '',
  password: '',
})
const alert = ref<Alert>({
  show: false,
  type: 'info',
  message: '',
})

const { login } = useAuth()
const router = useRouter() // Instancia del router para la redirección

// Método de inicio de sesión
const signin = async () => {
  const valid = signinForm.value?.validate() // Validación del formulario
  if (valid) {
    try {
      const res = await axiosInstance.post('/signin', user.value)

      if (res.data.NotFound) {
        alert.value = {
          show: true,
          type: 'error',
          message: 'Usuario no encontrado.',
        }
      } else {
        console.log(res.data)
        // Llamo al login
        login(res.data)

        router.push('/home')
        alert.value = {
          show: true,
          type: 'success',
          message: 'Bienvenido',
        }
      }
    } catch (error) {
      alert.value = {
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Ocurrió un error inesperado.',
      }
    }
  } else {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Por favor complete todos los campos correctamente.',
    }
    console.log(alert.value)
  }
}
</script>
