<template>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item 
      v-for="(item, i) in menuItems"
      :key="i"
      :to="item.to ? item.to : undefined" 
       @click="item.isLogout ? logout() : null"
      exact
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
import { getMenuItems } from '@/helpers/menuItems.js';

export default {
  name: 'NavBar',
    data() {
    console.log(getMenuItems()[7].onClick);
    return {
      menuItems: getMenuItems()
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem('session'); // Remover la sesión
      this.$router.push('/'); // Redirigir al login o a la página principal
    }
  }
};
</script>
  