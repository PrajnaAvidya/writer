import Vue from 'vue';
import Vuex from 'vuex';
import game from '@/store/modules/game';
import debug from '@/store/modules/debug';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    game,
    debug,
  },
});
