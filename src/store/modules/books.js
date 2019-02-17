import booksData from '@/data/books';

const state = Object.assign({}, booksData);

const getters = {
  //
};

const mutations = {
  setBooksData(s, { index, value }) {
    s[index] = value;
  },
  resetBooks(s) {
    const d = Object.assign({}, booksData);
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
