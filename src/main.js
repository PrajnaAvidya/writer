import 'buefy/dist/buefy.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import Vue from 'vue';
import Buefy from 'buefy';
import VueSlideBar from 'vue-slide-bar';
import { BulmaAccordion, BulmaAccordionItem } from 'vue-bulma-accordion';

import Game from './Game.vue';
import store from './store';
import './filters';

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

Vue.component('VueSlideBar', VueSlideBar);
Vue.component('BulmaAccordion', BulmaAccordion);
Vue.component('BulmaAccordionItem', BulmaAccordionItem);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Game),
}).$mount('#game');
