// import './assets/main.css'
import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

declare global {
  interface Window {
    GLOBAL_CONFIG: {
      API_URL: string
    }
  }
}

fetch('/config.json')
  .then(result => result.json())
  .then(config => {
    window.GLOBAL_CONFIG = config
    buildApp()
  })

const buildApp = () => {
  createApp(App).use(router).use(PrimeVue).mount('#app')
}
