import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';

Vue.use(Vuex);

function initialState() {
  return {
    words: Big(0),
  };
}

export default new Vuex.Store({
  state: initialState(),
  getters: {
    words: state => state.words.toString(),
  },
  mutations: {
    incrementWords(state, amount) {
      state.words = state.words.plus(amount);
    },
  },
  actions: {

  },
});
