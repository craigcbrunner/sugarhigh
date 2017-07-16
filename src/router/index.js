import Vue from 'vue'
import Router from 'vue-router'
import SugarHigh from '@/components/SugarHigh'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SugarHigh',
      component: SugarHigh
    }
  ]
})
