import Vue from 'vue';
import Vuex from 'vuex';
import defaultData from '@/data/stateData';

Vue.use(Vuex);

const state = defaultData();

const getters = {
  //
};

const mutations = {
  setGameData(s, { index, value }) {
    s[index] = value;
  },
  resetGame(s) {
    const d = defaultData();
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
};

const actions = {
  //
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
