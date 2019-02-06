import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/gameData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: defaultData,

  getters: {
    words: state => state.currency.words,
    money: state => state.currency.money,
    wordValue: state => state.currency.wordValue,
    jobsComplete: state => state.statistics.jobs,
    workersHired: state => state.statistics.workers,
  },

  mutations: {
    setBuyAmountIndex(state, index) {
      state.buyAmountIndex = index;
      state.buyAmount = 10 ** index;
    },
    resetJobTimer(state, jobId) {
      state.statistics.jobs = state.statistics.jobs.plus(1);
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
      state.nextCaffeineTime += amount;
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
    updateData(state, { index, value }) {
      state[index] = value;
    },
  },

  actions: {

  },
});
