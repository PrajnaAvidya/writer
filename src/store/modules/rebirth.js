import Vue from 'vue';
import Big from 'big.js';
import store from '@/store';
import rebirthData from '@/data/rebirth';

const state = Object.assign({}, rebirthData);

const getters = {
  jobSlots: s => s.bonuses.jobSlots,
  plotBonus: s => Big(1).plus(s.plotPoints.div(50)),
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
    if (s.bonuses.jobSlots < store.state.jobs.maxJobSlots) {
      s.bonuses.jobSlots += 1;
    }
  },
  addBonus(s, { index, amount }) {
    if (typeof s.bonuses[index] === 'object') {
      s.bonuses[index] = s.bonuses[index].plus(amount);
    } else {
      s.bonuses[index] += amount;
    }
  },
  multiplyBonus(s, { index, amount }) {
    if (typeof s.bonuses[index] === 'object') {
      s.bonuses[index] = s.bonuses[index].times(amount);
    } else {
      s.bonuses[index] *= amount;
    }
  },
  enableWorkerCaffeine(s, worker) {
    s.bonuses.workerCaffeine[worker] = true;
  },
  removeBonus(s, id) {
    Vue.delete(s.lockedBonuses, id);
  },
  fromJSON(s, obj) {
    Object.keys(obj).forEach((key) => {
      s[key] = obj[key];
    });
    s.baseMilestonesNeeded = Big(s.baseMilestonesNeeded);
    s.plotPoints = Big(s.plotPoints);
    s.rebirths = Big(s.rebirths);
    s.bonuses.caffeineClickWps = Big(s.bonuses.caffeineClickWps);
    s.bonuses.caffeineWordMultiplier = Big(s.bonuses.caffeineWordMultiplier);
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
