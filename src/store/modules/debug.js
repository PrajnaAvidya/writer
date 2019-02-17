import debugData from '@/data/debug';

const state = Object.assign({}, debugData);

const getters = {
  checkDebug: s => debug => s.enabled && s[debug],
};

const mutations = {
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
