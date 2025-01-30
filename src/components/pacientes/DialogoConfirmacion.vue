<template>
  <v-card>
    <v-card-title class="text-h5">
      Estas seguro de eliminar a {{ paciente.nombre }} con sus turnos ?
    </v-card-title>
    <v-card-actions>
      <v-btn text @click="confirmar"> Sí </v-btn>
      <v-btn text @click="cancelar"> No </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const { paciente } = defineProps(['paciente'])
const emit = defineEmits(['confirmar', 'cancelar'])

const confirmar = () => {
  emit('confirmar')
}

const cancelar = () => {
  emit('cancelar')
}
</script>
