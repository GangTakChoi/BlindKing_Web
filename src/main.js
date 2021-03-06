import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import VueCookies from 'vue-cookies'
import commonMixin from '@/mixin/commonMixin'

// 전역 변수 등록
Vue.prototype.$global = Vue.observable({
  isLogin: false,
  isMobile: Boolean,
  isAdmin: false,
  isActiveMatching: false,
  isLoadingUserInfo: true,
})

// http request config
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_HOST,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.$cookies.config('0')

Vue.mixin(commonMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
