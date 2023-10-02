import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { initializeApp } from "firebase/app"
import store from './js/store.js'
import App from './App.vue'

// Import routes from separate file
import router from './js/routes.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9sV7Bsv2tGpkoYMLAGVfgm9WDg-Ipxf4",
  authDomain: "simulation-edge.firebaseapp.com",
  projectId: "simulation-edge",
  storageBucket: "simulation-edge.appspot.com",
  messagingSenderId: "317889569561",
  appId: "1:317889569561:web:0f01e681c57ed5b7079b88",
  measurementId: "G-KR4VREMD8H"
};

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

// Create Vue app
const app = createApp(App);

// Use router and store
app.use(router);
app.use(store);
app.use(vuetify);

// Mount the app
app.mount('#app');
