import { defineStore } from 'pinia'
export const useHomeStore = defineStore('home', {
  state: () => ({
    //【localDev】分支
    localDevBranch: '',
  }),
  getters: {
    isLocalDevMode: state => !!state.localDevBranch,
  },
  actions: {
    updateLocalDevBranch(branch: string) {
      this.localDevBranch = branch
    },
  },
})
