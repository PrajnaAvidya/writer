import workersData from '@/data/workers';
import store from '@/store';

const state = workersData;

const getters = {
  workersHired: () => store.state.statistics.stats.workers,
};

const mutations = {
  setBuyAmountIndex(s, index) {
    s.buyAmountIndex = index;
    s.buyAmount = 10 ** index;
  },
  setWorkers(s, data) {
    s.data = Object.assign({}, data);
  },
  setWorkersData(s, { index, value }) {
    s[index] = value;
  },
  resetWorkers(s) {
    const d = workersData();
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
