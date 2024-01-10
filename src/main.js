import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { initializeApp } from "firebase/app"
import 'firebase/database';
import store from './js/store.js'
import App from './App.vue'

// Import routes from separate file
import router from './js/routes.js'

// Your web app's Firebase configuration
import firebaseConfig from './js/firebaseConfig.js'

// Initialize Firebase app
initializeApp(firebaseConfig);


// Vuetify
import "@mdi/font/css/materialdesignicons.css"
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,  
})

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fas, far)


library.add(fab);


// Create Vue app
const app = createApp(App);

// Use router and store
app.use(router);
app.use(store);
app.use(vuetify);
app.component('font-awesome-icon', FontAwesomeIcon);


// Mount the app
app.mount('#app');
