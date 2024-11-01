import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./views/HomeView.vue')
const Shell = () => import('./views/Shell.vue')
const Menu = () => import('./views/Menu.vue')
const Order = () => import('./views/Order.vue')
const routes = [
  {
    path: '/',
    name: 'shell',
    component: Shell,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
      },
      {
        path: '/menu',
        name: 'menu',
        component: Menu,
      },
      {
        path: '/order',
        name: 'order',
        component: Order,
      },
    ],
  },
  { path: '/:catchAll(.*)', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return Promise.resolve({ left: 0, top: 0 })
  },
})

export default router
