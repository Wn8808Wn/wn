import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:resolve => require(['@/components/login.vue'],resolve)
    },
    {
      path:'/home',
      name:'home',
      component:resolve => require( [ '@/components/home.vue'], resolve )
    }
  ]
})
