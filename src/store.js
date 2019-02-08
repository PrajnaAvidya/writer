import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/stateData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: defaultData(),

  getters: {
    words: state => state.currency.words,
    money: state => state.currency.money,
    wordValue: state => state.currency.wordValue,
    jobsComplete: state => state.statistics.jobs,
    workersHired: state => state.statistics.workers,
    checkDebug: state => debug => state.debug.enabled && state.debug[debug],
  },

  mutations: {
    setBuyAmountIndex(state, index) {
      state.buyAmountIndex = index;
      state.buyAmount = 10 ** index;
    },
    resetJobTimer(state, jobId) {
      state.jobsCompletedTimestamps[jobId] = unixTimestamp();
      state.jobsAvailableTimestamps[jobId] = unixTimestamp(state.jobCooldown);
    },
    speedJobCooldown(state, { id, seconds }) {
      state.jobsAvailableTimestamps[id] -= seconds * 1000;
    },
    speedCaffeineCooldown(state, seconds) {
      state.nextCaffeineTime -= seconds * 1000;
    },
    activateCaffeine(state) {
      state.endCaffeineTime = unixTimestamp(state.caffeineTime);
      state.nextCaffeineTime = unixTimestamp(state.caffeineTime + state.caffeineCooldown);
      state.statistics.caffeines = state.statistics.caffeines.plus(1);
    },
    adjustCaffeineTimer(state, amount) {
      state.caffeineCooldown += amount;
      state.nextCaffeineTime += amount * 1000;
    },
    adjustJobTimer(state, amount) {
      state.jobCooldown += amount;
      Object.keys(state.jobAvailable).forEach((jobId) => {
        state.jobAvailable[jobId] += amount * 1000;
      });
    },
    addToStat(state, { stat, amount }) {
      if (Big(amount).gt(0)) {
        state.statistics[stat] = state.statistics[stat].plus(amount);
      }
    },
    setWorkers(state, workers) {
      state.workers = Object.assign({}, workers);
    },
    setUpgrades(state, upgrades) {
      state.upgrades = Object.assign({}, upgrades);
    },
    revealUnfolding(state, reveal) {
      state.unfolding[reveal] = true;
    },
    updateData(state, { index, value }) {
      state[index] = value;
    },
    multiplyData(state, { index, amount }) {
      if (typeof state[index] === 'object') {
        state[index] = state[index].times(amount);
      } else {
        state[index] *= amount;
      }
    },
    incrementUpgradeId(state) {
      state.upgradeId += 1;
    },
    setRebirth(state, rebirthData) {
      state.rebirth = Object.assign({}, rebirthData);
    },
    reset(state) {
      const s = defaultData();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
      state.currency = {
        words: Big(0),
        money: Big(1),
        wordValue: Big(0.10),
        milestones: Big(0),
      };
    },
  },

  actions: {

  },
});
