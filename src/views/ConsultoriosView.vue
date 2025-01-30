<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" v-for="consultorio in consultorios" :key="consultorio.nombre">
        <v-card :class="{ 'red lighten-2': hasConflict(consultorio) }" outlined>
          <v-card-title class="text-h6">{{ consultorio.nombre }}</v-card-title>
          <v-card-subtitle>
            <v-list>
              <v-list-item v-for="turno in consultorio.turnos" :key="turno.id_turno">
                <v-list-item-content>
                  <div class="text-subtitle-1">Turno: {{ turno.nombre_paciente }}</div>
                  <div class="text-body-2">Hora: {{ turno.hora }}</div>
                  <div class="text-body-2">Teléfono: {{ turno.telefono }}</div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      consultorios: [],
    }
  },
  methods: {
    async fetchTurnos() {
      try {
        const response = await axios.get('/Calendarturnos', {
          params: { fecha: new Date().toISOString().split('T')[0] },
        })
        const turnos = response.data

        // Agrupar turnos por consultorio
        const grouped = turnos.reduce((acc, turno) => {
          if (!acc[turno.consultorio]) {
            acc[turno.consultorio] = { nombre: turno.consultorio, turnos: [] }
          }
          acc[turno.consultorio].turnos.push(turno)
          return acc
        }, {})

        this.consultorios = Object.values(grouped)
      } catch (error) {
        console.error('Error fetching turnos:', error)
      }
    },

    hasConflict(consultorio) {
      const horarios = consultorio.turnos.map((turno) => turno.hora)
      const uniqueHorarios = new Set(horarios)
      return uniqueHorarios.size !== horarios.length
    },
  },
  mounted() {
    this.fetchTurnos()
  },
}
</script>

<style scoped>
.red {
  color: white;
}
</style>
