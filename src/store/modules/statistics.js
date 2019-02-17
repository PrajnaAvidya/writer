import Big from 'big.js';
import statisticsData from '@/data/statistics';

const state = Object.assign({}, statisticsData());

const getters = {
  //
};

const mutations = {
  addToStat(s, { stat, amount }) {
    if (Big(amount).gt(0)) {
      s.stats[stat] = s.stats[stat].plus(amount);
    }
  },
  setStatisticsData(s, { index, value }) {
    s.stats[index] = Big(value);
  },
  resetStatistics(s) {
    const d = Object.assign({}, statisticsData());
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
    Object.keys(s.stats).forEach((stat) => {
      s.stats[stat] = Big(s.stats[stat]);
      s.milestoneTargets[stat] = Big(s.milestoneTargets[stat]);
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
