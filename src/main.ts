import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './styles/main.scss'
import pinia from './stores'
import 'virtual:svg-icons-register'
import '@/enums/index'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
