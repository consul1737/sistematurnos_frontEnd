<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">Calendario de Turnos</v-card-title>
      <v-card-text>
        <v-row>
          <!-- Calendario -->
          <v-col cols="12">
            <v-calendar
              v-model="fechaSeleccionada"
              :events="eventos"
              event-color="color"
              event-text-color="white"
              color="primary"
              type="week"
              :weekdays="[1, 2, 3, 4, 5, 6, 7]"
              show-week
              :interval-minutes="60"
              :interval-count="12"
              :interval-height="60"
              :event-more="true"
              :event-overlap="false"
              :short-interval-label="false"
            >
              <template #day-body="{ day, events }">
                <v-card
                  v-for="event in events"
                  :key="event.name + day.date"
                  class="pa-2"
                  style="margin-bottom: 5px; cursor: pointer"
                  color="primary"
                  @click="verDetalle(event)"
                >
                  <div class="white--text text-truncate">
                    {{ event.name }}
                  </div>
                </v-card>
              </template>
            </v-calendar>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      fechaSeleccionada: new Date().toISOString().substr(0, 10), // Fecha inicial
      eventos: [], // Turnos cargados desde el backend
    }
  },
  methods: {
    async cargarTurnos() {
      try {
        const response = await axios.get('/Calendarturnos') // Endpoint para obtener turnos

        // Asegúrate de que la respuesta tenga la estructura adecuada
        console.log('Respuesta del servidor:', response.data)

        this.eventos = response.data
          .map((turno) => {
            // Verificar si 'fecha' y 'hora' son válidos
            let fechaHora = `${turno.fecha}T${turno.hora}`
            console.log(fechaHora)
            // Eliminar cualquier 'Z' o caracteres no válidos
            fechaHora = fechaHora.replace('Z', '') // Si es necesario quitar el 'Z'

            const startDate = new Date(fechaHora)

            // Verifica si la fecha es válida
            if (isNaN(startDate)) {
              console.error(`Fecha inválida para el turno: ${fechaHora}`)
              return null // Si la fecha es inválida, no la agregamos a los eventos
            }

            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Suponer que el turno dura 1 hora

            return {
              name: `${turno.nombre_paciente} - ${turno.consultorio}`,
              start: startDate.toISOString().slice(0, 16), // Formato: YYYY-MM-DDTHH:mm
              end: endDate.toISOString().slice(0, 16), // Formato: YYYY-MM-DDTHH:mm
              color: this.obtenerColor(turno.id_consultorio),
            }
          })
          .filter((evento) => evento !== null) // Filtrar eventos inválidos
      } catch (error) {
        console.error('Error al cargar los turnos:', error)
      }
    },
    obtenerColor(id_consultorio) {
      // Define colores específicos para cada consultorio
      const colores = ['blue', 'green', 'red', 'purple', 'orange']
      return colores[id_consultorio % colores.length]
    },
    verDetalle(evento) {
      alert(`Detalle del turno:\n${evento.name}`)
    },
  },
  mounted() {
    this.cargarTurnos() // Cargar turnos al montar el componente
  },
}
</script>
<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
