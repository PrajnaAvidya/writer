import Vue from 'vue';
import rebirthData from '@/data/rebirth';

const state = rebirthData;

const getters = {
  jobSlots: s => s.bonuses.jobSlots,
};

const mutations = {
  setRebirthData(s, { index, value }) {
    s[index] = value;
  },
  addRebirthData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].plus(amount);
    } else {
      s[index] += amount;
    }
  },
  spendPlotPoints(s, amount) {
    s.plotPoints = s.plotPoints.minus(amount);
  },
  addJobSlot(s) {
    if (s.bonuses.jobSlots < s.maxJobSlots) {
      s.bonuses.jobSlots += 1;
    }
  },
  increaseHurryAmount(s) {
    s.bonuses.hurryAmount *= 2;
  },
  enableWorkerCaffeine(s, worker) {
    s.bonuses.workerCaffeine[worker] = true;
  },
  removeBonus(s, id) {
    Vue.delete(s.lockedBonuses, id);
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
