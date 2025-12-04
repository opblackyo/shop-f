/**
 * 應用程式入口
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 建立 Vue 應用
const app = createApp(App)

// 使用 Pinia 狀態管理
app.use(createPinia())

// 使用 Vue Router
app.use(router)

// 掛載應用
app.mount('#app')

