import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';  // Correct import
import 'vuetify/styles'; // Vuetify styles
import '@mdi/font/css/materialdesignicons.css'; // Icons

const app = createApp(App);
const vuetify = createVuetify(); // Create Vuetify instance

app.use(vuetify);
app.mount('#app');


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/teleprompter-notes/sw.js')
      .then(() => console.log('Service Worker Registered'));
  }
  