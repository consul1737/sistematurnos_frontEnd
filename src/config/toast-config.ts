import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  draggable: true,
  icon: true, // Mostrar íconos
  transition: 'Vue-Toastification__fade', // Usar animación personalizada
  maxToasts: 3, // Limitar el número máximo de toasts mostrados
}

export { Toast, toastOptions }
