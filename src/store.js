import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    buyAmount: 1,
    buyAmountIndex: 0,
  },
  getters: {

  },
  mutations: {
    setBuyAmountIndex(state, index) {
      state.buyAmountIndex = index;
      state.buyAmount = 10 ** index;
    },
  },
  actions: {

  },
});
