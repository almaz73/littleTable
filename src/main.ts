import './assets/main.css'
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import ru from 'element-plus/dist/locale/ru.min.mjs'

// @ts-ignore
import App from './App.vue'


const app = createApp(App)
app.use(createPinia())
// app.use(ElementPlus, {locale: ru})
app.use(ElementPlus)
app.mount('#app')
// createApp(App).mount('#app')
