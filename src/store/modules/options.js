import optionsData from '@/data/options';

const state = Object.assign({}, optionsData());

const getters = {
  checkOption: s => option => s[option] === true,
};

const mutations = {
  adjustButtonSize(s, amount) {
    if (s.buttonSize + amount >= 0 && s.buttonSize + amount <= s.maxButtonSize) {
      s.buttonSize += amount;
    }
  },
  setOptionData(s, { index, value }) {
    s[index] = value;
  },
  resetOptions(s) {
    const d = Object.assign({}, optionsData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  fromJSON(s, obj) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        s[key] = obj[key];
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
