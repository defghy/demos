import Vue from 'vue'

import './index.less'
import router from './router'
import App from './App.vue'
import { createPinia } from '@/stores/store'

Vue.config.productionTip = false
new Vue({
  router,
  pinia: createPinia(),
  render: h => h(App),
  errorCaptured(err) {
    console.error(err)
  },
}).$mount('#app')
