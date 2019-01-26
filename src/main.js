import 'bulma/css/bulma.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Vue from 'vue';
import VueSlideBar from 'vue-slide-bar';

import Game from '@/Game.vue';
import router from '@/router';
import store from '@/store';
import '@/filters';

Vue.component('VueSlideBar', VueSlideBar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Game),
}).$mount('#game');
