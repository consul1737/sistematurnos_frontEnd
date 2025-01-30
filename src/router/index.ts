import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Definimos las rutas
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue'), // Lazy-loaded
  },
  {
    path: '/home',
    name: 'home',
    component: import('../views/HomeView.vue'),
    meta: { requiresAuth: true }, // Protección de autenticación
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/turnos',
    name: 'turnos',
    component: () => import('../components/calendarioTurnos.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notifi',
    name: 'notifi',
    component: () => import('../components/Mynotificaciones.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pacientes',
    name: 'pacientes',
    component: () => import('../views/PacientesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/consultorios',
    name: 'consultorios',
    component: () => import('../views/ConsultoriosView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/generate-qr',
    name: 'generate-qr',
    component: () => import('../views/WhatsappView.vue'),
    meta: { requiresAuth: true },
  },
]

// Creamos la instancia del router
const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('session') // Verificar si hay sesión

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/') // Redirigir a login si no está autenticado
  } else if (to.name === 'login' && isAuthenticated) {
    next('/home') // Redirigir a Home si ya está autenticado
  } else {
    next() // Continuar la navegación
  }
})

export default router
