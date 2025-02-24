export const menuItems = [

  {
    "to": "/profile",
    "icon": "mdi-account",
    "title": "Profile"
  },
  {
    "to": "/home",
    "icon": "mdi-home",
    "title": "Home"
  },
  {
    "to": "/calendario",
    "icon": "mdi-calendar-check",
    "title": "Calendario"
  },
  {
    "to": "/pacientes",
    "icon": "mdi-account-group",
    "title": "Pacientes"
  },
  {
    "to": "/consultorios",
    "icon": "mdi-account-group",
    "title": "Consultorios"
  },
  {
    "to": "/notifi",
    "icon": "mdi-bell",
    "title": "Notificaciones"
  },
  {
    "to": "/generate-qr",
    "icon": "mdi-qrcode",
    "title": "Conexion"
  },
  {
    "isLogout": true,
    "icon": "mdi-logout",
    "title": "Cerrar Sesión"
  }
]

export function getMenuItems() {
  return menuItems.map(item => ({
    ...item,
  }));
}
