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
  multiplyRebirthData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].times(amount);
    } else {
      s[index] *= amount;
    }
  },
  spendPlotPoints(s, amount) {
    s.spentPlotPoints = s.spentPlotPoints.plus(amount);
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
  passiveMoney(s) {
    if (!s.bonuses.passiveMoney) {
      s.bonuses.passiveMoney = true;
    } else {
      s.bonuses.passiveMoneyAmount = s.bonuses.passiveMoneyAmount.times(2);
    }
  },
  setRebirthMoney(s, amount) {
    s.bonuses.startingMoney = Big(amount);
  },
  multiplyBonus(s, { index, amount }) {
    if (typeof s.bonuses[index] === 'object') {
      s.bonuses[index] = s.bonuses[index].times(amount);
    } else {
      s.bonuses[index] *= amount;
    }
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
    s.spentPlotPoints = Big(s.spentPlotPoints);
    s.rebirths = Big(s.rebirths);
    s.bonuses.caffeineWordMultiplier = Big(s.bonuses.caffeineWordMultiplier);
    s.bonuses.passiveMoneyAmount = Big(s.bonuses.passiveMoneyAmount);
    s.bonuses.startingMoney = Big(s.bonuses.startingMoney);
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
