import iconData from '@/data/icons';

const state = iconData;

const getters = {
  //
};

const mutations = {
  setIconData(s, { index, value }) {
    s[index] = value;
  },
  resetIcons(s) {
    const d = iconData;
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
