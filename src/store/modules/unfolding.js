import unfoldingData from '@/data/unfolding';
import store from '@/store';

const state = Object.assign({}, unfoldingData);

const getters = {
  checkUnfolding: s => unfolding => s[unfolding] || (store.state.debug.enabled && store.state.debug.disableUnfolding),
};

const mutations = {
  revealUnfolding(s, data) {
    s[data] = true;
  },
  fromJSON(s, obj) {
    if (obj && typeof obj === 'object') {
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
