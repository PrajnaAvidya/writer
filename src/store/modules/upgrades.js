import Big from 'big.js';
import upgradeData from '@/data/upgrades';

const state = Object.assign({}, upgradeData());

const getters = {
  //
};

const mutations = {
  setUpgrades(s, upgrades) {
    s.upgrades = Object.assign({}, upgrades);
  },
  incrementUpgradeId(s) {
    s.upgradeId += 1;
  },
  setUpgradeData(s, { index, value }) {
    s[index] = value;
  },
  resetUpgrades(s) {
    const d = Object.assign({}, upgradeData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    Object.keys(obj).forEach((key) => {
      s[key] = obj[key];
    });
    Object.keys(s.upgrades).forEach((upgradeId) => {
      s.upgrades[upgradeId].cost = Big(s.upgrades[upgradeId].cost);
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
