// with polyfills
// import 'regenerator-runtime/runtime'

import Vue from 'vue'
import VueKonva from 'vue-konva'

Vue.config.productionTip = false
Vue.use(VueKonva, { prefix: 'Konva' })
