import Vue from 'vue';
import Vuex from 'vuex';

import debug from '@/store/modules/debug';
import unfolding from '@/store/modules/unfolding';
import game from '@/store/modules/game';
import currency from '@/store/modules/currency';
import caffeine from '@/store/modules/caffeine';
import books from '@/store/modules/books';
import jobs from '@/store/modules/jobs';
import workers from '@/store/modules/workers';
import rebirth from '@/store/modules/rebirth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    debug,
    unfolding,
    game,
    currency,
    caffeine,
    books,
    jobs,
    workers,
    rebirth,
  },
});
