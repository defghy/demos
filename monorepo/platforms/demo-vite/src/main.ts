import { createApp, capitalize } from 'vue'
import './style.css'
import App from './App.vue'

window.capitalize = capitalize

createApp(App).mount('#app')
