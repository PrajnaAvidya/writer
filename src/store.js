import Vue from 'vue';
import Vuex from 'vuex';
import Big from 'big.js';
import shuffle from 'lodash/shuffle';
import unixTimestamp from '@/utils/unixTimestamp';
import defaultData from '@/data/defaultGameData';
import adjectives from '@/data/adjectives';
import playerIcons from '@/data/playerIcons';

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
    speedJobCooldown(state, { id, seconds }) {
      state.jobsAvailableTimestamps[id] -= seconds * 1000;
    },
    activateCaffeine(state) {
      state.endCaffeineTime = unixTimestamp(state.caffeineTime);
      state.nextCaffeineTime = unixTimestamp(state.caffeineTime + state.caffeineCooldown);
      state.statistics.caffeines = state.statistics.caffeines.plus(1);

      if (state.caffeineWordGeneration.lte(5)) {
        // show +1
        state.caffeineAnimationInterval = Big(1000).div(state.caffeineWordGeneration).toFixed();
        state.caffeineAnimationAmount = 1;
      } else if (state.caffeineWordGeneration.lt(5E6)) {
        // show rounded +X
        const roundedFraction = parseInt(state.caffeineWordGeneration.div(5).toFixed(), 10);
        state.caffeineAnimationInterval = Big(1000).div(state.caffeineWordGeneration.div(roundedFraction)).toFixed();
        state.caffeineAnimationAmount = roundedFraction;
      } else {
        // show +X every 200ms
        const fraction = state.caffeineWordGeneration.div(5);
        state.caffeineAnimationInterval = Big(1000).div(state.caffeineWordGeneration.div(fraction)).toFixed();
        state.caffeineAnimationAmount = fraction;
      }
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
    loadAdjectives(state) {
      state.adjectives = shuffle(adjectives);
    },
    loadPlayerIcons(state) {
      state.playerIcons = playerIcons.reverse();
      state.playerIcon = state.playerIcons.pop();
    },
  },

  actions: {

  },
});
