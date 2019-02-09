import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import defaultData from '@/data/stateData';

Vue.use(Vuex);

const state = defaultData();

const getters = {
  //
};

const mutations = {
  addToStat(s, { stat, amount }) {
    if (Big(amount).gt(0)) {
      s.statistics[stat] = s.statistics[stat].plus(amount);
    }
  },
  setUpgrades(s, upgrades) {
    s.upgrades = Object.assign({}, upgrades);
  },
  setGameData(s, { index, value }) {
    s[index] = value;
  },
  incrementUpgradeId(s) {
    s.upgradeId += 1;
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
