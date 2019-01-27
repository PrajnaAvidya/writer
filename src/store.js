import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/defaultGameData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: defaultData,

  getters: {
    //
  },

  mutations: {
    setBuyAmountIndex(state, index) {
      state.data.buyAmountIndex = index;
      state.data.buyAmount = 10 ** index;
    },
    resetJobTimer(state, timer) {
      state.statistics.jobs = state.statistics.jobs.plus(1);
      state.data.nextJobTime = unixTimestamp() + timer;
    },
    adjustJobTimer(state, amount) {
      state.data.nextJobTime += amount;
    },
    activateCaffeine(state, { timer, cooldown }) {
      state.data.endCaffeineTime = unixTimestamp() + timer;
      state.data.nextCaffeineTime = state.data.endCaffeineTime + cooldown;
      state.statistics.caffeines = state.statistics.caffeines.plus(1);
    },
    adjustCaffeineTimer(state, amount) {
      state.data.nextCaffeineTime += amount;
    },
    addToStat(state, { stat, amount }) {
      if (Big(amount).gt(0)) {
        state.statistics[stat] = state.statistics[stat].plus(amount);
      }
    },
  },

  actions: {

  },
});
