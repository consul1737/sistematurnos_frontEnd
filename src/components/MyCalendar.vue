<template>
  <div
    class="text-center"
    style="
      display: grid;
      grid-template-columns: 25% auto;
      gap: 10px;
      grid-template-rows: 2fr;
    "
  >
    <div style="grid-row: 1; grid-column: 1/4; justify-self: center; width: ">
      <v-card-title card-title primary-title
        >📅 Calendario de turnos</v-card-title
      >
    </div>
    <div style="grid-row: 2; grid-column: 1/2">
      <v-btn round color="primary" class="ma-3" style="width: 100%"
        >+ Nuevo Turno</v-btn
      >
      <v-divider></v-divider>
      <v-row justify="center">
        <v-date-picker v-model="picker" no-title full-width></v-date-picker>
      </v-row>
    </div>
    <section style="grid-row: 2; grid-column: 2/7">
      <section
        style="display: flex; justify-content: space-between; margin: 10px 50px"
      >
        <div class="d-flex align-center">
          <v-btn class="ma-1" small outlined @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="ma-1" small outlined @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar && $refs.calendar.title">
            {{ $refs.calendar.title.toUpperCase() }}
          </v-toolbar-title>
        </div>

        <v-btn-toggle v-model="type" outlined class="d-flex">
          <v-btn value="month">
            <span class="hidden-sm-and-down">Mes</span>
          </v-btn>
          <v-btn value="week">
            <span class="hidden-sm-and-down">Semana</span>
          </v-btn>
          <v-btn value="day">
            <span class="hidden-sm-and-down">Diario</span>
          </v-btn>
          <v-btn value="list">
            <span class="hidden-sm-and-down">Lista</span>
          </v-btn>
        </v-btn-toggle>
      </section>

      <v-sheet height="600" class="pa-10">
        <v-container v-show="type === 'list'">
          <v-card class="mt-4">
            <v-card-title>Eventos del mes</v-card-title>
            <v-list>
              <template v-if="Object.keys(groupedEventsByDay).length === 0">
                <!-- Si no hay eventos, mostrar el alert -->
                <v-list-item>
                  <v-list-item-content>
                    <v-alert type="info" dense class="mb-0">
                      No hay eventos para este mes.
                    </v-alert>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-else>
                <!-- Iterar sobre las fechas agrupadas por día -->
                <template v-for="(events, date) in groupedEventsByDay">
                  <!-- Mover el :key al primer elemento real -->
                  <v-subheader :key="date - 1">{{
                    new Date(date).toLocaleDateString()
                  }}</v-subheader>
                  <v-list-item-group>
                    <!-- Iterar sobre los eventos en cada día -->
                    <template v-if="events.length > 0">
                      <v-list-item
                        v-for="(event, idx) in events"
                        :key="`event-${date}-${idx}`"
                      >
                        <v-list-item-content>
                          <v-list-item-title :style="{ color: event.color }">
                            {{ event.name }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-else>
                      <v-list-item>
                        <v-list-item-content>
                          <v-alert type="info" dense class="mb-0">
                            No hay actividades este día.
                          </v-alert>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </template>
              </template>
            </v-list>
          </v-card>
        </v-container>

        <v-calendar
          v-show="type !== 'list'"
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :type="type === 'list' ? 'month' : type"
          :events="events"
          :event-overlap-mode="mode"
          :event-overlap-threshold="30"
          :event-color="getEventColor"
          @change="onCalendarChange"
          locale="es"
        ></v-calendar>
      </v-sheet>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    turnos: [],
    type: "day",
    types: [
      { text: "Mes", value: "month" },
      { text: "Semana", value: "week" },
      { text: "Día", value: "day" },
      { text: "Lista", value: "list" },
    ],
    mode: "stack",
    modes: [
      { text: "Pilas", value: "stack" },
      { text: "Columnas", value: "column" },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: "",
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    currentMonth: null, // Nuevo dato para almacenar el mes actual
    currentYear: null, // Nuevo dato para almacenar el año actual
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
  }),

  methods: {
    async cargarTurnos() {
      try {
        const response = await axios.get("/Calendarturnos");
        this.turnos = response.data;
        console.log("Turnos cargados:", this.turnos);

        // Esperar a que Vue reactive los datos antes de llamar a getEvents()
        this.$nextTick(() => {
          this.getEvents();
          this.$forceUpdate(); // Forzar actualización en Vue
        });
      } catch (error) {
        console.error("Error al cargar turnos:", error);
      }
    },
    getEvents() {
      this.events = [];
      this.events = this.turnos.map((turno) => {
        const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`);
        const fechaHoraFin = new Date(fechaHoraInicio.getTime() + 1 * 3600000);

        return {
          name: `${turno.nombre_paciente} ${turno.apellido_paciente}`,
          start: fechaHoraInicio,
          end: fechaHoraFin,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: true,
        };
      });
    },
    onCalendarChange({ start }) {
      const date = new Date(start.date);
      this.currentMonth = date.getUTCMonth(); // Usar getUTCMonth() para evitar problemas de zona horaria
      this.currentYear = date.getUTCFullYear(); // Usar getUTCFullYear() para evitar problemas de zona horaria
      this.$forceUpdate(); // Forzar la actualización de la vista
    },
    prev() {
      if (this.$refs.calendar) {
        this.$refs.calendar.prev();
        this.$nextTick(() => this.updateCalendarTitle());
      }
    },
    next() {
      if (this.$refs.calendar) {
        this.$refs.calendar.next();
        this.$nextTick(() => this.updateCalendarTitle());
      }
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },

  mounted() {
    this.cargarTurnos();
    this.$nextTick(() => {
      if (this.$refs.calendar) {
        this.value = this.$refs.calendar.value;
        const date = new Date(this.value);
        this.currentMonth = date.getUTCMonth(); // Usar getUTCMonth() para evitar problemas de zona horaria
        this.currentYear = date.getUTCFullYear(); // Inicializar el año actual
        this.$forceUpdate(); // Forzar actualización de Vue para reflejar los cambios
      }
    });
  },
  computed: {
    groupedEventsByDay() {
      if (this.currentMonth === null || this.currentYear === null) return {};

      return this.events.reduce((acc, event) => {
        const eventDate = new Date(event.start);
        const eventMonth = eventDate.getUTCMonth(); // Usar getUTCMonth() para evitar problemas de zona horaria
        const eventYear = eventDate.getUTCFullYear(); // Usar getUTCFullYear() para evitar problemas de zona horaria

        if (
          eventMonth === this.currentMonth &&
          eventYear === this.currentYear
        ) {
          const dateKey = `${eventYear}-${(eventMonth + 1)
            .toString()
            .padStart(2, "0")}-${eventDate
            .getUTCDate()
            .toString()
            .padStart(2, "0")}`;

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }

          acc[dateKey].push(event);
        }

        return acc;
      }, {});
    },
  },
};
</script>
