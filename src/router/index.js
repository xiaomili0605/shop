import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login/Login.vue'
import Home from '../views/Home/Home.vue'
import Welcome from '../views/Home/Welcome/Welcome.vue'
import User from '../views/Home/User/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: User,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// to 要去往路由信息
// from 要离开路由信息
// next 控制权函数
router.beforeEach((to, form, next) => {
  // 去往登录页放行
  if (to.path == '/login') return next()
  // 去往其他页面 判断 token 是否存在，存在放行，不存在跳转到登录页
  if(!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
