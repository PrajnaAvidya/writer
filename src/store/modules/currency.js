import currencyData from '@/data/currencies';

const state = currencyData;

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
    s[index] = value;
  },
  resetCurrency(s) {
    const d = currencyData;
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
