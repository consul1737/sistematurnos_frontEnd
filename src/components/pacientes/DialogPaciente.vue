<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">
        {{ isEdit ? 'Editar Paciente' : 'Agregar Paciente' }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="paciente.nombre"
          label="Nombre"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.apellido"
          label="Apellido"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-radio-group v-model="paciente.genero" row label="Género" :rules="[rules.required]">
          <v-radio label="Masculino" value="M"></v-radio>
          <v-radio label="Femenino" value="F"></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="paciente.telefono"
          label="Teléfono"
          type="tel"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="paciente.email"
          label="Correo Electrónico"
          type="email"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-textarea
          v-model="paciente.direccion"
          label="Dirección"
          :rules="[rules.required]"
          required
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" type="submit" @click="cancelar">Cancelar</v-btn>
      <v-btn color="green" text @click="guardarPaciente">{{
        isEdit ? 'Modificar' : 'Agregar'
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

// Props y eventos
const emit = defineEmits(['paciente-editado', 'paciente-agregado', 'close-dialog'])

const props = defineProps({
  isEdit: Boolean, // Determina si estamos editando o agregando un paciente
  pacienteEditar: Object, // Información del paciente a editar
})

const paciente = ref({
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  direccion: '',
})

// Si estamos en modo edición, cargamos los datos del paciente a editar
watch(
  () => props.pacienteEditar,
  (newPaciente) => {
    if (newPaciente) {
      paciente.value = { ...newPaciente } // Cargar datos del paciente si estamos en modo edición
    } else {
      paciente.value = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        telefono: '',
        email: '',
        direccion: '',
      } // Limpiar formulario si no hay datos (agregar paciente)
    }
  },
  { immediate: true },
)

const valid = ref(true)

const rules = {
  required: (value) => !!value || 'Campo requerido',
}

// Función para cancelar la operación
const cancelar = () => {
  emit('close-dialog') // Emitir evento para cerrar el diálogo
}

const guardarPaciente = () => {
  if (props.isEdit) {
    emit('paciente-editado', paciente.value) // Emitir evento de paciente editado
  } else {
    emit('paciente-agregado', paciente.value) // Emitir evento de paciente agregado
  }
}
</script>
