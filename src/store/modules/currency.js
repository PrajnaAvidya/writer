import Big from 'big.js';
import currencyData from '@/data/currencies';

const state = Object.assign({}, currencyData);

const getters = {
  //
};

const mutations = {
  addCurrencyData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].plus(amount);
    } else {
      s[index] += amount;
    }
  },
  multiplyCurrencyData(s, { index, amount }) {
    if (typeof s[index] === 'object') {
      s[index] = s[index].times(amount);
    } else {
      s[index] *= amount;
    }
  },
  setCurrencyData(s, { index, value }) {
    s[index] = Big(value);
  },
  resetCurrency(s) {
    const d = Object.assign({}, currencyData);
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = Big(obj[key]);
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
