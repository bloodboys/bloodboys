import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './utils/init'
import './router/permission'
import api from './api'
import 'default-passive-events'
import TreeTable from 'vue-table-with-tree-grid'
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
