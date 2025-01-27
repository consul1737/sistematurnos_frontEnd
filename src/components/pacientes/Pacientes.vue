<template>
  <v-container position-relative>
    <!-- Título y Botón para Crear Paciente -->
    <v-row>
      <v-toolbar flat>
        <v-toolbar-title>Gestión de Pacientes</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- Botón con signo "+" -->
      </v-toolbar>
    </v-row>

    <!-- Tabla de Pacientes -->
    <v-row position-static>
      <v-data-table
        :headers="headers"
        :items="pacientes"
        class="elevation-1"
        no-data-text="No hay pacientes registrados."
      ></v-data-table>
    </v-row>

    <v-row position-absolute bottom-0 left-0 class="mt-5 mb-5">
      <v-btn
        icon="$vuetify"
        class="ml-2"
        rounded="xl"
        height="50"
        width="50"
        @click="dialog = true"
        style="background-color: #2b81d6; color: white"
        ><v-icon size="30">mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <!-- Formulario para agregar paciente -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar Paciente</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newPaciente.nombre"
              label="Nombre"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="newPaciente.apellido"
              label="Apellido"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="newPaciente.fecha_nacimiento"
              label="Fecha de Nacimiento"
              type="date"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-radio-group
              v-model="newPaciente.genero"
              row
              label="Género"
              :rules="[rules.required]"
            >
              <v-radio label="Masculino" value="M"></v-radio>
              <v-radio label="Femenino" value="F"></v-radio>
            </v-radio-group>
            <v-text-field
              v-model="newPaciente.telefono"
              label="Teléfono"
              type="tel"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="newPaciente.email"
              label="Correo Electrónico"
              type="email"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-textarea
              v-model="newPaciente.direccion"
              label="Dirección"
              :rules="[rules.required]"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="green" text @click="savePaciente">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      valid: true,
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Apellido", value: "apellido" },
        { text: "Fecha de Nacimiento", value: "fecha_nacimiento" },
        { text: "Género", value: "genero" },
        { text: "Teléfono", value: "telefono" },
        { text: "Correo Electrónico", value: "email" },
        { text: "Dirección", value: "direccion" },
      ],
      pacientes: [],
      newPaciente: {
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        genero: "",
        telefono: "",
        email: "",
        direccion: "",
      },
      rules: {
        required: (value) => !!value || "Campo requerido",
      },
    };
  },
  methods: {
    async fetchPacientes() {
      try {
        const response = await axios.get("/Adminpacientes");
        this.pacientes = response.data;
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    },
    async savePaciente() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post(
            "/Adminpacientes",
            this.newPaciente
          );
          this.pacientes.push(response.data);
          this.dialog = false;
          this.newPaciente = {
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
            genero: "",
            telefono: "",
            email: "",
            direccion: "",
          };
        } catch (error) {
          console.error("Error al guardar el paciente:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchPacientes();
  },
};
</script>
