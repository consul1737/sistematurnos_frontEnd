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
          <v-date-picker
            v-model="picker"
            no-title
            full-width
            :header-date-format="formatHeaderDate"
          ></v-date-picker>
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
                  <transition-group name="list" tag="div">
                    <template v-for="(events, date) in groupedEventsByDay">
                      <v-list-item-group class="pa-2" :key="date">
                        <v-subheader
                          color="primary"
                          style="
                            background-color: #c1c1c1;
                            border: 1px solid #8e8e8e;
                          "
                          class="text-uppercase text-h6 font-weight-bold"
                        >
                          {{
                            new Intl.DateTimeFormat("es-ES", {
                              weekday: "long",
                              day: "numeric",
                            }).format(new Date(date))
                          }}
                        </v-subheader>

                        <template v-if="events.length > 0">
                          <v-list-item
                            v-for="(event, idx) in events"
                            :key="`event-${date}-${idx}`"
                            style="
                              cursor: pointer;
                              border-bottom: 1px solid #8e8e8e;
                            "
                            @click="showEvent({ event: event })"
                          >
                            <v-list-item-content>
                              <v-list-item-title style="font-size: 0.8rem">
                                <span
                                  :style="{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: event.color,
                                    marginRight: '8px',
                                  }"
                                ></span>
                                {{
                                  new Date(event.start).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                }}
                                - {{ event.name }}
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
                  </transition-group>
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
          <v-btn v-if="isEdit" @click="eliminarTurno" icon dark>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? "Editar Turno" : "Nuevo Turno"
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">
          <!-- Selector de Paciente -->
          <v-autocomplete
            label="Paciente"
            v-model="nuevoTurno.id_paciente"
            :items="pacientes"
            :item-text="(paciente) => `${paciente.nombre} ${paciente.apellido}`"
            item-value="id_paciente"
            outlined
            dense
            required
          />
          <!-- Selector de Consultorio -->
          <v-select
            label="Consultorio"
            :items="consultorios"
            item-text="nombre"
            item-value="id_consultorio"
            v-model="nuevoTurno.id_consultorio"
            @change="cargarTratamientosPorConsultorio"
            outlined
            dense
            required
          >
            <template v-slot:item="{ item }">
              <div style="display: flex; align-items: center">
                <div
                  :style="{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color || '#ccc',
                    marginRight: '8px',
                  }"
                ></div>
                <span>{{ item.nombre }}</span>
              </div>
            </template>
          </v-select>
          <!-- Selector de Tratamientos -->
          <v-select
            label="Tratamiento"
            :items="tratamientosDisponibles"
            item-text="nombre_tratamiento"
            item-value="id_tratamiento"
            v-model="nuevoTurno.id_tratamiento"
            @change="actualizarDetallesTratamiento"
            outlined
            dense
            required
          >
            <template v-slot:item="{ item }">
              <div style="display: flex; align-items: center">
                <div
                  :style="{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    marginRight: '8px',
                  }"
                ></div>
                <span>{{ item.nombre_tratamiento }}</span>
              </div>
            </template>
          </v-select>

          <!-- Selector de Fecha -->
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

          <!-- Selector de Hora -->
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

          <!-- Duración y Costo del Tratamiento -->
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
          <v-btn color="success" @click="guardarTurno">
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
    tratamientosDisponibles: [],
    tratamientoSeleccionado: {
      duracion: null,
      costo: null,
    },
    nuevoTurno: {
      id_paciente: null,
      fecha: "",
      hora: "",
      estado: "pendiente",
      id_consultorio: null,
      id_tratamiento: null,
    },
    menuFecha: false,
    menuFechaFiltro: false,
    filtroFecha: "",
    menuHora: false,
    // validarDatosTurno: false,
  }),

  methods: {
    formatHeaderDate(date) {
      // console.log("Valor de date recibido:", date); // Depuración

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
        // console.log("Turnos cargados:", this.turnos);
        // Esperar a que Vue reactive los datos antes de llamar a getEvents()
        this.$nextTick(() => {
          this.getEvents();
        });
      } catch (error) {
        console.error("Error al cargar turnos:", error);
      }
    },
    getEvents() {
      this.events = [];

      // Mapear los turnos a eventos
      const eventos = this.turnos.map((turno) => {
        const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`);
        const duracion = turno.duracion_tratamiento;
        const fechaHoraFin = new Date(
          fechaHoraInicio.getTime() + duracion * 60000
        );

        return {
          id_turno: turno.id_turno,
          id_paciente: turno.id_paciente,
          id_consultorio: turno.id_consultorio,
          id_tratamiento: turno.id_tratamiento,
          name: `${turno.nombre_paciente} ${turno.apellido_paciente}`,
          start: fechaHoraInicio,
          end: fechaHoraFin,
          color: turno.color_tratamiento,
          timed: true,
        };
      });

      // Ordenar los eventos por fecha de inicio (start)
      eventos.sort((a, b) => a.start - b.start);

      // Asignar los eventos ordenados a this.events
      this.events = eventos;
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

      // Crear una copia del evento para evitar mutaciones directas
      const updatedEvent = { ...event };

      // Asignar los datos del evento al objeto nuevoTurno
      this.nuevoTurno = {
        id_turno: updatedEvent.id_turno,
        id_paciente: updatedEvent.id_paciente,
        fecha: updatedEvent.start ? this.formatDate(updatedEvent.start) : null,
        hora: updatedEvent.start ? this.formatTime(updatedEvent.start) : null,
        estado: updatedEvent.estado || "pendiente",
        id_consultorio: updatedEvent.id_consultorio,
        id_tratamiento: updatedEvent.id_tratamiento,
      };

      // Cargar los tratamientos disponibles para el consultorio seleccionado
      if (updatedEvent.id_consultorio) {
        this.cargarTratamientosPorConsultorio(updatedEvent.id_consultorio);
      }

      // Si hay un tratamiento seleccionado, cargar sus detalles
      if (updatedEvent.id_tratamiento) {
        this.actualizarDetallesTratamiento(updatedEvent.id_tratamiento);
      }
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    },
    formatTime(date) {
      const d = new Date(date);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`; // Formato HH:MM
    },
    async cargarPacientes() {
      try {
        const response = await axios.get("/pacientes");
        this.pacientes = response.data;
        // console.log("Pacientes cargados:", this.pacientes);
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
    async cargarTratamientosPorConsultorio(id_consultorio) {
      try {
        // Llamar al backend para obtener los tratamientos asociados al consultorio
        const response = await axios.get(
          `/tratamientos/tratamientosconsul/${id_consultorio}`
        );
        this.tratamientosDisponibles = response.data || [];

        // Si estamos editando un turno, cargar los detalles del tratamiento seleccionado
        if (this.isEdit && this.nuevoTurno.id_tratamiento) {
          this.actualizarDetallesTratamiento(this.nuevoTurno.id_tratamiento);
        } else {
          // Reiniciar el tratamiento seleccionado y sus detalles si no estamos editando
          this.nuevoTurno.id_tratamiento = null;
          this.tratamientoSeleccionado = { duracion: null, costo: null };
        }
      } catch (error) {
        console.error("Error al cargar tratamientos:", error.message);
        this.tratamientosDisponibles = [];
      }
    },
    actualizarDetallesTratamiento(id_tratamiento) {
      // Buscar el tratamiento en la lista de tratamientos disponibles

      const tratamiento = this.tratamientosDisponibles.find(
        (t) => t.id_tratamiento === id_tratamiento
      );

      if (tratamiento) {
        // Asignar los detalles del tratamiento
        this.tratamientoSeleccionado = {
          duracion: tratamiento.duracion,
          costo: tratamiento.costo,
        };
      } else {
        // Si no se encuentra el tratamiento, limpiar los detalles
        this.tratamientoSeleccionado = { duracion: null, costo: null };
      }
    },
    guardarTurno() {
      if (this.isEdit) {
        this.updateTurno(this.nuevoTurno);
      } else {
        this.createTurno(this.nuevoTurno);
      }
    },
    async createTurno(turno) {
      try {
        const response = await axios.post("/turnos", turno);
        // this.$toast.success(response.data.message || "Turno creado con éxito.");
        this.cargarTurnos();
        this.dialog = false;
      } catch (error) {
        // console.error("Error al crear el turno:", error);
        const errorMessage =
          error.response?.data?.message || "Error al crear el turno.";
        this.$toast.error(errorMessage);
      }
    },
    async updateTurno(turno) {
      //console.log(turno);
      try {
        const response = await axios.put(`/turnos/${turno.id_turno}`, turno);

        this.cargarTurnos();
        this.dialog = false;
      } catch (error) {
        console.error("Error al actualizar el turno:", error);
        const errorMessage =
          error.response?.data?.message || "Error al actualizar el turno.";
        this.$toast.error(errorMessage);
      }
    },

    eliminarTurno() {
      if (this.nuevoTurno.id_turno) {
        axios
          .delete(`/turnos/${this.nuevoTurno.id_turno}`)
          .then(() => {
            this.cargarTurnos();
            this.dialog = false;
          })
          .catch((error) => {
            console.error("Error al eliminar el turno:", error);
            this.$toast.error("Error al eliminar el turno.");
          });
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

      const grouped = this.events.reduce((acc, event) => {
        const eventDate = new Date(event.start);
        const eventMonth = eventDate.getUTCMonth();
        const eventYear = eventDate.getUTCFullYear();

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

      // Ordenar las fechas
      const sortedGrouped = {};
      Object.keys(grouped)
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((key) => {
          sortedGrouped[key] = grouped[key];
        });

      return sortedGrouped;
    },
    // tratamientoSeleccionado() {
    //   const consultorio = this.consultorios.find(
    //     (c) => c.id_consultorio === this.nuevoTurno.id_consultorio
    //   );
    //   return consultorio && consultorio.tratamiento.length > 0
    //     ? consultorio.tratamiento[0]
    //     : { duracion: "", costo: "" };
    // },
    horaFormateada() {
      if (!this.nuevoTurno.hora) return "";
      return this.nuevoTurno.hora;
    },
    validarDatosTurno() {
      // Verificar que todos los campos requeridos estén presentes y sean válidos
      return (
        !!this.nuevoTurno.id_paciente && // Asegurarse de que haya un paciente seleccionado
        !!this.nuevoTurno.id_consultorio && // Asegurarse de que haya un consultorio seleccionado
        !!this.nuevoTurno.id_tratamiento && // Asegurarse de que haya un tratamiento seleccionado
        !!this.nuevoTurno.fecha && // Asegurarse de que haya una fecha seleccionada
        !!this.nuevoTurno.hora && // Asegurarse de que haya una hora seleccionada
        this.nuevoTurno.fecha.trim() !== "" && // Asegurarse de que la fecha no sea una cadena vacía
        this.nuevoTurno.hora.trim() !== "" // Asegurarse de que la hora no sea una cadena vacía
      );
    },
  },
};
</script>
