<template>
  <v-snackbar
    v-model="alert.show"
    :color="alert.type"
    :timeout="timeout"
    class="mt-6 elevation-10"
  >
    {{ alert.message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="closeSnackbar"
        >Cerrar</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    alert: {
      type: Object,
      required: true,
      default: () => ({
        show: false,
        type: "",
        message: "",
      }),
    },
    timeout: {
      type: Number,
      default: 2000,
    },
  },
  methods: {
    closeSnackbar() {
      this.$emit("update:alert", { ...this.alert, show: false });
    },
  },
};
</script>
