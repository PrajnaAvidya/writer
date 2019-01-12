import 'buefy/dist/buefy.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import Vue from 'vue';
import Buefy from 'buefy';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
