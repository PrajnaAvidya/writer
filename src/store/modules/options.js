import optionsData from '@/data/options';

const state = Object.assign({}, optionsData());

const getters = {
  //
};

const mutations = {
  adjustButtonSize(s, amount) {
    if (s.buttonSize + amount >= 1 && s.buttonSize + amount <= s.maxButtonSize) {
      s.buttonSize += amount;
    }
  },
  resetOptions(s) {
    const d = Object.assign({}, optionsData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    Object.keys(obj).forEach((key) => {
      s[key] = obj[key];
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
