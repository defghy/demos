import Vue from 'vue';
import { createStore } from 'vuex';

export interface State {
  interval: number;
  autoRefresh: boolean;
  [key: string]: any;
}

export default createStore<State>({
  state() {
    return {
      interval: 60,
      autoRefresh: true,
    };
  },
  getters: {
    getInterval(state) {
      return state.interval;
    },
    getAutoRefresh(state) {
      return state.autoRefresh;
    },
  },
  mutations: {
    setRefreshInterval(state, payload: number) {
      state.interval = payload;
    },
    setAutoRefresh(state, payload: boolean) {
      state.autoRefresh = payload;
    },
  },
  actions: {},
  modules: {},
});
