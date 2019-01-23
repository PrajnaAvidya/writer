import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from './utils/unixTimestamp';

Vue.use(Vuex);

function initialState() {
  return {
    buyAmount: 1,
    buyAmountIndex: 0,

    jobActive: true,
    nextJobTime: null,

    stats: {
      ideas: Big(0),
      words: Big(0),
      money: Big(0),
      moneySpent: Big(0),
      jobs: Big(0),
      upgrades: Big(0),
    },
  };
}

export default new Vuex.Store({
  state: initialState(),

  getters: {

  },

  mutations: {
    setBuyAmountIndex(state, index) {
      state.buyAmountIndex = index;
      state.buyAmount = 10 ** index;
    },
    resetJobTimer(state, timer) {
      state.jobActive = false;
      state.stats.jobs = state.stats.jobs.plus(1);
      state.nextJobTime = unixTimestamp() + timer;
    },
    setJobActive(state) {
      state.jobActive = true;
    },
    addToStat(state, { stat, amount }) {
      if (Big(amount).gt(0)) {
        state.stats[stat] = state.stats[stat].plus(amount);
      }
    },
  },

  actions: {

  },
});
