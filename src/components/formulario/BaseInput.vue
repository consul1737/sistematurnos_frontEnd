<template>
  <v-text-field
    :label="label"
    :prepend-icon="icon"
    :rules="rules"
    :type="type"
    v-model="modelValue"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },
  emits: ["update:modelValue"],
};
</script>
