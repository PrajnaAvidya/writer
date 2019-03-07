import Vue from 'vue';
import Big from 'big.js';
import store from '@/store';
import rebirthData from '@/data/rebirth';

const state = Object.assign({}, rebirthData);

const getters = {
  checkBonus: s => bonus => s.bonuses[bonus] && s.bonuses[bonus] === true,
  plotBonus: s => Big(1).plus(s.plotPoints / 50),
};

const mutations = {
  setRebirthData(s, { index, value }) {
    s[index] = value;
  },
  addRebirthData(s, { index, amount }) {
    s[index] += parseFloat(amount);
  },
  multiplyRebirthData(s, { index, amount }) {
    s[index] *= parseFloat(amount);
  },
  spendPlotPoints(s, amount) {
    s.spentPlotPoints += parseFloat(amount);
    s.plotPoints -= parseFloat(amount);
  },
  addJobSlot(s) {
    if (s.bonuses.jobSlots < store.state.jobs.maxJobSlots) {
      s.bonuses.jobSlots += 1;
    }
  },
  addBonus(s, { index, amount }) {
    s.bonuses[index] += parseFloat(amount);
  },
  enableBonus(s, index) {
    if (typeof s.bonuses[index] === 'boolean') {
      s.bonuses[index] = true;
    }
  },
  passiveMoney(s) {
    if (!s.bonuses.passiveMoney) {
      s.bonuses.passiveMoney = true;
    } else {
      s.bonuses.passiveMoneyAmount *= 2;
    }
  },
  setRebirthMoney(s, amount) {
    s.bonuses.startingMoney = amount;
  },
  multiplyBonus(s, { index, amount }) {
    s.bonuses[index] *= parseFloat(amount);
  },
  removeBonus(s, id) {
    Vue.delete(s.lockedBonuses, id);
  },
  upgradeManagerTimer(s) {
    if (s.bonuses.managerHiringTimer === 10) {
      s.bonuses.managerHiringTimer = 5;
    } else if (s.bonuses.managerHiringTimer === 5) {
      s.bonuses.managerHiringTimer = 2;
    } else if (s.bonuses.managerHiringTimer === 2) {
      s.bonuses.managerHiringTimer = 1;
    }
  },
  upgradeManagerWorkers(s) {
    if (s.bonuses.managerHiringAmount === 1) {
      s.bonuses.managerHiringAmount = 2;
    } else if (s.bonuses.managerHiringAmount === 2) {
      s.bonuses.managerHiringAmount = 5;
    } else if (s.bonuses.managerHiringAmount === 5) {
      s.bonuses.managerHiringAmount = 10;
    }
  },
  fromJSON(s, obj) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = obj[key];
      });
    }
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
