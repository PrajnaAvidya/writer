import debugData from '@/data/debug';

const state = debugData;

const getters = {
  checkDebug: s => debug => s.enabled && s[debug],
};

const mutations = {
  //
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
