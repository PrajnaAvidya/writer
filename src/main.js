import 'buefy/dist/buefy.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import Vue from 'vue';
import Buefy from 'buefy';
import Game from './Game.vue';
import store from './store';
import './filters';

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Game),
}).$mount('#game');
