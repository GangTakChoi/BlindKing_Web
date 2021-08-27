import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import commonMixin from '@/mixin/commonMixin'

Vue.prototype.$G = Vue.observable({
  isLogin: false
});
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.mixin(commonMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
