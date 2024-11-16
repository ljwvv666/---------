import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemID: '', // 定义全局变量
  }),
  actions: {
    setSystemID(id) {
      this.systemID = id; // 修改 systemID
    },
    clearSystemID() {
      this.systemID = ''; // 重置 systemID
    },
  },
});
