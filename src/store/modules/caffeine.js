import Big from 'big.js';
import store from '@/store';
import caffeineData from '@/data/caffeine';
import unixTimestamp from '@/utils/unixTimestamp';

const state = Object.assign({}, caffeineData);

const getters = {
  //
};

const mutations = {
  speedCaffeineCooldown(s) {
    s.nextCaffeineTime -= store.state.rebirth.bonuses.hurryAmount * 1000;
    if (s.nextCaffeineTime < unixTimestamp()) {
      s.nextCaffeineTime = unixTimestamp();
    }
  },
  activateCaffeine(s, force = false) {
    s.endCaffeineTime = unixTimestamp(s.caffeineTime);
    s.nextCaffeineTime = force ? unixTimestamp(s.caffeineTime) : unixTimestamp(s.caffeineTime + s.caffeineCooldown);
    store.state.statistics.stats.caffeines = store.state.statistics.stats.caffeines.plus(1);
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
    const d = Object.assign({}, caffeineData);
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
    s.endCaffeineTime = 0;
    s.nextCaffeineTime = 0;
  },
  fromJSON(s, obj) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = obj[key];
      });
    }

    s.caffeineMinimumWordGeneration = Big(s.caffeineMinimumWordGeneration);
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
