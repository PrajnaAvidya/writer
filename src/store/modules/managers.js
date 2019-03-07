import Big from 'big.js';
import managerData from '@/data/managers';

const state = Object.assign({}, managerData());

const getters = {
  //
};

const mutations = {
  resetManagers(s) {
    const d = Object.assign({}, managerData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = obj[key];
      });
    }

    Object.keys(s.managers).forEach((workerId) => {
      s.managerCosts[workerId] = Big(s.managerCosts[workerId]);
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
