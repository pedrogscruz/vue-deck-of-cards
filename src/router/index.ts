import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import VueRouter, { RouteConfig } from 'vue-router'
import NewDeck from '../views/NewDeck.vue'

Vue.use(VueCompositionApi)
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/deck/new',
    name: 'NewDeck',
    component: NewDeck
  },
  {
    path: '/',
    redirect: '/deck/new'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
