import Big from 'big.js';
import recruitingData from '@/data/recruiting';

const state = Object.assign({}, recruitingData());

const getters = {
  //
};

const mutations = {
  resetRecruiting(s) {
    const d = Object.assign({}, recruitingData());
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

    Object.keys(s.recruiters).forEach((workerId) => {
      s.recruiterCosts[workerId] = Big(s.recruiterCosts[workerId]);
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
