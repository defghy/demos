import { createApp } from 'vue'

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import store from './store';
import App from './App.vue';

createApp(App)
    .use(ElementPlus, { size: 'mini' })
    .use(store)
    .mount('#app');
