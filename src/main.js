import { createApp } from 'vue'
import './assets/styles.css'

import App from './Home.vue'
import Router from './router.js'

createApp(App).use(Router).mount('#app')