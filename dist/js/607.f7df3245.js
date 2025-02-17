"use strict";(self["webpackChunkpvn_fe"]=self["webpackChunkpvn_fe"]||[]).push([[607],{88607:function(e,t,a){a.r(t),a.d(t,{default:function(){return u}});var o=function(){var e=this,t=e._self._c;return t("v-container",[t("v-row",{staticClass:"mt-5"},[t("v-col",{attrs:{cols:"12",md:"6"}},[t("v-menu",{ref:"menuFechaFiltro",attrs:{"close-on-content-click":!1,transition:"scale-transition","offset-y":"","min-width":"290px"},scopedSlots:e._u([{key:"activator",fn:function({on:a,attrs:o}){return[t("v-text-field",e._g(e._b({attrs:{label:"Filtrar por Fecha","prepend-icon":"mdi-calendar",readonly:"",outlined:"",dense:""},model:{value:e.filtroFecha,callback:function(t){e.filtroFecha=t},expression:"filtroFecha"}},"v-text-field",o,!1),a))]}}]),model:{value:e.menuFechaFiltro,callback:function(t){e.menuFechaFiltro=t},expression:"menuFechaFiltro"}},[t("v-date-picker",{on:{input:function(t){e.menuFechaFiltro=!1}},model:{value:e.filtroFecha,callback:function(t){e.filtroFecha=t},expression:"filtroFecha"}})],1)],1),t("v-col",{staticClass:"d-flex align-center justify-center",attrs:{cols:"12",md:"6"}},[t("v-btn",{attrs:{color:"primary"},on:{click:e.cargarTurnos}},[e._v("Filtrar Turnos")])],1)],1),t("v-card",[t("v-card-title",{staticClass:"text-h5"},[e._v("Turnos Programados")]),t("v-card-text",[t("v-simple-table",[t("thead",[t("tr",[t("th",[e._v("Seleccionar")]),t("th",[e._v("Paciente")]),t("th",[e._v("Consultorio")]),t("th",[e._v("Fecha")]),t("th",[e._v("Hora")]),t("th",[e._v("Teléfono")])])]),t("tbody",e._l(e.turnos,(function(a){return t("tr",{key:a.id_turno},[t("td",[t("v-checkbox",{attrs:{value:a.id_turno,label:"Turno "+a.id_turno},model:{value:e.turnosSeleccionados,callback:function(t){e.turnosSeleccionados=t},expression:"turnosSeleccionados"}})],1),t("td",[e._v(e._s(a.nombre_paciente))]),t("td",[e._v(e._s(a.consultorio))]),t("td",[e._v(e._s(a.fecha))]),t("td",[e._v(e._s(a.hora))]),t("td",[e._v(e._s(a.telefono))])])})),0)])],1)],1),t("v-card",{staticClass:"mt-5"},[t("v-card-title",{staticClass:"text-h5"},[e._v("Escribir Mensaje")]),t("v-card-text",[t("v-textarea",{attrs:{label:"Escribe el mensaje para enviar por WhatsApp",outlined:"",dense:"",rows:"4",required:""},model:{value:e.mensaje,callback:function(t){e.mensaje=t},expression:"mensaje"}}),t("v-alert",{staticClass:"mt-3",attrs:{type:"info"}},[e._v(" Puedes usar los siguientes marcadores en el mensaje para personalizarlo: "),t("ul",[t("li",[t("b",[e._v("{PACIENTE}")]),e._v(": Nombre del paciente")]),t("li",[t("b",[e._v("{CONSULTORIO}")]),e._v(": Nombre del consultorio")]),t("li",[t("b",[e._v("{TRATAMIENTO}")]),e._v(": Tratamiento asignado")]),t("li",[t("b",[e._v("{FECHA}")]),e._v(": Fecha del turno")]),t("li",[t("b",[e._v("{HORA}")]),e._v(": Hora del turno")])])])],1),t("v-card-actions",[t("v-btn",{attrs:{color:"primary"},on:{click:e.enviarNotificaciones}},[e._v("Enviar Notificaciones")])],1)],1)],1)},r=[],n=(a(98992),a(54520),a(81454),a(94373)),s={data(){return{menuFechaFiltro:!1,filtroFecha:"",turnos:[],turnosSeleccionados:[],mensaje:""}},methods:{async cargarTurnos(){try{const e=await n.A.get("/turnos/calendario",{params:{fecha:this.filtroFecha}});this.turnos=e.data}catch(e){console.error("Error al cargar turnos:",e),this.$toast.error("Error al cargar los turnos.")}},async enviarNotificaciones(){if(this.mensaje&&0!==this.turnosSeleccionados.length)try{const e=this.turnos.filter((e=>this.turnosSeleccionados.includes(e.id_turno))).map((e=>({idTurno:e.id_turno,numero:e.telefono})));await n.A.post("/enviar-notificaciones",{turnos:e,mensajeBase:this.mensaje});this.$toast.success("Notificaciones enviadas con éxito."),this.turnosSeleccionados=[],this.mensaje=""}catch(e){console.error("Error al enviar notificaciones:",e),this.$toast.error("Error al enviar las notificaciones.")}else this.$toast.error("Por favor, seleccione al menos un turno y escriba un mensaje.")}},mounted(){this.cargarTurnos()}},i=s,c=a(81656),l=(0,c.A)(i,o,r,!1,null,"ab0c8918",null),u=l.exports}}]);
//# sourceMappingURL=607.f7df3245.js.map