import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      currUser: null,
    };
  },
  mutations: {
    setUser(state, user) {
      state.currUser = user;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    getCurrUser(state) {
      return state.currUser;
    },
  },
});

export default store;
