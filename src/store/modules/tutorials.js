import tutorialData from '@/data/tutorials';

const state = Object.assign({}, tutorialData());

const getters = {
  //
};

const mutations = {
  resetTutorials(s) {
    const d = Object.assign({}, tutorialData());
    Object.keys(d).forEach((key) => {
      s[key] = d[key];
    });
  },
  saveTutorial(s, tutorial) {
    s.currentTutorial = tutorial;
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
