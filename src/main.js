import 'bulma/css/bulma.min.css';
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';

import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Game from '@/Game.vue';
import router from '@/router';
import store from '@/store';
import '@/filters';

Vue.use(VueAnalytics, {
  id: 'UA-134062375-1',
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Game),
}).$mount('#game');
