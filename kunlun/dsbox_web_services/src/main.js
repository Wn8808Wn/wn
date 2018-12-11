// 引入解决ES6语法的兼容问题
import 'babel-polyfill'
// 引入css
import 'styles/reset.css'
import 'styles/iconfont.css'

import Vue from 'vue'
import App from './App'
import router from './router'

// elementUI库
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入省市县三级联动插件
import Distpicker from 'v-distpicker'

// ajax
import http from './config/api'

import VueWebsocket from 'vue-websocket'
Vue.use(VueWebsocket, 'http://192.168.1.34:15000/signalrHubs')

Vue.config.productionTip = false
Vue.use(elementUI)
Vue.component('v-distpicker', Distpicker)
Vue.use(http)

/* eslint-disable no-new */
// 这个代码要写在最下面，避免配置路由守卫的时候出错
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
