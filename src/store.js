import Vue from 'vue';
import Vuex from 'vuex';

import unixTimestamp from './utils/unixTimestamp';

Vue.use(Vuex);

function initialState() {
  return {
    buyAmount: 1,
    buyAmountIndex: 0,

    jobActive: true,
    nextJobTime: null,
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
      state.nextJobTime = unixTimestamp() + timer;
    },
    setJobActive(state) {
      state.jobActive = true;
    },
  },

  actions: {

  },
});
