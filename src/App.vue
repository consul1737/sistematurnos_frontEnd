<template>
  <v-app theme="light">
    <!-- Mostrar NavBar solo si hay sesión activa -->
    <NavBar v-if="isAuthenticated" />

    <!-- Contenido principal -->
    <v-main>
      <v-container>
        <transition name="fade">
          <router-view />
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import NavBar from './components/sidebar/NavBar.vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<style>
body {
  font-family: 'Roboto Flex', sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
