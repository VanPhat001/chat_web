import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

import './assets/main.css'
import '@fortawesome/fontawesome-free/js/all.js'

import storeConfig from './store'
import router from './router'


const store = createStore(storeConfig)

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
