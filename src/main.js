import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { vfmPlugin } from 'vue-final-modal'

Vue.use(vfmPlugin)
Vue.use(VueToast, {
  position: 'top',
  duration: 3000
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
