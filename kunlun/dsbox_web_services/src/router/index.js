import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/pages/login/Login')
    }, {
      path: '/manage',
      name: 'manage',
      component: () => import('@/pages/Manage'),
      children: [
        {
          path: '/privatedoc',
          name: 'privatedoc',
          component: () => import('@/pages/privatedoc/PrivateDoc'),
          children: [{
            path: '/docright',
            name: 'docright',
            component: () => import('@/pages/common/Common')
          }]
        }, {
          path: '/teamwork',
          name: 'teamwork',
          component: () => import('@/pages/teamwork/TeamWork'),
          children: [{
            path: '/teamright',
            name: 'teamright',
            component: () => import('@/pages/common/Common')
          }]
        }, {
          path: '/publicres',
          name: 'publicres',
          component: () => import('@/pages/publicres/PublicRes')
        }, {
          path: '/myshare',
          name: 'myshare',
          component: () => import('@/pages/myshare/Myshare')
        }, {
          path: '/mycollection',
          name: 'mycollection',
          component: () => import('@/pages/mycollection/MyCollection')
        }, {
          path: '/dustbin',
          name: 'dustbin',
          component: () => import('@/pages/dustbin/Dustbin')
        }, {
          path: '/allback',
          name: 'allback',
          component: () => import('@/pages/common/Allback')
        }
      ]
    }
  ]
})
