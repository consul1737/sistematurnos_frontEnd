<template>
  <v-container>
    <h1 class="text-h4">Gestionar Consultorios</h1>
    <v-row class="ma-11">
      <!--agregar consultorios-->
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
      <!--agregar tratamientos-->
      <v-col class="d-flex flex-column justify-start">
        <v-card
          outlined
          class="pa-4 d-flex flex-column justify-center align-center"
        >
          <v-card-title>Agregar Tratamientos</v-card-title>
          <v-card-subtitle
            >Agrega un tratamiento para gestionar sus turnos</v-card-subtitle
          >
          <v-btn outlined color="primary" dark @click="handleCreateTratamiento"
            >+ Agregar Tratamiento</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
    <v-row class="ma-11 d-flex justify-lg-space-around">
      <!--listado de consultorios-->
      <v-col cols="6" md="4">
        <h3>Listado de Consultorios</h3>
        <v-hover
          v-for="consultorio in consultorios"
          :key="consultorio.id_consultorio"
          v-slot:default="{ hover }"
        >
          <v-card class="mb-2 position-relative" outlined>
            <!-- Nombre del consultorio -->
            <v-card-title class="text-h6">{{
              consultorio.nombre
            }}</v-card-title>
            <!-- Listado de tratamientos en un solo card -->
            <v-card-subtitle>
              <div v-if="consultorio.tratamientos.length > 0">
                <div
                  v-for="tratamiento in consultorio.tratamientos"
                  :key="tratamiento.id_tratamiento"
                >
                  {{ tratamiento.nombre }}
                </div>
              </div>
              <div v-else>No hay tratamientos asociados.</div>
            </v-card-subtitle>
            <!-- Botones de edición/borrado -->
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
      <!--listado de tratamientos-->
      <v-col cols="6" md="4">
        <h3>Listado de Tratamientos</h3>
        <v-hover
          v-for="tratamiento in tipoTratamientos"
          :key="tratamiento.id_tratamiento"
          v-slot:default="{ hover }"
        >
          <v-card :color="tratamiento.color" class="position-relative" outlined>
            <v-card-title class="text-h6">{{
              tratamiento.nombre.toUpperCase()
            }}</v-card-title>

            <!-- Botones que aparecen al pasar el mouse -->
            <div
              class="position-absolute top-0 right-0 pa-2 transition-ease-in-out"
              style="z-index: 10"
              :style="{ opacity: hover ? 1 : 0 }"
            >
              <v-btn
                color="#222222"
                icon
                small
                @click="editarTratamiento(tratamiento)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                color="#222222"
                icon
                small
                class="ml-2"
                @click="borrarTratamiento(tratamiento)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <!--dialog para editar/crear consultorio-->
    <v-dialog
      v-model="dialog"
      scrollable
      width="35vw"
      persistent
      transition="slide-x-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? "Editar Consultorio" : "Agregar Consultorio"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <!-- Campo para el nombre del consultorio -->
          <v-text-field
            v-model="newConsultorio"
            label="Nombre del Consultorio"
          ></v-text-field>

          <!-- Selector de tratamientos (permite selección múltiple) -->
          <v-select
            v-model="selectedTratamientos"
            label="Tratamientos"
            :items="tipoTratamientos"
            :item-text="(item) => item.nombre"
            :item-value="(item) => `${item.id_tratamiento}`"
            outlined
            dense
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="createConsultorio">{{
            isEdit ? "Editar" : "Guardar"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  dialog para eliminar-->
    <v-dialog
      v-model="eliminarDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="eliminarDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Eliminar Consultorio</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <p class="text-h6 font-weight-bold ma-4">
            ¿Estás seguro de que deseas eliminar el consultorio
            {{ consultorioToDelete?.nombre }}?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="eliminarDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" text @click="confirmarEliminacion"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--dialog para editar/crear Tratamiento-->
    <v-dialog
      v-model="tratamientoDialog"
      scrollable
      width="35vw"
      persistent
      transition="slide-x-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="tratamientoDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? "Editar Tratamiento" : "Agregar Tratamiento"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="newTratamiento"
            label="Nombre del Tratamiento"
          ></v-text-field>
          <v-text-field
            v-model="descripcion"
            label="Descripción"
          ></v-text-field>
          <v-text-field
            v-model="precio"
            type="number"
            label="Precio"
          ></v-text-field>
          <v-text-field
            v-model="duracion"
            type="number"
            label="Duración"
            suffix="minutos"
          ></v-text-field>
        </v-card-text>
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="tratamientoDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="createTratamiento">{{
            isEdit ? "Editar" : "Guardar"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  dialog para eliminar tratamiento-->
    <v-dialog
      v-model="eliminarTratamientoDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="eliminarTratamientoDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Eliminar Tratamiento</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <p class="text-h6 font-weight-bold ma-4">
            ¿Estás seguro de que deseas eliminar el tratamiento
            {{ tratamientoToDelete?.nombre }}?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="eliminarTratamientoDialog = false"
            >Cancelar</v-btn
          >
          <v-btn
            color="red darken-1"
            text
            @click="confirmarEliminacionTratamiento"
            >Eliminar</v-btn
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
      selectedTratamientos: [],
      dialog: false, // Estado para abrir/cerrar el diálogo
      tratamientoDialog: false,
      isEdit: false,
      eliminarDialog: false,
      eliminarTratamientoDialog: false,
      newConsultorio: "", // Nombre del nuevo consultorio
      newTratamiento: "",
      tipoTratamientos: [],
      consultorioToEdit: null,
      consultorioToDelete: null,
      tratamientoToEdit: null,
      tratamientoToDelete: null,
      descripcion: "",
      precio: "",
      duracion: "",
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
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
        this.tipoTratamientos = response.data.sort(
          (a, b) => a.id_tratamiento - b.id_tratamiento
        );
      } catch (error) {
        console.error("Error fetching tratamientos:", error);
      }
    },
    async fetchConsultoriosyTratamientos() {
      try {
        const response = await axios.get("/consultorios/tratamientos");
        this.consultorios = response.data
          .map((consultorio) => ({
            id_consultorio: consultorio.id_consultorio,
            nombre: consultorio.nombre_consultorio,
            tratamiento: consultorio.id_tratamiento
              ? [
                  {
                    id_tratamiento: consultorio.id_tratamiento,
                    nombre: consultorio.nombre_tratamiento,
                    descripcion: consultorio.descripcion_tratamiento,
                    costo: consultorio.costo_tratamiento,
                    duracion: consultorio.duracion_tratamiento,
                    color: consultorio.color_tratamiento,
                  },
                ]
              : [], // Si no hay tratamiento, devuelve un array vacío
          }))
          .sort((a, b) => a.id_consultorio - b.id_consultorio);

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

          tratamientos: this.selectedTratamientos, // ID del tratamiento seleccionado
        });
        this.fetchConsultoriosyTratamientos(); // Actualiza la lista de consultorios
        this.dialog = false; // Cierra el diálogo
      } catch (error) {
        console.error("Error al crear el consultorio:", error);
      }
    },

    handleCreateConsultorio() {
      this.dialog = !this.dialog;
      this.isEdit = false;
    },

    async editarConsultorio(consultorio) {
      this.isEdit = true;
      this.consultorioToEdit = consultorio.id_consultorio; // Guarda el ID del consultorio
      this.dialog = true; // Abre el diálogo
      this.newConsultorio = consultorio.nombre;

      // Asigna el ID del tratamiento seleccionado
      if (consultorio.tratamiento.length > 0) {
        this.selectedTratamientos = consultorio.tratamiento[0].id_tratamiento; // Extrae el ID del tratamiento
      } else {
        this.selectedTratamientos = null; // Si no hay tratamiento, asigna null
      }
    },

    async updateConsultorio() {
      console.log(
        "ID del consultorio a actualizar:",
        this.consultorioToEdit,
        "Tratamientos seleccionados:",
        this.selectedTratamientos
      );

      // Validación
      if (!Array.isArray(this.selectedTratamientos)) {
        console.error("Error: selectedTratamientos debe ser un array.");
        return;
      }

      try {
        const response = await axios.put(
          `/consultorios/${this.consultorioToEdit}`,
          {
            nombre: this.newConsultorio,
            tratamientos: this.selectedTratamientos, // Array de IDs de tratamientos
          }
        );
        await this.fetchConsultoriosyTratamientos(); // Actualiza la lista de consultorios
      } catch (error) {
        console.error("Error al actualizar el consultorio:", error);
      }
    },

    async borrarConsultorio(consultorio) {
      this.eliminarDialog = true;
      this.consultorioToDelete = consultorio;
    },

    async confirmarEliminacion() {
      await this.eliminarConsultorio(this.consultorioToDelete);
      this.eliminarDialog = false;
    },

    async eliminarConsultorio(consultorio) {
      try {
        await axios.delete(`/consultorios/${consultorio.id_consultorio}`);
        await this.fetchConsultoriosyTratamientos(); // Actualiza la lista de consultorios
      } catch (error) {
        console.error("Error al eliminar el consultorio:", error);
      }
    },

    // Tratamientos

    async editarTratamiento(tratamiento) {
      this.isEdit = true;
      this.tratamientoToEdit = tratamiento.id_tratamiento; // Guarda el ID del tratamiento
      this.tratamientoDialog = true;
      this.newTratamiento = tratamiento.nombre;
      this.descripcion = tratamiento.descripcion;
      this.precio = tratamiento.costo;
      this.duracion = tratamiento.duracion;
      this.selectedColor = tratamiento.color;
    },

    async confirmarEliminacionTratamiento() {
      await this.eliminarTratamiento(this.tratamientoToDelete);
      this.eliminarTratamientoDialog = false;
    },

    async borrarTratamiento(tratamiento) {
      this.eliminarTratamientoDialog = true;
      this.tratamientoToDelete = tratamiento;
    },
    async eliminarTratamiento(tratamiento) {
      try {
        await axios.delete(`/tratamientos/${tratamiento.id_tratamiento}`);
        await this.fetchTratamientos(); // Actualiza la lista de consultorios
      } catch (error) {
        if (error.response) {
          // Manejar errores específicos del backend
          if (error.response.status === 400) {
            alert(error.response.data.message); // Mostrar mensaje de error
          } else if (error.response.status === 404) {
            alert("Tratamiento no encontrado");
          } else {
            alert("Error al eliminar el tratamiento");
          }
        } else {
          console.error("Error desconocido:", error.message);
        }
      }
    },

    handleCreateTratamiento() {
      this.tratamientoDialog = !this.tratamientoDialog;
      this.isEdit = false;
    },

    async createTratamiento(tratamiento) {
      if (this.isEdit) {
        // Modo edición: Actualizar el consultorio existente
        await this.updateTratamiento(tratamiento);
      } else {
        // Modo creación: Crear un nuevo consultorio
        await this.addTratamiento();
      }
      this.tratamientoDialog = false; // Cerrar el diálogo
    },

    async addTratamiento() {
      try {
        const response = await axios.post("/tratamientos", {
          nombre: this.newTratamiento,
          descripcion: this.descripcion,
          costo: this.precio,
          duracion: this.duracion,
          color: this.selectedColor,
        });
        this.fetchTratamientos(); // Actualiza la lista de tratamientos
        this.tratamientoDialog = false; // Cierra el diálogo
      } catch (error) {
        console.error("Error al crear el tratamiento:", error);
      }
    },

    async updateTratamiento() {
      try {
        const response = await axios.put(
          `/tratamientos/${this.tratamientoToEdit}`,
          {
            nombre: this.newTratamiento,
            descripcion: this.descripcion,
            costo: this.precio,
            duracion: this.duracion,
            color: this.selectedColor,
          }
        );
        await this.fetchTratamientos(); // Actualiza la lista de tratamientos
      } catch (error) {
        console.error("Error al actualizar el tratamiento:", error);
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
    tratamientoDialog(newVal) {
      if (!newVal) {
        // Limpiar datos cuando se cierra el diálogo
        this.newTratamiento = "";
        this.descripcion = "";
        this.precio = "";
        this.duracion = "";
        this.tratamientoToEdit = null;
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
