<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center btn-btn" md="2" sm="3">
        <v-btn class="primary" @click="suForm = false">SIGN UP</v-btn>
      </v-col>
      <v-col class="text-center" md="2" sm="3">
        <v-btn class="primary" @click="suForm = true">SIGN IN</v-btn>
      </v-col>
    </v-row>

    <!-- Formulario de SIGN UP o SIGN IN  -->
    <v-row justify="center" class="mt-5">
      <v-col md="6" sm="6">
        <component :is="suForm ? SingIn : SingUp"></component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'
import SingUp from '../components/auth/SingUp.vue'
import SingIn from '../components/auth/SingIn.vue'

const suForm: Ref<boolean> = ref(true)
</script>

<style scoped></style>
