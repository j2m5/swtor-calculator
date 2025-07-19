import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/MainComponent')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardComponent')
  },
  {
    path: '/builds',
    name: 'Builds',
    component: () => import('../views/BuildsComponent')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
