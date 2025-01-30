<template>
  <v-container>
    <!-- Sección para Crear Turno -->
    <v-card>
      <v-card-title class="text-h5">Crear Turno</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <!-- Paciente -->
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Paciente"
                v-model="nuevoTurno.id_paciente"
                :items="pacientes"
                item-text="nombre"
                item-value="id_paciente"
                outlined
                dense
                required
              />
            </v-col>

            <!-- Consultorio -->
            <v-col cols="12" md="6">
              <v-select
                label="Consultorio"
                :items="consultorios"
                item-text="nombre"
                item-value="id_consultorio"
                v-model="nuevoTurno.id_consultorio"
                outlined
                dense
                required
              />
            </v-col>

            <!-- Tratamiento -->
            <v-col cols="12" md="6">
              <v-select
                label="Tratamiento"
                :items="tratamientos"
                item-text="nombre"
                item-value="id_tratamiento"
                v-model="nuevoTurno.id_tratamiento"
                outlined
                dense
                required
              />
            </v-col>

            <!-- Fecha -->
            <v-col cols="12" md="6">
              <v-menu
                ref="menuFecha"
                v-model="menuFecha"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="nuevoTurno.fecha"
                    label="Fecha"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    required
                  />
                </template>
                <v-date-picker
                  v-model="nuevoTurno.fecha"
                  @input="menuFecha = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <!-- Hora -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Hora"
                v-model="nuevoTurno.hora"
                type="time"
                outlined
                dense
                required
              />
            </v-col>
          </v-row>

          <v-btn color="primary" @click="crearTurno">Crear Turno</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Sección para Filtrar Turnos -->
    <v-row class="mt-5">
      <v-col cols="12" md="6">
        <v-menu
          ref="menuFechaFiltro"
          v-model="menuFechaFiltro"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="filtroFecha"
              label="Filtrar por Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            />
          </template>
          <v-date-picker v-model="filtroFecha" @input="menuFechaFiltro = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-btn color="primary" @click="cargarTurnos">Filtrar Turnos</v-btn>
      </v-col>
    </v-row>

    <!-- Sección para Mostrar Turnos Programados -->
    <v-card>
      <v-card-title class="text-h5">Turnos Programados</v-card-title>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Consultorio</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turno in turnos" :key="turno.id_turno">
              <td>{{ turno.nombre_paciente }}</td>
              <td>{{ turno.consultorio }}</td>
              <td>{{ turno.fecha }}</td>
              <td>{{ turno.hora }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import axios from '../config/axios'

export default {
  data() {
    return {
      menuFecha: false,
      menuFechaFiltro: false,
      filtroFecha: '', // Almacenar la fecha para filtrar
      consultorios: [], // Lista de consultorios cargada desde el backend
      tratamientos: [], // Lista de tratamientos cargada desde el backend
      pacientes: [], // Lista de pacientes cargada desde el backend
      turnos: [], // Lista de turnos a mostrar
      nuevoTurno: {
        id_paciente: null,
        id_consultorio: null,
        id_tratamiento: null,
        fecha: '',
        hora: '',
      },
    }
  },
  methods: {
    async cargarConsultorios() {
      try {
        const response = await axios.get('/consultorios')
        this.consultorios = response.data
      } catch (error) {
        console.error('Error al cargar consultorios:', error)
      }
    },
    async cargarTratamientos() {
      try {
        const response = await axios.get('/tratamientos')
        this.tratamientos = response.data
      } catch (error) {
        console.error('Error al cargar tratamientos:', error)
      }
    },
    async cargarPacientes() {
      try {
        const response = await axios.get('/pacientes')
        this.pacientes = response.data
      } catch (error) {
        console.error('Error al cargar pacientes:', error)
      }
    },
    async cargarTurnos() {
      try {
        const response = await axios.get('/Calendarturnos', {
          params: { fecha: this.filtroFecha }, // Pasar la fecha seleccionada para filtrar
        })
        this.turnos = response.data
      } catch (error) {
        console.error('Error al cargar turnos:', error)
      }
    },
    async crearTurno() {
      try {
        const response = await axios.post('/turnos', this.nuevoTurno)
        this.$refs.form.reset() // Limpiar el formulario
        this.$toast.success(response.data.message || 'Turno creado con éxito.')
      } catch (error) {
        console.error('Error al crear el turno:', error)
        const errorMessage = error.response?.data?.message || 'Error al crear el turno.'
        this.$toast.error(errorMessage)
      }
    },
  },
  mounted() {
    this.cargarConsultorios()
    this.cargarTratamientos()
    this.cargarPacientes() // Cargar pacientes al montar el componente
    this.cargarTurnos() // Cargar los turnos al montar el componente
  },
}
</script>
