import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: () => import('../components/MyCalendar.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/turnos',
  //   name: 'turnos',
  //   component: () => import('../components/calendarioTurnos.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/notifi',
    name: 'notifi',
    component: () => import('../components/notificaciones.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Pacientes',
    name: 'Pacientes',
    component: () => import('../components/pacientes/Pacientes.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/Consultorios',
    name: 'consul',
    component: () => import('../views/Consultorios.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/generate-qr',
    name: 'consul',
    component: () => import('../views/MyWhatsapp.vue'),
    meta: { requiresAuth: true }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('session');

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/'); // Redirigir a login si no está autenticado
  } else if (to.name === 'login' && isAuthenticated) {
    next('/home'); // Redirigir a Home si ya está autenticado
  } else {
    next(); // Continuar la navegación
  }
});

export default router;
