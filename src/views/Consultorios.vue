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
          <v-btn outlined color="primary" dark @click="handleCreateConsultorio"
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
          <v-btn outlined color="primary" dark @click="handleCreateConsultorio"
            >+ Agregar Tratamiento</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <
    <v-row class="ma-11 d-flex justify-lg-space-around">
      <v-col cols="6" md="4">
        <h3>Listado de Consultorios</h3>
        <v-hover
          v-for="consultorio in consultorios"
          :key="consultorio.id_consultorio"
          v-slot:default="{ hover }"
        >
          <v-card
            :color="consultorio.color"
            class="mb-2 position-relative"
            outlined
          >
            <!-- Contenido del card -->
            <v-card-title class="text-h6">{{
              consultorio.nombre
            }}</v-card-title>
            <v-card-subtitle>
              <div v-if="consultorio.tratamiento.length > 0">
                <div
                  v-for="tratamiento in consultorio.tratamiento"
                  :key="tratamiento.id_tratamiento"
                >
                  {{ tratamiento.nombre }}
                </div>
              </div>
              <div v-else>No hay tratamientos asociados.</div>
            </v-card-subtitle>
            <!-- Botones que aparecen al pasar el mouse -->
            <div
              class="position-absolute top-0 end-0 pa-2 transition-swing"
              style="z-index: 10"
              :style="{ opacity: hover ? 1 : 0 }"
            >
              <v-btn
                color="#222222"
                icon
                small
                @click="editarConsultorio(consultorio)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                color="#222222"
                icon
                small
                class="ml-2"
                @click="borrarConsultorio(consultorio)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-hover>
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
    <v-dialog
      v-model="dialog"
      scrollable
      width="35vw"
      persistent
      transition="slide-x-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? "Editar Consultorio" : "Agregar Consultorio"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <span class="font-weight-bold ma-2 text-h6"
            >#{{ this.consultorioToEdit.id_consultorio }}</span
          >
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
      </v-card>
    </v-dialog>
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
      selectedTratamiento: "",
      dialog: false, // Estado para abrir/cerrar el diálogo
      isEdit: false,
      newConsultorio: "", // Nombre del nuevo consultorio
      tipoTratamientos: [],
      consultorioToEdit: null,
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
          tratamiento: consultorio.id_tratamiento
            ? [
                {
                  id_tratamiento: consultorio.id_tratamiento,
                  nombre: consultorio.nombre_tratamiento,
                  descripcion: consultorio.descripcion_tratamiento,
                },
              ]
            : [], // Si no hay tratamiento, devuelve un array vacío
        }));
        console.log("Consultorios cargados:", this.consultorios);
      } catch (error) {
        console.error("Error fetching consultorios and tratamientos:", error);
      }
    },
    async createConsultorio() {
      if (this.isEdit) {
        // Modo edición: Actualizar el consultorio existente
        await this.updateConsultorio(this.consultorio);
      } else {
        // Modo creación: Crear un nuevo consultorio
        await this.addConsultorio();
      }
      this.dialog = false; // Cerrar el diálogo
    },
    async addConsultorio() {
      try {
        const response = await axios.post("/consultorios", {
          nombre: this.newConsultorio,
          color: this.selectedColor,
          tratamiento: this.selectedTratamiento, // ID del tratamiento seleccionado
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

    async editarConsultorio(consultorio) {
      this.isEdit = true;
      this.consultorioToEdit = consultorio.id_consultorio; // Guarda el ID del consultorio
      this.dialog = true; // Abre el diálogo
      this.newConsultorio = consultorio.nombre;
      this.selectedColor = consultorio.color;

      // Asigna el ID del tratamiento seleccionado
      if (consultorio.tratamiento.length > 0) {
        this.selectedTratamiento = consultorio.tratamiento[0].id_tratamiento; // Extrae el ID del tratamiento
      } else {
        this.selectedTratamiento = null; // Si no hay tratamiento, asigna null
      }
    },

    async updateConsultorio() {
      try {
        const response = await axios.put(
          `/consultorios/${this.consultorioToEdit}`,
          {
            nombre: this.newConsultorio,
            color: this.selectedColor,
            tratamiento: this.selectedTratamiento, // ID del tratamiento seleccionado
          }
        );
        this.fetchConsultoriosyTratamientos(); // Actualiza la lista de consultorios
      } catch (error) {
        console.error("Error al actualizar el consultorio:", error);
      }
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        // Limpiar datos cuando se cierra el diálogo
        this.newConsultorio = "";
        this.selectedColor = null;
        this.selectedTratamiento = null;
        this.consultorioToEdit = null;
        this.isEdit = false;
      }
    },
  },
  mounted() {
    this.fetchConsultoriosyTratamientos();
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
