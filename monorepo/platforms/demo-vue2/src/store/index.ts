import Vue from 'vue'
import Vuex, { ActionTree } from 'vuex'

import { createNamespacedHelpers, useState, useActions, } from 'vuex-composition-helpers';

Vue.use(Vuex);

const state = {
  userName: '',
};

const defineAction = <T extends ActionTree<typeof state, typeof state>>(actions: T) =>  actions;
const actions = defineAction({
  updateUser({ state }, userName) {
    state.userName = userName;
  },
});

const Store = new Vuex.Store({
  state,
  getters: {

  },
  mutations: {
  },
  actions,
  modules: {
  }
});

export const useRootState = (args: (keyof typeof state)[]) => useState<typeof state>(args);
export const useRootActions= (args: (keyof typeof actions)[]) => useActions<typeof actions>(args);

export default Store;
