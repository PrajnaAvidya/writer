import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/stateData';
import store from '@/store';

Vue.use(Vuex);

const state = defaultData();

const getters = {
  words: s => s.currency.words,
  money: s => s.currency.money,
  wordValue: s => s.currency.wordValue,
};

const mutations = {
  speedCaffeineCooldown(s) {
    s.nextCaffeineTime -= store.state.rebirth.bonuses.hurryAmount * 1000;
  },
  activateCaffeine(s, force = false) {
    s.endCaffeineTime = unixTimestamp(s.caffeineTime);
    s.nextCaffeineTime = force ? unixTimestamp(s.caffeineTime) : unixTimestamp(s.caffeineTime + s.caffeineCooldown);
    s.statistics.caffeines = s.statistics.caffeines.plus(1);
  },
  adjustCaffeineTimer(s, amount) {
    s.caffeineCooldown += amount;
    s.nextCaffeineTime += amount * 1000;
  },

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
  multiplyData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].times(amount);
    } else {
      s[index] *= amount;
    }
  },
  incrementUpgradeId(s) {
    s.upgradeId += 1;
  },
  resetGame(s) {
    const d = defaultData();
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
    s.currency = {
      words: Big(0),
      money: Big(1),
      wordValue: Big(0.10),
      milestones: Big(0),
    };
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
