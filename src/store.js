import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/defaultGameData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: defaultData,

  getters: {
    words: state => state.currency.words,
    money: state => state.currency.money,
    wordValue: state => state.currency.wordValue,
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
    multiplyJobTimer(state, amount) {
      state.jobCooldown *= amount;
      console.log(state.jobCooldown);
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
    setUpgrades(state, upgrades) {
      state.upgrades = Object.assign({}, upgrades);
    },
    setWorkers(state, workers) {
      state.workers = Object.assign({}, workers);
    },
    updateData(state, { index, value }) {
      state[index] = value;
    },
  },

  actions: {

  },
});
