import unfoldingData from '@/data/unfolding';
import store from '@/store';

const state = unfoldingData;

const getters = {
  checkUnfolding: s => unfolding => s[unfolding] || store.state.debug.disableUnfolding,
};

const mutations = {
  revealUnfolding(s, reveal) {
    s[reveal] = true;
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
