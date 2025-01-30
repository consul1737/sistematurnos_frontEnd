<template>
  <v-data-table
    :key="pacientes.length"
    :headers="headers"
    :items="pacientes"
    class="elevation-2"
    no-data-text="No hay pacientes registrados."
  >
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="abrirDialogEditar(item)">mdi-pencil</v-icon>
      <!-- Botón que dispara el diálogo -->
      <v-icon size="small" @click="abrirDialogEliminar(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
  <!-- Dialogo de Confirmación -->
  <v-dialog v-model="dialogVisible" max-width="900">
    <DialogoConfirmacion
      :paciente="pacienteSeleccionado"
      @confirmar="confirmarEliminar"
      @cancelar="cerrarDialog"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { headers } from './constants/headers'
import DialogoConfirmacion from './DialogoConfirmacion.vue'

// Props y eventos
defineProps({
  pacientes: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['abrir-dialog-editar', 'eliminar-paciente'])

// Estados
const dialogVisible = ref(false) // Controla la visibilidad del diálogo
const pacienteSeleccionado = ref(null) // Paciente a eliminar

// Funciones
const abrirDialogEditar = (item) => {
  emit('abrir-dialog-editar', item)
}

const abrirDialogEliminar = (item) => {
  pacienteSeleccionado.value = item // Guardar el paciente seleccionado
  dialogVisible.value = true // Abrir el diálogo
}

const confirmarEliminar = () => {
  if (pacienteSeleccionado.value) {
    emit('eliminar-paciente', pacienteSeleccionado.value.id_paciente) // Emitir evento
  }
  cerrarDialog() // Cerrar el diálogo
}

const cerrarDialog = () => {
  dialogVisible.value = false // Ocultar el diálogo
  pacienteSeleccionado.value = null // Limpiar selección
}
</script>
