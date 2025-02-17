"use strict";(self["webpackChunkpvn_fe"]=self["webpackChunkpvn_fe"]||[]).push([[337],{96337:function(t,o,i){i.r(o),i.d(o,{default:function(){return d}});var a=function(){var t=this,o=t._self._c;return o("v-container",[o("h1",{staticClass:"text-h4"},[t._v("Gestionar Consultorios")]),o("v-row",{staticClass:"ma-11"},[o("v-col",[o("v-card",{staticClass:"pa-4 d-flex flex-column justify-center align-center",attrs:{outlined:""}},[o("v-card-title",[t._v("Agregar Consultorio")]),o("v-card-subtitle",[t._v("Agrega un consultorio para gestionar sus turnos")]),o("v-btn",{attrs:{outlined:"",color:"primary",dark:""},on:{click:t.handleCreateConsultorio}},[t._v("+ Agregar Consultorio")])],1)],1),o("v-col",{staticClass:"d-flex flex-column justify-start"},[o("v-card",{staticClass:"pa-4 d-flex flex-column justify-center align-center",attrs:{outlined:""}},[o("v-card-title",[t._v("Agregar Tratamientos")]),o("v-card-subtitle",[t._v("Agrega un tratamiento para gestionar sus turnos")]),o("v-btn",{attrs:{outlined:"",color:"primary",dark:""},on:{click:t.handleCreateTratamiento}},[t._v("+ Agregar Tratamiento")])],1)],1)],1),o("v-row",{staticClass:"ma-11 d-flex justify-lg-space-around"},[o("v-col",{attrs:{cols:"6",md:"4"}},[o("h3",[t._v("Listado de Consultorios")]),t._l(t.consultorios,(function(i){return o("v-hover",{key:i.id_consultorio,scopedSlots:t._u([{key:"default",fn:function({hover:a}){return[o("v-card",{staticClass:"mb-2 position-relative",staticStyle:{"background-color":"#b8b8b8"},attrs:{outlined:""}},[o("v-card-title",{staticClass:"text-h6"},[t._v(" "+t._s(i.nombre)+" ")]),o("v-card-subtitle",[i.tratamientos&&i.tratamientos.length>0?o("div",t._l(i.tratamientos,(function(i){return o("v-chip",{key:i.id_tratamiento,staticClass:"mb-1 mr-1",attrs:{color:i.color,"text-color":"black"}},[o("strong",[t._v(t._s(i.nombre))]),t._v(" - "+t._s(i.descripcion)+" ("+t._s(i.duracion)+") ")])})),1):o("div",[t._v("No hay tratamientos asociados.")])]),o("div",{staticClass:"pa-2 transition-swing",staticStyle:{"z-index":"10",position:"absolute",right:"0",top:"0"},style:{opacity:a?1:0}},[o("v-btn",{attrs:{color:"#222222",icon:"",small:""},on:{click:function(o){return t.editarConsultorio(i)}}},[o("v-icon",[t._v("mdi-pencil")])],1),o("v-btn",{staticClass:"ml-2",attrs:{color:"#222222",icon:"",small:""},on:{click:function(o){return t.borrarConsultorio(i)}}},[o("v-icon",[t._v("mdi-delete")])],1)],1)],1)]}}],null,!0)})}))],2),o("v-col",{attrs:{cols:"6",md:"4"}},[o("h3",[t._v("Listado de Tratamientos")]),t._l(t.tipoTratamientos,(function(i){return o("v-hover",{key:i.id_tratamiento,scopedSlots:t._u([{key:"default",fn:function({hover:a}){return[o("v-card",{staticClass:"ma-2 pa-2 d-flex flex-column justify-center align-center",staticStyle:{position:"relative"},attrs:{color:i.color}},[o("v-card-title",{staticClass:"text-h6 font-weight-bold ma-0 pa-0"},[t._v(t._s(i.nombre.toUpperCase()))]),o("v-card-subtitle",{staticClass:"text-subtitle-1 ma-0 pa-0"},[t._v(t._s(i.descripcion))]),o("v-card-subtitle",{staticClass:"text-subtitle-1 ma-0 pa-0"},[t._v(" "+t._s(i.duracion)+" min ")]),o("v-card-title",{staticClass:"text-subtitle-1 ma-0 pa-0"},[t._v("$ "+t._s(i.costo))]),o("div",{staticClass:"pa-2 transition-ease-in-out",staticStyle:{"z-index":"10",position:"absolute",right:"0",top:"0"},style:{opacity:a?1:0}},[o("v-btn",{attrs:{color:"#222222",icon:"",small:""},on:{click:function(o){return t.editarTratamiento(i)}}},[o("v-icon",[t._v("mdi-pencil")])],1),o("v-btn",{attrs:{color:"#222222",icon:"",small:""},on:{click:function(o){return t.borrarTratamiento(i)}}},[o("v-icon",[t._v("mdi-delete")])],1)],1)],1)]}}],null,!0)})}))],2)],1),o("v-dialog",{attrs:{scrollable:"",width:"35vw",persistent:"",transition:"slide-x-transition"},model:{value:t.dialog,callback:function(o){t.dialog=o},expression:"dialog"}},[o("v-card",[o("v-toolbar",{attrs:{flat:"",height:"50px",tile:"",dark:"",color:"primary"}},[o("v-btn",{attrs:{icon:"",dark:""},on:{click:t.closeDialog}},[o("v-icon",[t._v("mdi-close")])],1),o("v-toolbar-title",[t._v(t._s(t.isEdit?"Editar Consultorio":"Agregar Consultorio"))])],1),o("v-card-text",[o("v-text-field",{attrs:{label:"Nombre del Consultorio"},model:{value:t.newConsultorio,callback:function(o){t.newConsultorio=o},expression:"newConsultorio"}}),o("v-select",{attrs:{label:"Tratamientos",items:t.tipoTratamientos,"item-text":t=>t.nombre,"item-value":t=>t.id_tratamiento,outlined:"",dense:"",multiple:"",chips:"","closable-chips":"",required:""},scopedSlots:t._u([{key:"selection",fn:function({item:i,index:a}){return[a<3?o("v-chip",{key:i.id_tratamiento,staticClass:"ma-1",attrs:{color:i.color,small:"",close:""},on:{"click:close":function(o){return t.removeTratamiento(i)}}},[t._v(" "+t._s(i.nombre)+" ")]):t._e(),3===a?o("span",[t._v("+"+t._s(t.selectedTratamientos.length-3)+" más")]):t._e()]}},{key:"item",fn:function({item:i}){return[o("v-list-item-content",[o("v-list-item-title",[o("v-avatar",{staticClass:"mr-2",attrs:{size:"12",color:i.color}}),t._v(" "+t._s(i.nombre)+" ")],1)],1)]}}]),model:{value:t.selectedTratamientos,callback:function(o){t.selectedTratamientos=o},expression:"selectedTratamientos"}})],1),o("v-card-actions",[o("v-spacer"),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.closeDialog}},[t._v("Cancelar")]),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.createConsultorio}},[t._v(t._s(t.isEdit?"Editar":"Guardar"))])],1)],1)],1),o("v-dialog",{attrs:{scrollable:"",persistent:"",overlay:!1,"max-width":"500px",transition:"dialog-transition"},model:{value:t.eliminarDialog,callback:function(o){t.eliminarDialog=o},expression:"eliminarDialog"}},[o("v-card",[o("v-toolbar",{attrs:{flat:"",height:"50px",tile:"",dark:"",color:"primary"}},[o("v-btn",{attrs:{icon:"",dark:""},on:{click:function(o){t.eliminarDialog=!1}}},[o("v-icon",[t._v("mdi-close")])],1),o("v-toolbar-title",[t._v("Eliminar Consultorio")])],1),o("v-card-text",[o("p",{staticClass:"text-h6 font-weight-bold ma-4"},[t._v(" ¿Estás seguro de que deseas eliminar el consultorio "+t._s(t.consultorioToDelete?.nombre)+"? ")])]),o("v-card-actions",[o("v-spacer"),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(o){t.eliminarDialog=!1}}},[t._v("Cancelar")]),o("v-btn",{attrs:{color:"red darken-1",text:""},on:{click:t.confirmarEliminacion}},[t._v("Eliminar")])],1)],1)],1),o("v-dialog",{attrs:{scrollable:"",width:"35vw",persistent:"",transition:"slide-x-transition"},model:{value:t.tratamientoDialog,callback:function(o){t.tratamientoDialog=o},expression:"tratamientoDialog"}},[o("v-card",[o("v-toolbar",{attrs:{flat:"",height:"50px",tile:"",dark:"",color:"primary"}},[o("v-btn",{attrs:{icon:"",dark:""},on:{click:function(o){t.tratamientoDialog=!1}}},[o("v-icon",[t._v("mdi-close")])],1),o("v-toolbar-title",[t._v(t._s(t.isEdit?"Editar Tratamiento":"Agregar Tratamiento"))])],1),o("v-card-text",[o("v-text-field",{attrs:{label:"Nombre del Tratamiento"},model:{value:t.newTratamiento,callback:function(o){t.newTratamiento=o},expression:"newTratamiento"}}),o("v-text-field",{attrs:{label:"Descripción"},model:{value:t.descripcion,callback:function(o){t.descripcion=o},expression:"descripcion"}}),o("v-text-field",{attrs:{type:"number",label:"Precio"},model:{value:t.precio,callback:function(o){t.precio=o},expression:"precio"}}),o("v-text-field",{attrs:{type:"number",label:"Duración",suffix:"minutos"},model:{value:t.duracion,callback:function(o){t.duracion=o},expression:"duracion"}})],1),o("span",{staticClass:"font-weight-bold ma-2 text-h6"},[t._v("Color:")]),o("div",{staticClass:"d-flex justify-lg-space-around"},[t._l(t.buttonColors,(function(i,a){return o("v-btn",{key:a,staticClass:"d-flex justify-center align-center",staticStyle:{padding:"10px 5px",position:"relative",overflow:"hidden"},style:{borderColor:t.isColorSelected(i)?i:"#989898"},attrs:{small:"",outlined:"",value:i,color:t.isColorSelected(i)?i:"#989898"},on:{click:function(o){return t.selectColor(i)}}},[o("div",{style:{backgroundColor:i,width:"90%",height:"60%",borderRadius:"0.3rem",aspectRatio:"16 / 9"}})])})),o("v-menu",{attrs:{"close-on-content-click":!1,"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function({on:i,attrs:a}){return[o("v-btn",t._g(t._b({staticClass:"d-flex justify-center align-center",staticStyle:{padding:"10px 5px",position:"relative",overflow:"hidden"},attrs:{small:"",outlined:"",color:t.iconColor}},"v-btn",a,!1),i),[o("v-icon",{attrs:{color:t.iconColor}},[t._v("mdi-palette")])],1)]}}]),model:{value:t.menu,callback:function(o){t.menu=o},expression:"menu"}},[o("v-card",[o("v-card-text",[o("v-color-picker",{attrs:{mode:"hexa","show-swatches":"","swatches-max-height":"200"},on:{input:t.selectColor},model:{value:t.selectedColor,callback:function(o){t.selectedColor=o},expression:"selectedColor"}})],1)],1)],1)],2),o("v-card-actions",[o("v-spacer"),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(o){t.tratamientoDialog=!1}}},[t._v("Cancelar")]),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.createTratamiento}},[t._v(t._s(t.isEdit?"Editar":"Guardar"))])],1)],1)],1),o("v-dialog",{attrs:{scrollable:"",persistent:"",overlay:!1,"max-width":"500px",transition:"dialog-transition"},model:{value:t.eliminarTratamientoDialog,callback:function(o){t.eliminarTratamientoDialog=o},expression:"eliminarTratamientoDialog"}},[o("v-card",[o("v-toolbar",{attrs:{flat:"",height:"50px",tile:"",dark:"",color:"primary"}},[o("v-btn",{attrs:{icon:"",dark:""},on:{click:function(o){t.eliminarTratamientoDialog=!1}}},[o("v-icon",[t._v("mdi-close")])],1),o("v-toolbar-title",[t._v("Eliminar Tratamiento")])],1),o("v-card-text",[o("p",{staticClass:"text-h6 font-weight-bold ma-4"},[t._v(" ¿Estás seguro de que deseas eliminar el tratamiento "+t._s(t.tratamientoToDelete?.nombre)+"? ")])]),o("v-card-actions",[o("v-spacer"),o("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(o){t.eliminarTratamientoDialog=!1}}},[t._v("Cancelar")]),o("v-btn",{attrs:{color:"red darken-1",text:""},on:{click:t.confirmarEliminacionTratamiento}},[t._v("Eliminar")])],1)],1)],1)],1)},e=[],r=(i(98992),i(54520),i(81454),i(94373)),s={data(){return{menu:!1,selectedColor:null,buttonColors:["#8c57ff","#0d9394","#ffb400","#ff4c51","#16b1ff"],consultorios:[],selectedTratamientos:[],dialog:!1,tratamientoDialog:!1,isEdit:!1,eliminarDialog:!1,eliminarTratamientoDialog:!1,newConsultorio:"",newTratamiento:"",tipoTratamientos:[],consultorioToEdit:null,consultorioToDelete:null,tratamientoToEdit:null,tratamientoToDelete:null,descripcion:"",precio:"",duracion:""}},methods:{selectColor(t){this.selectedColor=t,this.menu=!1},isColorSelected(t){return this.selectedColor===t||!this.buttonColors.includes(this.selectedColor)},removeTratamiento(t){this.selectedTratamientos=this.selectedTratamientos.filter((o=>o!==t.id_tratamiento))},closeDialog(){this.dialog=!1},onTratamientoSeleccionado(t){console.log("Tratamientos seleccionados:",t)},selectColor(t){this.selectedColor=t},openColorPicker(){this.$refs.colorPicker.click()},async fetchTratamientos(){try{const t=await r.A.get("/tratamientos");this.tipoTratamientos=t.data.sort(((t,o)=>t.id_tratamiento-o.id_tratamiento))}catch(t){console.error("Error fetching tratamientos:",t)}},async fetchConsultoriosyTratamientos(){try{const t=await r.A.get("/consultorios/tratamientos");console.log(t.data),this.consultorios=t.data.map((t=>({id_consultorio:t.id_consultorio,nombre:t.nombre_consultorio,tratamientos:t.tratamientos.map((t=>({id_tratamiento:t.id_tratamiento,nombre:t.nombre,descripcion:t.descripcion,costo:t.costo,duracion:t.duracion,color:t.color})))}))).sort(((t,o)=>t.id_consultorio-o.id_consultorio)),console.log("Consultorios cargados:",this.consultorios)}catch(t){console.error("Error fetching consultorios and tratamientos:",t)}},async createConsultorio(){this.isEdit?await this.updateConsultorio(this.consultorio):await this.addConsultorio(),this.dialog=!1},async addConsultorio(){try{await r.A.post("/consultorios",{nombre:this.newConsultorio,tratamientos:this.selectedTratamientos});this.fetchConsultoriosyTratamientos(),this.dialog=!1}catch(t){console.error("Error al crear el consultorio:",t)}},handleCreateConsultorio(){this.dialog=!this.dialog,this.isEdit=!1},async editarConsultorio(t){this.isEdit=!0,this.consultorioToEdit=t.id_consultorio,this.dialog=!0,this.newConsultorio=t.nombre,t.tratamientos.length>0?this.selectedTratamientos=t.tratamientos.map((t=>({id_tratamiento:t.id_tratamiento,nombre:t.nombre,color:t.color}))):this.selectedTratamientos=[]},async updateConsultorio(){if(console.log("ID del consultorio a actualizar:",this.consultorioToEdit,"Tratamientos seleccionados:",this.selectedTratamientos),Array.isArray(this.selectedTratamientos))try{await r.A.put(`/consultorios/${this.consultorioToEdit}`,{nombre:this.newConsultorio,tratamientos:this.selectedTratamientos});await this.fetchConsultoriosyTratamientos()}catch(t){console.error("Error al actualizar el consultorio:",t)}else console.error("Error: selectedTratamientos debe ser un array.")},async borrarConsultorio(t){this.eliminarDialog=!0,this.consultorioToDelete=t},async confirmarEliminacion(){await this.eliminarConsultorio(this.consultorioToDelete),this.eliminarDialog=!1},async eliminarConsultorio(t){console.log("ID del consultorio a eliminar:",t.id_consultorio);try{await r.A.delete(`/consultorios/${t.id_consultorio}`),await this.fetchConsultoriosyTratamientos()}catch(o){console.error("Error al eliminar el consultorio:",o)}},async editarTratamiento(t){this.isEdit=!0,this.tratamientoToEdit=t.id_tratamiento,this.tratamientoDialog=!0,this.newTratamiento=t.nombre,this.descripcion=t.descripcion,this.precio=t.costo,this.duracion=t.duracion,this.selectedColor=t.color},async confirmarEliminacionTratamiento(){await this.eliminarTratamiento(this.tratamientoToDelete),this.eliminarTratamientoDialog=!1},async borrarTratamiento(t){this.eliminarTratamientoDialog=!0,this.tratamientoToDelete=t},async eliminarTratamiento(t){try{await r.A.delete(`/tratamientos/${t.id_tratamiento}`),await this.fetchTratamientos(),await this.fetchConsultoriosyTratamientos()}catch(o){o.response?400===o.response.status?alert(o.response.data.message):404===o.response.status?alert("Tratamiento no encontrado"):alert("Error al eliminar el tratamiento"):console.error("Error desconocido:",o.message)}},handleCreateTratamiento(){this.tratamientoDialog=!this.tratamientoDialog,this.isEdit=!1},async createTratamiento(t){this.isEdit?await this.updateTratamiento(t):await this.addTratamiento(),this.tratamientoDialog=!1},async addTratamiento(){try{await r.A.post("/tratamientos",{nombre:this.newTratamiento,descripcion:this.descripcion,costo:this.precio,duracion:this.duracion,color:this.selectedColor});this.fetchTratamientos(),this.tratamientoDialog=!1}catch(t){console.error("Error al crear el tratamiento:",t)}},async updateTratamiento(){try{await r.A.put(`/tratamientos/${this.tratamientoToEdit}`,{nombre:this.newTratamiento,descripcion:this.descripcion,costo:this.precio,duracion:this.duracion,color:this.selectedColor});await this.fetchTratamientos()}catch(t){console.error("Error al actualizar el tratamiento:",t)}}},watch:{dialog(t){t||(this.newConsultorio="",this.selectedColor=null,this.selectedTratamientos=null,this.consultorioToEdit=null,this.isEdit=!1)},tratamientoDialog(t){t||(this.newTratamiento="",this.descripcion="",this.precio="",this.duracion="",this.tratamientoToEdit=null,this.isEdit=!1)}},mounted(){this.fetchConsultoriosyTratamientos(),this.fetchTratamientos()},computed:{iconColor(){return this.selectedColor&&!this.buttonColors.includes(this.selectedColor)?this.selectedColor:"#989898"}}},n=s,l=i(81656),c=(0,l.A)(n,a,e,!1,null,"fd2b8718",null),d=c.exports}}]);
//# sourceMappingURL=337.0432cc8e.js.map