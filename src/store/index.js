import Vue from 'vue';
import Vuex from 'vuex';

import debug from '@/store/modules/debug';
import unfolding from '@/store/modules/unfolding';
import tutorials from '@/store/modules/tutorials';
import currency from '@/store/modules/currency';
import statistics from '@/store/modules/statistics';
import icons from '@/store/modules/icons';
import caffeine from '@/store/modules/caffeine';
import books from '@/store/modules/books';
import jobs from '@/store/modules/jobs';
import workers from '@/store/modules/workers';
import upgrades from '@/store/modules/upgrades';
import rebirth from '@/store/modules/rebirth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    debug,
    unfolding,
    tutorials,
    currency,
    statistics,
    icons,
    caffeine,
    books,
    jobs,
    workers,
    upgrades,
    rebirth,
  },
});
