<template>
  <v-text-field
    :label="label"
    :prepend-icon="icon"
    :rules="rules"
    :type="type"
    :value="modelValue"
    @input="updateModelValue"
    :placeholder="placeholder"
  ></v-text-field>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue'

// Definir las props y sus valores predeterminados
defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  rules: {
    type: Array as PropType<((value: string | number) => string | boolean)[]>,
    default: () => [],
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

// Definir el evento para la actualización del valor del modelo
const emit = defineEmits(['update:modelValue'])

// Emitir el evento de actualización
const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
</script>
