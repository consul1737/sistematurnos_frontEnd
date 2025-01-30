<template>
  <v-container>
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
              <th>Seleccionar</th>
              <th>Paciente</th>
              <th>Consultorio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turno in turnos" :key="turno.id_turno">
              <td>
                <v-checkbox
                  v-model="turnosSeleccionados"
                  :value="turno.id_turno"
                  :label="'Turno ' + turno.id_turno"
                />
              </td>
              <td>{{ turno.nombre_paciente }}</td>
              <td>{{ turno.consultorio }}</td>
              <td>{{ turno.fecha }}</td>
              <td>{{ turno.hora }}</td>
              <td>{{ turno.telefono }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <!-- Sección para Escribir el Mensaje -->
    <v-card class="mt-5">
      <v-card-title class="text-h5">Escribir Mensaje</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="mensaje"
          label="Escribe el mensaje para enviar por WhatsApp"
          outlined
          dense
          rows="4"
          required
        />
        <v-alert type="info" class="mt-3">
          Puedes usar los siguientes marcadores en el mensaje para personalizarlo:
          <ul>
            <li><b>{PACIENTE}</b>: Nombre del paciente</li>
            <li><b>{CONSULTORIO}</b>: Nombre del consultorio</li>
            <li><b>{TRATAMIENTO}</b>: Tratamiento asignado</li>
            <li><b>{FECHA}</b>: Fecha del turno</li>
            <li><b>{HORA}</b>: Hora del turno</li>
          </ul>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="enviarNotificaciones">Enviar Notificaciones</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import axios from '../config/axios'

export default {
  data() {
    return {
      menuFechaFiltro: false,
      filtroFecha: '', // Fecha seleccionada para filtrar turnos
      turnos: [], // Lista de turnos cargados desde el backend
      turnosSeleccionados: [], // Lista de turnos seleccionados por el usuario
      mensaje: '', // Mensaje base para enviar notificaciones
    }
  },
  methods: {
    // Cargar turnos desde el backend
    async cargarTurnos() {
      try {
        const response = await axios.get('/Calendarturnos', {
          params: { fecha: this.filtroFecha }, // Filtrar por fecha si se especifica
        })
        this.turnos = response.data
      } catch (error) {
        console.error('Error al cargar turnos:', error)
        this.$toast.error('Error al cargar los turnos.')
      }
    },
    // Enviar notificaciones a los turnos seleccionados
    async enviarNotificaciones() {
      if (!this.mensaje || this.turnosSeleccionados.length === 0) {
        this.$toast.error('Por favor, seleccione al menos un turno y escriba un mensaje.')
        return
      }

      try {
        // Crear una lista de turnos seleccionados con idTurno y numero
        const turnosConTelefono = this.turnos
          .filter((turno) => this.turnosSeleccionados.includes(turno.id_turno))
          .map((turno) => ({
            idTurno: turno.id_turno,
            numero: turno.telefono, // Asegúrate de que el número está disponible
          }))
        console.log()

        // Enviar notificaciones al backend con los turnos seleccionados
        const response = await axios.post('/enviar-notificaciones', {
          turnos: turnosConTelefono, // Enviar la lista con el formato adecuado
          mensajeBase: this.mensaje, // El mensaje base puede contener placeholders
        })
        console.log(response)

        this.$toast.success('Notificaciones enviadas con éxito.')
        this.turnosSeleccionados = [] // Limpiar selección
        this.mensaje = '' // Limpiar mensaje
      } catch (error) {
        console.error('Error al enviar notificaciones:', error)
        this.$toast.error('Error al enviar las notificaciones.')
      }
    },
  },
  mounted() {
    // Cargar turnos al montar el componente
    this.cargarTurnos()
  },
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
