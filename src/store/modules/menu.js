const state = {
  selectedMenu: "decision", // kpi, decision, proposal, matters, work, direct
  reloadRouter: "",
};

const mutations = {
  RELOAD_ROUTER: (state, menu) => {
    state.reloadRouter = menu;
  },

  CHANGE_MENU: (state, menu) => {
    state.selectedMenu = menu;
  },
};

const actions = {
  changeMenu({ commit }, menu) {
    return new Promise((resolve) => {
      commit("CHANGE_MENU", menu);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
