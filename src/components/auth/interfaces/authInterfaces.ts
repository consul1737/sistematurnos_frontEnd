// Definir la interfaz para el objeto `user`
export interface User {
  email: string
  password: string
}

// Definir la interfaz para el objeto `alert`
export interface Alert {
  show: boolean
  type: 'success' | 'error' | 'info'
  message: string
}
