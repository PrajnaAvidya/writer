import 'buefy/dist/buefy.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import Vue from 'vue';
import Buefy from 'buefy';
import VueSlideBar from 'vue-slide-bar';

import Game from './Game.vue';
import router from './router';
import store from './store';
import './filters';

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

Vue.component('VueSlideBar', VueSlideBar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Game),
}).$mount('#game');
