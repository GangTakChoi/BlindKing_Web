import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import commonMixin from '@/mixin/commonMixin'

Vue.prototype.$G = Vue.observable({
  isLogin: false
});

// http request config
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

Vue.config.productionTip = false
Vue.mixin(commonMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
