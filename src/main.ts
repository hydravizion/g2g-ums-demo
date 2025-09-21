import { createApp } from 'vue'
import './style.css'
import './material.js'
import App from './App.vue'
import router from './router/router'

const app = createApp(App)
app.use(router)
app.mount('#app')
