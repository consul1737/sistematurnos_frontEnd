<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title card-title primary-title
          >📅 Calendario de turnos</v-card-title
        >
      </v-col>
      <v-col cols="3" class="d-flex flex-column align-center pa-6">
        <v-btn
          color="primary"
          class="ma-3"
          style="width: 100%"
          @click="handleCreateTurno"
          >+ Nuevo Turno</v-btn
        >
        <v-divider></v-divider>
        <v-row justify="center">
          <v-date-picker v-model="picker" no-title full-width></v-date-picker>
        </v-row>
      </v-col>
      <v-col cols="9">
        <section
          style="
            display: flex;
            justify-content: space-between;
            margin: 10px 50px;
          "
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
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="onCalendarChange"
            @click:event="showEvent"
            locale="es"
          >
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
    <!--nuevo turno dialog-->
    <v-dialog
      v-model="dialog"
      scrollable
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat height="50px" tile dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn v-if="isEdit" icon dark>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? "Editar Turno" : "Nuevo Turno"
          }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
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
          <v-select
            label="Consultorio"
            :items="consultorios"
            item-text="displayText"
            item-value="id_consultorio_tratamiento"
            v-model="nuevoTurno.id_consultorio"
            outlined
            dense
            required
          >
            <template v-slot:item="{ item }">
              <div style="display: flex; align-items: center">
                <!-- Punto de color -->
                <div
                  :style="{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    marginRight: '8px',
                  }"
                ></div>
                <!-- Nombre del consultorio -->
                <span>{{ item.displayText }}</span>
              </div>
            </template></v-select
          >
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
              no-title
              v-model="nuevoTurno.fecha"
              @input="menuFecha = false"
              locale="es"
              :header-date-format="formatHeaderDate"
            ></v-date-picker>
          </v-menu>
          <v-menu
            ref="menuHora"
            v-model="menuHora"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="horaFormateada"
                label="Seleccionar hora"
                prepend-icon="mdi-clock-time-four-outline"
                suffix="HH:MM"
                outlined
                dense
                required
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-model="nuevoTurno.hora"
              @input="menuHora = false"
              format="24hr"
            ></v-time-picker>
          </v-menu>
          <v-text-field
            label="Duración del Tratamiento"
            v-model="tratamientoSeleccionado.duracion"
            outlined
            dense
            readonly
            suffix="minutos"
          ></v-text-field>

          <v-text-field
            label="Costo del Tratamiento"
            v-model="tratamientoSeleccionado.costo"
            prefix="$"
            outlined
            dense
            readonly
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :disabled="!validarDatosTurno"
            @click="guardarTurno"
          >
            {{ isEdit ? "Guardar Cambios" : "Guardar Turno" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: "",
    currentMonth: null, // Nuevo dato para almacenar el mes actual
    currentYear: null, // Nuevo dato para almacenar el año actual
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    events: [],
    dialog: false,
    isEdit: false,
    pacientes: [],
    consultorios: [],
    nuevoTurno: {
      id_paciente: null,
      fecha: "",
      hora: "",
      estado: "pendiente",
      id_consultorio_tratamiento: null,
    },
    menuFecha: false,
    menuFechaFiltro: false,
    filtroFecha: "",
    menuHora: false,
    validarDatosTurno: false,
  }),

  methods: {
    formatHeaderDate(date) {
      console.log("Valor de date recibido:", date); // Depuración

      // Verificar si el valor es una cadena como "2025-02"
      if (typeof date === "string" && date.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = date.split("-"); // Separar el año y el mes
        date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1); // Crear un objeto Date (meses son base 0)
      }

      // Verificar si el valor es un objeto Date válido
      if (!date || !(date instanceof Date) || isNaN(date)) {
        return "FECHA INVÁLIDA"; // Mensaje de error o valor predeterminado
      }

      // Obtener el nombre del mes y el año por separado
      const monthName = new Intl.DateTimeFormat("es", { month: "long" }).format(
        date
      );
      const yearValue = date.getFullYear();

      // Combinar el mes y el año sin "de" y en mayúsculas
      return `${monthName.toUpperCase()} ${yearValue}`;
    },
    async cargarTurnos() {
      try {
        const response = await axios.get("/turnos/calendario");
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
        const duracion = turno.duracion_tratamiento;
        const fechaHoraFin = new Date(
          fechaHoraInicio.getTime() + duracion * 60000
        );

        return {
          name: `${turno.nombre_paciente}<br>${turno.apellido_paciente}`,
          start: fechaHoraInicio,
          end: fechaHoraFin,
          color: turno.color_tratamiento,
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
      }
    },
    next() {
      if (this.$refs.calendar) {
        this.$refs.calendar.next();
      }
    },
    getEventColor(event) {
      return event.color;
    },
    handleCreateTurno() {
      this.isEdit = false;
      this.dialog = true;
    },

    showEvent({ event }) {
      this.dialog = true;
      this.isEdit = true;
    },
    async cargarPacientes() {
      try {
        const response = await axios.get("/pacientes");
        this.pacientes = response.data;
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
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
            displayText: `${consultorio.nombre_consultorio} -  ${
              consultorio.id_tratamiento
                ? consultorio.nombre_tratamiento
                : "Sin tratamiento"
            }`,
          }))
          .sort((a, b) => a.id_consultorio - b.id_consultorio);
      } catch (error) {
        console.error("Error fetching consultorios and tratamientos:", error);
      }
    },
  },

  mounted() {
    this.cargarTurnos();
    this.cargarPacientes();
    this.fetchConsultoriosyTratamientos();
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
  watch: {
    dialog(val) {
      if (!val) {
        this.nuevoTurno = {
          id_paciente: null,
          fecha: "",
          hora: "",
          estado: "pendiente",
          id_consultorio_tratamiento: null,
        };
      }
    },
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
    tratamientoSeleccionado() {
      const consultorio = this.consultorios.find(
        (c) => c.id_consultorio === this.nuevoTurno.id_consultorio
      );
      return consultorio && consultorio.tratamiento.length > 0
        ? consultorio.tratamiento[0]
        : { duracion: "", costo: "" };
    },
    horaFormateada() {
      if (!this.nuevoTurno.hora) return "";
      return this.nuevoTurno.hora;
    },
    validarDatosTurno() {
      return (
        this.nuevoTurno.id_paciente &&
        this.nuevoTurno.id_consultorio &&
        this.nuevoTurno.fecha &&
        this.nuevoTurno.hora
      );
    },
  },
};
</script>
