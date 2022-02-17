import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/foods/Cate.vue'
import Params from '../components/foods/Params.vue'
import List from '../components/foods/List.vue'
import Add from '../components/foods/Add.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login

},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/userlist',
    component: Users
  },
  {
    path: '/permissionlist',
    component: Rights
  },
  {
    path: '/rolelist',
    component: Roles
  },
  {
    path: '/foodclass',
    component: Cate
  },
  {
    path: '/classparam',
    component: Params
  },
  {
    path: '/foodlist',
    component: List
  },
  {
    path: '/foodlist/add',
    component: Add
  },
  {
    path: '/orderlist',
    component: Order
  }
  ]

}
]

const router = new VueRouter({
  routes
})

export default router
