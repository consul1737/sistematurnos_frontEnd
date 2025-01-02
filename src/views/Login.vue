<template>
    <v-container>
      <v-alert v-model="alert.show" :type="alert.type" dismissible>{{ alert.message }}</v-alert>
      <!-- Botones de SIGN UP y SIGN IN -->
      <v-row justify="center">
        <v-col class="text-center" md="2" sm="3">
          <v-btn class="primary" @click="suForm = true">SIGN UP</v-btn>
        </v-col>
        <v-col class="text-center" md="2" sm="3">
          <v-btn class="primary" @click="suForm = false">SIGN IN</v-btn>
        </v-col>
      </v-row>
  
      <!-- Formulario de SIGN UP -->
      <v-row justify="center" class="mt-5">
        <v-col md="6" sm="6">
          <v-card v-if="suForm">
            <v-card-title>Sign Up</v-card-title>
            <v-card-text>
              <v-form class="ma-3" @submit.prevent="signup" ref="signupForm">
                <!-- Campo Nombre -->
                <v-text-field
                  label="Name"
                  prepend-icon="mdi-account"
                  :rules="nameRules"
                  v-model="user.nombre">
                </v-text-field>
  
                <!-- Campo Email -->
                <v-text-field
                  label="E-mail"
                  prepend-icon="mdi-email"
                  :rules="emailRules"
                  v-model="user.email">
                </v-text-field>
  
                <v-text-field
                  label="Telefono"
                  prepend-icon="mdi-phone"
                  v-model="user.telefono">
                </v-text-field>
  
                <v-text-field
                  label="Ciudad"
                  prepend-icon="mdi-city"
                  v-model="user.ciudad">
                </v-text-field>
  
                <v-text-field
                  label="Pais"
                  prepend-icon="mdi-earth"
                  v-model="user.pais">
                </v-text-field>
  
                <!-- Campo Contraseña -->
                <v-text-field
                  label="Password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                  v-model="user.password">
                </v-text-field>
  
                <!-- Opciones de usuario -->
                <v-radio-group
                  v-model="user.rol_id"
                  row
                  :rules="[(v) => !!v || 'Elija un tipo de usuario']">
                  <v-radio label="Usuario" :value="2"></v-radio>
                  <v-radio label="Vendedor" :value="1"></v-radio>
                </v-radio-group>
  
                <v-btn block class="primary mt-3" type="submit">Sign Up</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
  
          <!-- Formulario de SIGN IN -->
          <v-card v-else>
            <v-card-title>Sign in</v-card-title>
            <v-card-text>
              <v-form class="ma-3" @submit.prevent="signin" ref="signinForm">
                <!-- Campo Email -->
                <v-text-field
                  label="E-mail"
                  prepend-icon="mdi-email"
                  :rules="emailRules"
                  v-model="user.email">
                </v-text-field>
  
                <!-- Campo Contraseña -->
                <v-text-field
                  label="Password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                  v-model="user.password">
                </v-text-field>
  
                <v-btn block class="primary mt-3" type="submit">Sign in</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data: () => ({
      alert: { show: false, message: '' },
      // Reglas para los campos
      nameRules: [
        value => !!value || 'Debe colocar el nombre',
        value => (value && value.length >= 5) || 'El nombre debe contener más de 5 caracteres'
      ],
      emailRules: [
        value => !!value || 'Ingrese su E-mail',
        value => /.+@.+\..+/.test(value) || 'El E-mail ingresado no es correcto'
      ],
      passwordRules: [
        value => !!value || 'Debe ingresar su contraseña',
        value => (value && value.length >= 5) || 'La contraseña debe contener más de 5 caracteres'
      ],
      user: {
        nombre: '',
        email: '',
        telefono: '',
        ciudad: '',
        pais: '',
        password: '',
        rol_id: ''
      },
      suForm: true
    }),
  
    methods: {
      async signup() {
        let valid = this.$refs.signupForm.validate();
        if (valid) {
          try {
            const res = await this.axios.post('/signup', this.user);
            this.$refs.signupForm.reset();
            console.log(res);
          } catch (error) {
            this.alert = {
              show: true,
              type: 'error',
              message: 'Ocurrió un error en el registro.'
            };
          }
        }
      },
  
      async signin() {
        let valid = this.$refs.signinForm.validate();
        if (valid) {
          try {
            const res = await this.axios.post('/signin', this.user);
            if (res.data.NotFound) {
              this.alert = {
                show: true,
                type: 'error',
                message: 'Usuario no encontrado.'
              };
            } else {
              sessionStorage.setItem('session', JSON.stringify(res.data)); // Guardar sesión
              this.$router.push('/home'); // Redirigir al Home
              this.alert = {
                show: true,
                type: 'success',
                message: 'Bienvenido'
              };
            }
          } catch (error) {
            this.alert = {
              show: true,
              type: 'error',
              message: error.response?.data?.message || 'Ocurrió un error inesperado.'
            };
          }
        } else {
          this.alert = {
            show: true,
            type: 'error',
            message: 'Por favor complete todos los campos correctamente.'
          };
        }
      },
      async logout() {
      try {
        sessionStorage.removeItem('session'); // Elimina la sesión guardada
        this.alert = {
          show: true,
          type: 'success',
          message: 'Sesión cerrada exitosamente.',
        };
        this.$router.push({ name: 'profile' }); // Redirige a la página de perfil
      } catch (error) {
        this.alert = {
          show: true,
          type: 'error',
          message: 'Error al cerrar la sesión.',
        };
      }
    } 
    }
  };
  </script>
  