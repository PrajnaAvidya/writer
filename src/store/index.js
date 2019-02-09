import Vue from 'vue';
import Vuex from 'vuex';

import debug from '@/store/modules/debug';
import game from '@/store/modules/game';
import unfolding from '@/store/modules/unfolding';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    debug,
    game,
    unfolding,
  },
});
