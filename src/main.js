import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

Vue.prototype.$G = Vue.observable({
  isLogin: false
});
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
