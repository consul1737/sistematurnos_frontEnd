// // src/composables/useDialogGlobal.js
// import { ref } from 'vue';

// const dialog = ref(false); // El estado global del diálogo

// // Funciones para abrir y cerrar el diálogo
// const abrirDialog = () => {
//     dialog.value = true;
// };

// const cerrarDialog = () => {
//     dialog.value = false;
// };

// // Si necesitas pasar parámetros como 'pacienteEditar' o 'isEdit', también puedes hacerlo desde aquí.
// const pacienteEditar = ref(null);
// const isEdit = ref(false);

// export function useDialog() {
//     return {
//         dialog,
//         abrirDialog,
//         cerrarDialog,
//         pacienteEditar,
//         isEdit,
//     };
// }
import { ref } from 'vue'

export function useDialog() {
  const dialog = ref(false) // Controla la visibilidad del diálogo
  const data = ref(null) // Almacena cualquier dato asociado al diálogo (e.g., paciente a editar o eliminar)

  const abrirDialog = (payload = null) => {
    data.value = payload // Establece los datos asociados al diálogo
    dialog.value = true // Abre el diálogo
  }

  const cancelDialog = () => {
    data.value = null // Limpia los datos del diálogo
    dialog.value = false // Cierra el diálogo
  }
  const cerrarDialog = () => {
    data.value = null // Limpia los datos del diálogo
    dialog.value = false // Cierra el diálogo
  }

  return {
    dialog,
    data,
    abrirDialog,
    cerrarDialog,
    cancelDialog,
  }
}
