<template>
  <v-container fluid style="position: relative">
    <v-row class="fill-height ma-0 px-12">
      <v-col
        cols="12"
        class="ma-0 d-flex align-lg-center justify-space-between"
        style="border: #8e8e8e 0.3px solid; border-radius: 0.2rem; height: 50px"
      >
        <v-card-title cols="9" card-title primary-title class="text-h5"
          >📅 Calendario de turnos</v-card-title
        >
        <div cols="3" class="d-flex align-center">
          <v-col class="d-flex flex-column align-center pa-6">
            <v-btn
              color="primary"
              class="ma-3"
              style="width: 100%"
              @click="handleCreateTurno"
              >+ Nuevo Turno</v-btn
            >
          </v-col>
          <v-col class="d-flex flex-column align-center pa-6">
            <v-btn @click="configCob = !configCob" icon class="ma-3">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </v-col>
        </div>
      </v-col>
      <v-col
        cols="12"
        class="ma-0 d-flex align-lg-center justify-space-between"
        style="
          position: relative;
          border: #8e8e8e 0.3px solid;
          border-radius: 0.2rem;
          height: 70px;
        "
      >
        <v-col cols="5">
          <div class="d-flex align-center">
            <v-btn class="ma-1" height="20px" small outlined @click="prev">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn class="ma-2" height="20px" small outlined @click="next">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>

            <v-toolbar-title
              v-if="$refs.calendar && $refs.calendar.title"
              class="text-capitalize text-subtitle-1"
            >
              {{ $refs.calendar.title.toUpperCase() }}
            </v-toolbar-title>
          </div>
        </v-col>
        <section
          style="
            display: flex;
            justify-content: space-between;
            margin: 10px 50px;
          "
        >
          <v-btn-toggle v-model="type" outlined class="d-flex">
            <v-btn
              value="month"
              height="35px"
              class="text-capitalize text-subtitle-2"
            >
              <span class="hidden-sm-and-down">Mes</span>
            </v-btn>
            <v-btn
              @click="setToCurrentDate"
              value="week"
              height="35px"
              class="text-capitalize text-subtitle-2"
            >
              <span class="hidden-sm-and-down">Semana</span>
            </v-btn>
            <v-btn
              @click="setToCurrentDate"
              value="day"
              height="35px"
              class="text-capitalize text-subtitle-2"
            >
              <span class="hidden-sm-and-down">Diario</span>
            </v-btn>
            <v-btn
              value="list"
              height="35px"
              class="text-capitalize text-subtitle-2"
            >
              <span class="hidden-sm-and-down">Agenda</span>
            </v-btn>
          </v-btn-toggle>
        </section>
      </v-col>
      <!--calendario-->
      <v-col
        cols="12"
        class="pa-0 border-b-lg"
        style="border: #8e8e8e 0.3px solid; border-radius: 0.2rem"
      >
        <v-sheet height="fill-height" width="99.9%">
          <v-container v-show="type === 'list'">
            <v-card class="mt-4">
              <v-card-title>Eventos del mes</v-card-title>
              <v-list class="overflow-y-auto" style="max-height: 400px">
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
                              timeZone: "UTC",
                            }).format(new Date(date + "T00:00:00Z"))
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
                                <span
                                  class="font-weight-bold"
                                  style="font-size: 1rem"
                                >
                                  {{
                                    new Date(event.start).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  }}
                                </span>
                                <span class="font-weight-bold">
                                  {{ event.category }} </span
                                >-
                                <span
                                  class="font-weight-bold"
                                  :style="{
                                    color: event.color,
                                  }"
                                >
                                  {{ event.nombre_tratamiento }}
                                </span>
                                -
                                {{ event.name }} {{ event.apellido_paciente }}
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
            :type="calendarType"
            :events="events"
            :event-overlap-mode="'column'"
            :event-overlap-threshold="60"
            :event-color="getEventColor"
            :categories="categories"
            @change="onCalendarChange"
            @click:event="showEvent"
            @click:more="handleClickMore"
            :interval-height="60"
            :interval-count="intervalCount"
            :interval-minutes="intervalMinutes"
            :first-time="'07:00'"
            locale="es"
          >
            <template v-slot:event="{ event }">
              <v-tooltip
                top
                content-class="custom-tooltip"
                :style="{
                  '--tooltip-border-color': event.color, // Define una variable CSS
                  '--tooltip-bg-color': event.colorLigth,
                }"
                open-delay="150"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-if="calendarType === 'week'"
                    class="text-center"
                    :style="{
                      backgroundColor: event.colorLigth,
                      color: event.colorDark,
                    }"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <!-- Información mínima -->
                    <strong>{{ event.category }}</strong>
                    <br />
                    <strong>{{ event.name }}</strong>
                  </div>
                  <div
                    v-else
                    v-bind="attrs"
                    v-on="on"
                    class="text-center"
                    :style="{
                      color: event.colorDark,
                    }"
                  >
                    <!-- Información mínima para otras vistas -->
                    <span class="font-weight-bold"
                      >{{
                        new Date(event.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      }}
                      {{ event.name }} {{ event.apellido_paciente }}</span
                    >
                    <br />
                    <strong>{{ event.nombre_tratamiento }}</strong>
                  </div>
                </template>
                <!-- Contenido del tooltip -->
                <v-card
                  :color="event.colorLigth"
                  elevation="0"
                  :style="{
                    border: `2px solid ${event.color}`,
                  }"
                >
                  <v-card-text
                    class="text-lg-subtitle-1"
                    :style="{ color: event.colorDark }"
                  >
                    <div>
                      <strong>Consultorio:</strong> {{ event.category }}
                    </div>
                    <div>
                      <strong>Tratamiento:</strong>
                      {{ event.nombre_tratamiento }}
                    </div>
                    <div>
                      <strong>Hora:</strong>
                      {{ formatTime(event.start) }} -
                      {{ formatTime(event.end) }}
                    </div>
                    <div>
                      <strong>Duración: </strong>
                      {{ event.duracion_tratamiento }} min
                    </div>
                    <div><strong>Nombre:</strong> {{ event.name }}</div>
                    <div>
                      <strong>Apellido:</strong> {{ event.apellido_paciente }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </template>
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
          <v-btn v-if="isEdit" @click="handleEliminarTurno" icon dark>
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
    <!-- Diálogo para mostrar todos los turnos del día -->
    <v-dialog v-model="dialogDia" max-width="600">
      <v-card>
        <v-card-title> Turnos del día: {{ selectedDate }} </v-card-title>
        <v-card-text>
          <!-- Lista de eventos del día -->
          <v-list>
            <v-list-item v-for="(event, index) in eventsOfDay" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  {{ event.nombre_paciente }} {{ event.apellido_paciente }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <strong>Tratamiento:</strong> {{ event.nombre_tratamiento }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <strong>Hora:</strong> {{ formatTime(event.start) }} -
                  {{ formatTime(event.end) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <strong>Consultorio:</strong>
                  {{ event.nombre_consultorio || "Sin consultorio" }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  :color="event.colorLigth"
                  :style="{
                    color: event.colorDark,
                  }"
                  dark
                  small
                >
                  {{ event.nombre_tratamiento }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialogDia = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="elimiarTurno" max-width="600">
      <v-card>
        <v-toolbar flat height="50px" tile dark color="red">
          <v-toolbar-title> Eliminar Turno </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="text-h6 font-weight-bold my-2">
          ¿Estás seguro de que deseas eliminar este turno?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="elimiarTurno = false">Cancelar</v-btn>
          <v-btn color="green" text @click="eliminarTurno">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="configCob"
      :hide-overlay="true"
      right
      absolute
      temporary
      width="350"
    >
      <v-toolbar flat height="50px" tile dark color="primary">
        <v-btn icon dark @click="configCob = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>Configura la vista</v-toolbar-title>
      </v-toolbar>
      <div class="pa-4">
        <div class="font-weight-bold my-4">Dias de la semana a mostrar</div>
        <v-select
          v-model="weekday"
          :items="weekdays"
          dense
          outlined
          hide-details
        ></v-select>
        <hr class="my-4" style="border-color: #ccc; width: 100%" />
        <div class="font-weight-bold my-4">Intervalos de hora</div>
        <v-slider
          v-model="intervalMinutes"
          :min="15"
          :max="60"
          :step="15"
          label="Cada x minutos"
          thumb-label="always"
        />
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    turnos: [],
    intervalMinutes: parseInt(localStorage.getItem("intervalMinutes")) || 30,
    type: localStorage.getItem("defaultView") || "day",
    today: new Date().toISOString().slice(0, 10),
    types: [
      { text: "Mes", value: "month" },
      { text: "Semana", value: "week" },
      { text: "Día", value: "day" },
      { text: "Lista", value: "list" },
    ],
    weekday: localStorage.getItem("weekday") || [1, 2, 3, 4, 5, 6, 0],
    weekdays: [
      { text: "Lun - Vie", value: [1, 2, 3, 4, 5] },
      { text: "Lun - Sab", value: [1, 2, 3, 4, 5, 6] },
      { text: "Lun - Dom", value: [1, 2, 3, 4, 5, 6, 0] },
    ],
    value:
      localStorage.getItem("selectedDate") ||
      new Date().toISOString().split("T")[0],
    currentMonth: null, // Nuevo dato para almacenar el mes actual
    currentYear: null, // Nuevo dato para almacenar el año actual
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    events: [],
    dialog: false,
    dialogDia: false,
    elimiarTurno: false,
    configCob: false,
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
    categories: [],
    selectedDate: null,
    eventsOfDay: [],
    // validarDatosTurno: false,
  }),

  methods: {
    handleConfigCob() {
      this.configCob = true;
    },
    handleEliminarTurno() {
      this.elimiarTurno = true;
    },
    handleClickMore({ date }) {
      // Convertir la fecha a un objeto Date
      const selectedDate = new Date(date);

      // Filtrar los turnos del día seleccionado
      this.eventsOfDay = this.events.filter((event) => {
        const eventDate = event.start.toISOString().split("T")[0];
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        return eventDate === selectedDateStr;
      });

      // Mostrar el diálogo
      this.selectedDate = selectedDate.toLocaleDateString();
      this.dialogDia = true;
    },
    formatTime(date) {
      // Formatear la hora en formato HH:MM
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },

    setToCurrentDate() {
      this.value = new Date().toISOString().split("T")[0]; // Establecer la fecha actual en el formato YYYY-MM-DD
      this.updateCategories(); // Actualiza las categorías si es necesario
      this.getEvents(); // Vuelve a cargar los eventos para la nueva fecha
    },
    updateCategories() {
      const selectedDate = this.value; // Fecha seleccionada en el calendario

      console.log("consultorios:", this.consultorios);
      // Filtrar los consultorios que tienen eventos en la fecha seleccionada
      const consultoriosConTurnos = this.consultorios.filter((consultorio) => {
        return this.events.some((event) => {
          const eventDate = new Date(event.start).toISOString().split("T")[0]; // Formato YYYY-MM-DD
          return (
            eventDate === selectedDate && event.category === consultorio.nombre
          );
        });
      });

      // Actualizar la propiedad categories
      this.categories = consultoriosConTurnos.map((c) => c.nombre);
      console.log("Categorías actualizadas:", this.categories);
    },
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
      } catch (error) {
        console.error("Error al cargar turnos:", error);
      }
    },
    getEvents() {
      this.events = [];
      // console.log("Consultorios:", this.consultorios);
      console.log("Turnos:", this.turnos);

      const eventos = this.turnos.map((turno) => {
        const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`);
        const duracion = turno.duracion_tratamiento;
        const fechaHoraFin = new Date(
          fechaHoraInicio.getTime() + duracion * 60000
        );

        const colorDark = this.isValidHexColor(turno.color_tratamiento)
          ? this.darkenColor(turno.color_tratamiento, 0.6)
          : null;
        const colorLigth = this.isValidHexColor(turno.color_tratamiento)
          ? this.lightenColor(turno.color_tratamiento, 0.4)
          : null;

        console.log("turno.color_tratamiento:", turno.color_tratamiento);
        console.log("colorDark:", colorDark);

        const nombreConsultorio = turno.nombre_consultorio || "Sin consultorio";
        return {
          id_turno: turno.id_turno,
          id_paciente: turno.id_paciente,
          id_consultorio: turno.id_consultorio,
          id_tratamiento: turno.id_tratamiento,
          nombre_tratamiento: turno.nombre_tratamiento,
          name: turno.nombre_paciente,
          apellido_paciente: turno.apellido_paciente,
          duracion_tratamiento: duracion,
          start: fechaHoraInicio,
          end: fechaHoraFin,
          color: turno.color_tratamiento,
          colorDark: colorDark,
          colorLigth: colorLigth,
          timed: true,
          category: nombreConsultorio,
        };
      });

      // console.log("Eventos generados:", eventos);
      eventos.sort((a, b) => a.start - b.start);
      this.events = eventos;
    },
    darkenColor(hex, factor = 0.2) {
      if (!this.isValidHexColor(hex)) {
        console.warn("Color no válido:", hex);
        return hex; // Retorna el color original si no es válido
      }

      hex = hex.replace("#", "");

      if (hex.length === 8) {
        hex = hex.substring(0, 6);
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      const darkerR = Math.floor(r * (1 - factor));
      const darkerG = Math.floor(g * (1 - factor));
      const darkerB = Math.floor(b * (1 - factor));

      const toHex = (value) => value.toString(16).padStart(2, "0");
      return `#${toHex(darkerR)}${toHex(darkerG)}${toHex(darkerB)}`;
    },

    lightenColor(hex, factor = 0.2) {
      if (!this.isValidHexColor(hex)) {
        console.warn("Color no válido:", hex);
        return hex; // Retorna el color original si no es válido
      }

      hex = hex.replace("#", "");
      if (hex.length === 8) {
        hex = hex.substring(0, 6);
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Aclarar los colores incrementando los valores RGB
      const lighterR = Math.min(255, r + Math.floor((255 - r) * factor));
      const lighterG = Math.min(255, g + Math.floor((255 - g) * factor));
      const lighterB = Math.min(255, b + Math.floor((255 - b) * factor));

      const toHex = (value) => value.toString(16).padStart(2, "0");
      return `#${toHex(lighterR)}${toHex(lighterG)}${toHex(lighterB)}`;
    },
    isValidHexColor(hex) {
      return /^#([A-Fa-f0-9]{6}([A-Fa-f0-9]{2})?|[A-Fa-f0-9]{3})$/.test(hex);
    },

    onCalendarChange({ start }) {
      const date = new Date(start.date);
      this.currentMonth = date.getUTCMonth();
      this.currentYear = date.getUTCFullYear();
      this.value = start.date; // Actualizar `value` con la nueva fecha
      this.updateCategories(); // Actualizar categorías si es necesario
      this.getEvents(); // Actualizar eventos si es necesario
    },
    prev() {
      if (this.$refs.calendar) {
        this.$refs.calendar.prev();
        this.$refs.calendar.update(); // Forzar la actualización del calendario
        this.updateValue();
      }
    },
    next() {
      if (this.$refs.calendar) {
        this.$refs.calendar.next();
        this.$refs.calendar.update(); // Forzar la actualización del calendario
        this.updateValue();
      }
    },
    getEventColor(event) {
      return event.colorLigth;
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
      this.elimiarTurno = false;
    },
    onDateChange(newDate) {
      this.picker = newDate; // Actualizar la fecha seleccionada
      this.$forceUpdate(); // Forzar la actualización de la vista
    },
  },
  created() {
    this.fetchConsultoriosyTratamientos();
  },
  async mounted() {
    const savedView = localStorage.getItem("defaultView");
    const savedWeekday = localStorage.getItem("weekday");
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
      this.value = savedDate; // Restaurar la fecha seleccionada
    } else {
      this.value = new Date().toISOString().split("T")[0]; // Usar la fecha actual si no hay fecha guardada
    }

    if (savedWeekday) {
      console.log("savedWeekday:", savedWeekday);
      this.weekday = JSON.parse(savedWeekday);
    }

    if (savedView) {
      console.log("savedView:", savedView);
      this.type = savedView; // Restaurar la vista guardada al cargar el componente
    }
    if (this.type === "day") {
      this.type = "category";
    }

    await this.fetchConsultoriosyTratamientos(); // Asegúrate de que esta función retorne una promesa
    await this.cargarTurnos();
    await this.cargarPacientes();
    await this.getEvents();

    this.updateCategories();
    this.groupedEventsByDay();
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
    intervalMinutes(newVal) {
      localStorage.setItem("intervalMinutes", newVal);
    },
    value(newValue) {
      localStorage.setItem("selectedDate", newValue); // Guardar la fecha seleccionada
      this.updateCategories();
    },

    type(newType) {
      localStorage.setItem("defaultView", newType); // Guardar cambios en localStorage
      this.$nextTick(() => {
        if (this.$refs.calendar) {
          this.$refs.calendar.update();
          this.$forceUpdate(); // Forzar la actualización de la vista
        }
      });
    },

    weekday(newWeekday) {
      localStorage.setItem("weekday", JSON.stringify(newWeekday)); // Guardar cambios en localStorage
      this.$nextTick(() => {
        if (this.$refs.calendar) {
          this.$refs.calendar.update();
          this.$forceUpdate(); // Forzar la actualización de la vista
        }
      });
    },

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
    turnos() {
      this.$nextTick(() => {
        this.getEvents();
      });
    },
  },
  computed: {
    calendarType() {
      if (this.type === "list") {
        return "month";
      }
      console.log();
      return this.type === "day" ? "category" : this.type;
    },
    // calendarCategories() {
    //   // Obtener la fecha seleccionada en el calendario
    //   const selectedDate = this.picker; // Asumiendo que `picker` es la fecha seleccionada

    //   // Filtrar los consultorios que tienen eventos en la fecha seleccionada
    //   const consultoriosConTurnos = this.consultorios.filter((consultorio) => {
    //     return this.events.some((event) => {
    //       const eventDate = new Date(event.start).toISOString().split("T")[0]; // Formato YYYY-MM-DD
    //       return (
    //         eventDate === selectedDate && event.category === consultorio.nombre
    //       );
    //     });
    //   });

    //   // Devolver solo los nombres de los consultorios que tienen turnos en la fecha seleccionada
    //   console.log(
    //     "Consultorios con turnos en la fecha seleccionada:",
    //     consultoriosConTurnos
    //   );
    //   return consultoriosConTurnos.map((c) => c.nombre);
    // },
    groupedEventsByDay() {
      if (this.currentMonth === null || this.currentYear === null) return {};
      const grouped = this.events.reduce((acc, event) => {
        const eventDate = new Date(event.start + "Z"); // Asegúrate de interpretar como UTC
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
    intervalCount() {
      if (this.intervalMinutes === 15) {
        return 64; // 15 minutos → 64 intervalos
      } else if (this.intervalMinutes === 30) {
        return 32; // 30 minutos → 32 intervalos
      } else if (this.intervalMinutes === 45) {
        return 24; // 45 minutos → 24 intervalos
      } else if (this.intervalMinutes === 60) {
        return 16; // 60 minutos → 16 intervalos
      }
      return 32; // valor por defecto, en caso de que algo falle
    },
  },
};
</script>

<style scoped>
.custom-tooltip {
  background-color: var(--tooltip-bg-color) !important;
  opacity: 1 !important;
}
</style>
