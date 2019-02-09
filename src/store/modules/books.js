import booksData from '@/data/books';

const state = booksData;

const getters = {
  //
};

const mutations = {
  setBooksData(s, { index, value }) {
    s[index] = value;
  },
  resetBooks(s) {
    const d = booksData;
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
