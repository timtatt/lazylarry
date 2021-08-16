import { createApp } from 'vue'
import App from './App.vue'
import * as axios from 'axios';

const app = createApp(App).mount('#app')
app.config.globalProperties.apiUri = 'http://localhost:9000';