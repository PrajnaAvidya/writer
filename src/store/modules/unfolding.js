import unfoldingData from '@/data/unfolding';
import store from '@/store';

const state = unfoldingData;

const getters = {
  checkUnfolding: s => unfolding => s[unfolding] || (store.state.debug.enabled && store.state.debug.disableUnfolding),
};

const mutations = {
  revealUnfolding(s, data) {
    s[data] = true;
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
