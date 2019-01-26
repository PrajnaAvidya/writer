import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';

Vue.use(Vuex);

function initialState() {
  return {
    buyAmount: 1,
    buyAmountIndex: 0,

    nextJobTime: null,

    nextCaffeineTime: -1,
    endCaffeineTime: -1,

    stats: {
      words: Big(0),
      clickWords: Big(0),
      money: Big(0),
      moneySpent: Big(0),
      caffeines: Big(0),
      jobs: Big(0),
      upgrades: Big(0),
      totalUpgrades: Big(0),
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
      state.stats.jobs = state.stats.jobs.plus(1);
      state.nextJobTime = unixTimestamp() + timer;
    },
    adjustJobTimer(state, amount) {
      state.nextJobTime += amount;
    },
    activateCaffeine(state, { timer, cooldown }) {
      state.endCaffeineTime = unixTimestamp() + timer;
      state.nextCaffeineTime = state.endCaffeineTime + cooldown;
      state.stats.caffeines = state.stats.caffeines.plus(1);
    },
    adjustCaffeineTimer(state, amount) {
      state.nextCaffeineTime += amount;
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
