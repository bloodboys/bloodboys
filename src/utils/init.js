import store from '../store'
if (localStorage.getItem('csn')) {
  store.commit('login/setUser', JSON.parse(localStorage.getItem('csn')))
}
