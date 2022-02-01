import router from './index'
// import store from '../store'

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，代表放行
  // next() 放行 next(/login) 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = localStorage.getItem('csn')
  // const tokenStr = store.state.login.user.token
  if (!tokenStr) return next('/login')
  next()
})
