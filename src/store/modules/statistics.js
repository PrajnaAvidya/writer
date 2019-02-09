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
    s[index] = value;
  },
  resetStatistics(s) {
    const d = Object.assign({}, statisticsData());
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
