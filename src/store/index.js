import Vue from 'vue';
import Vuex from 'vuex';

import debug from '@/store/modules/debug';
import game from '@/store/modules/game';
import jobs from '@/store/modules/jobs';
import workers from '@/store/modules/workers';
import unfolding from '@/store/modules/unfolding';
import rebirth from '@/store/modules/rebirth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    debug,
    unfolding,
    game,
    jobs,
    workers,
    rebirth,
  },
});
