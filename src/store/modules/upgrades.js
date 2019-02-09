import upgradeData from '@/data/upgrades';

const state = upgradeData;

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
    const d = upgradeData;
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
