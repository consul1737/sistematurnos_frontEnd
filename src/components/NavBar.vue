<template>
    <v-navigation-drawer app permanent>
      <v-list>
        <!-- Elemento de menú para Profile -->
        <v-list-item to="/profile">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
  
        <!-- Elemento de menú para Home -->
        <v-list-item to="/home" exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>home</v-list-item-title>
        </v-list-item>
  
        <!-- Elemento de menú para Turnos -->
        <v-list-item to="/turnos">
          <v-list-item-icon>
            <v-icon>mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Turnos</v-list-item-title>
        </v-list-item>

        <v-list-item to="/calendario">
          <v-list-item-icon>
            <v-icon>mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Calendario</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/Pacientes">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Pacientes</v-list-item-title>
        </v-list-item>

        <v-list-item to="/Consultorios">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Consultorios</v-list-item-title>
        </v-list-item>
         
         
        <!-- Elemento de menú para Notificaciones -->
        <v-list-item to="/notifi">
          <v-list-item-icon>
            <v-icon>mdi-bell</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Notificaciones</v-list-item-title>
        </v-list-item>

        <v-list-item to="/generate-qr">
          <v-list-item-icon>
            <v-icon>mdi-bell</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Conexion</v-list-item-title>
        </v-list-item>
  
        <!-- Cerrar Sesión -->
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
    methods: {
      logout() {
        sessionStorage.removeItem('session'); // Remover la sesión
        this.$router.push('/'); // Redirigir al login o a la página principal
      }
    }
  };
  </script>
  