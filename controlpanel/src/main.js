import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import * as axios from 'axios';

Vue.prototype.$axios = axios;
Vue.prototype.global = {
    apiUri: 'http://localhost:9000'
};

Vue.use(VueMaterial)

Vue.config.errorHandler = (err) => {
	if (process.env.NODE_ENV !== 'production') {
		// Show any error but this one
		if (err.message !== "Cannot read property 'badInput' of undefined") {
			console.error(err);
		}
	}
};

const app = new Vue({
    render: h => h(App)
});

app.$mount('#app')