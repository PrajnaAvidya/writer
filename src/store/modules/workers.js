import Big from 'big.js';
import workersData from '@/data/workers';
import store from '@/store';

const state = Object.assign({}, workersData());

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
    const d = Object.assign({}, workersData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = obj[key];
      });
    }
    s.workerWps = Big(s.workerWps);
    Object.keys(s.workers).forEach((worker) => {
      s.workers[worker].productivityMultiplier = Big(s.workers[worker].productivityMultiplier);
      s.workers[worker].costs[0] = Big(s.workers[worker].costs[0]);
      s.workers[worker].costs[1] = Big(s.workers[worker].costs[1]);
      s.workers[worker].costs[2] = Big(s.workers[worker].costs[2]);
      s.individualWorkerWps[worker] = Big(s.individualWorkerWps[worker]);
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
