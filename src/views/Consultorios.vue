<template>
  <v-container>
    <h1 class="text-h4">Gestionar Consultorios</h1>
    <v-row class="ma-11">
      <v-col>
        <v-card
          outlined
          class="pa-4 d-flex flex-column justify-center align-center"
        >
          <v-card-title>Agregar Consultorio</v-card-title>
          <v-card-subtitle
            >Agrega un consultorio para gestionar sus turnos</v-card-subtitle
          >
          <v-btn outline color="primary" dark @click="handleCreateConsultorio"
            >+ Agregar Consultorio</v-btn
          >
        </v-card>
      </v-col>
      <v-col class="d-flex flex-column justify-start">
        <v-card
          outlined
          class="pa-4 d-flex flex-column justify-center align-center"
        >
          <v-card-title>Agregar Tratamientos</v-card-title>
          <v-card-subtitle
            >Agrega un tratamiento para gestionar sus turnos</v-card-subtitle
          >
          <v-btn outline color="primary" dark @click="handleCreateConsultorio"
            >+ Agregar Tratamiento</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <v-row class="ma-11"> </v-row>
    <v-row class="ma-11 d-flex justify-lg-space-around">
      <v-col cols="6" md="4">
        <h3>Listado de Consultorios</h3>
        <v-card
          v-for="consultorio in consultorios"
          :key="consultorio.id_consultorio"
          :color="consultorio.color"
          class="mb-2"
          outlined
        >
          <v-card-title class="text-h6">{{ consultorio.nombre }}</v-card-title>
          <v-card-subtitle>
            <div v-if="consultorio.tratamientos.length > 0">
              <div
                v-for="tratamiento in consultorio.tratamientos"
                :key="tratamiento.id_tratamiento"
              >
                {{ tratamiento.nombre }}
                {{ consultorio.color_ }}
              </div>
            </div>
            <div v-else>No hay tratamientos asociados.</div>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6" md="4">
        <h3>Listado de Tratamientos</h3>
        <v-card
          v-for="tratamiento in tipoTratamientos"
          :key="tratamiento.id_tratamiento"
          color="primary"
          outlined
        >
          <v-card-title class="text-h6">{{ tratamiento.nombre }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="dialog"
      scrollable
      width="35vw"
      transition="dialog-transition"
      absolute
      temporary
      right
      height="100vh"
    >
      <span class="font-weight-bold ma-5 text-h5">Agregar Consultorio</span>
      <v-card-text>
        <v-text-field
          v-model="newConsultorio"
          label="Nombre del Consultorio"
        ></v-text-field>
        <v-select
          v-model="selectedTratamiento"
          label="Tratamiento"
          :items="tipoTratamientos"
          item-text="nombre"
          item-value="id_tratamiento"
          outlined
          dense
          required
          @change="onTratamientoSeleccionado"
        />
        <span class="font-weight-bold ma-2 text-h6">Color:</span>
        <div class="d-flex justify-lg-space-around">
          <!-- Botones con colores predefinidos -->
          <v-btn
            v-for="(btnColor, index) in buttonColors"
            :key="index"
            small
            outlined
            :value="btnColor"
            :color="selectedColor === btnColor ? btnColor : '#989898'"
            @click="selectColor(btnColor)"
            class="d-flex justify-center align-center"
            style="padding: 10px 5px; position: relative; overflow: hidden"
            :style="{
              borderColor: selectedColor === btnColor ? btnColor : '#989898',
            }"
          >
            <div
              :style="{
                backgroundColor: btnColor,
                width: '90%',
                height: '60%',
                borderRadius: '0.3rem',
                aspectRatio: '16 / 9',
              }"
            ></div>
          </v-btn>

          <!-- Botón que abre el Color Picker -->
          <v-btn
            small
            outlined
            color="#989898"
            class="d-flex justify-center align-center"
            style="padding: 10px 5px; position: relative; overflow: hidden"
            @click="openColorPicker"
          >
            <v-icon color="#989898">mdi-palette</v-icon>
          </v-btn>

          <!-- Input de tipo color (oculto) -->
          <input
            ref="colorPicker"
            type="color"
            style="display: none"
            @input="selectColor($event.target.value)"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false"
          >Cancelar</v-btn
        >
        <v-btn color="blue darken-1" text @click="createConsultorio"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedColor: null,
      buttonColors: ["#8c57ff", "#0d9394", "#ffb400", "#ff4c51", "#16b1ff"],
      consultorios: [],
      selectedTratamientos: "",
      dialog: false, // Estado para abrir/cerrar el diálogo
      newConsultorio: "", // Nombre del nuevo consultorio
      tipoTratamientos: [],
    };
  },
  methods: {
    onTratamientoSeleccionado(value) {
      console.log("Tratamientos seleccionados:", value);
    },
    selectColor(color) {
      this.selectedColor = color;
    },
    openColorPicker() {
      this.$refs.colorPicker.click();
    },
    async fetchTratamientos() {
      try {
        const response = await axios.get("/tratamientos");
        this.tipoTratamientos = response.data;
        // console.log("Tratamientos cargados:", this.tipoTratamientos);
      } catch (error) {
        console.error("Error fetching tratamientos:", error);
      }
    },
    async fetchConsultoriosyTratamientos() {
      try {
        const response = await axios.get("/consultorios/tratamientos");

        this.consultorios = response.data.map((consultorio) => ({
          id_consultorio: consultorio.id_consultorio,
          nombre: consultorio.nombre_consultorio,
          color: consultorio.color_consultorio,
          tratamientos: consultorio.tratamientos || [],
        }));

        // console.log("Consultorios cargados:", this.consultorios);
      } catch (error) {
        console.error("Error fetching consultorios and tratamientos:", error);
      }
    },
    async createConsultorio() {
      try {
        const response = await axios.post("/consultorios", {
          nombre: this.newConsultorio,
          color: this.selectedColor,
          tratamiento: this.selectedTratamiento,
          // Array de IDs de tratamientos seleccionados
        });
        this.fetchConsultoriosyTratamientos(); // Actualiza la lista de consultorios
        this.dialog = false; // Cierra el diálogo
      } catch (error) {
        console.error("Error al crear el consultorio:", error);
      }
    },

    handleCreateConsultorio() {
      this.dialog = !this.dialog;
    },

    hasConflict(consultorio) {
      const horarios = consultorio.turnos.map((turno) => turno.hora);
      const uniqueHorarios = new Set(horarios);
      return uniqueHorarios.size !== horarios.length;
    },
  },
  mounted() {
    this.fetchConsultoriosyTratamientos();
    // this.fetchTurnos();
    // this.fetchConsultorios();
    this.fetchTratamientos();
  },
};
</script>

<style scoped>
.red {
  color: white;
}
.active-btn {
  border-color: #16b1ff !important;
}
</style>
