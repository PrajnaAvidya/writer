import store from '@/store';
import caffeineData from '@/data/caffeine';
import unixTimestamp from '@/utils/unixTimestamp';

const state = caffeineData;

const getters = {
  //
};

const mutations = {
  speedCaffeineCooldown(s) {
    s.nextCaffeineTime -= store.state.rebirth.bonuses.hurryAmount * 1000;
  },
  activateCaffeine(s, force = false) {
    s.endCaffeineTime = unixTimestamp(s.caffeineTime);
    s.nextCaffeineTime = force ? unixTimestamp(s.caffeineTime) : unixTimestamp(s.caffeineTime + s.caffeineCooldown);
    store.state.game.statistics.caffeines = store.state.game.statistics.caffeines.plus(1);
  },
  adjustCaffeineTimer(s, amount) {
    s.caffeineCooldown += amount;
    s.nextCaffeineTime += amount * 1000;
  },
  multiplyCaffeineData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].times(amount);
    } else {
      s[index] *= amount;
    }
  },
  setCaffeineData(s, { index, value }) {
    s[index] = value;
  },
  resetCaffeine(s) {
    const d = caffeineData;
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
