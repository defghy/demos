import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/tinyBugs',
    name: 'tinyBugs',
    component: () => import('@/views/TinyBugList.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
