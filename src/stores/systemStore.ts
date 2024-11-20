import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemID: '', // 定义全局变量
    gscID:'',
    standardName:'',
    stageName: '',
    adjustedFP1: 0,
    adjustedFP2: 0,
    
  }),
  actions: {
    setSystemID(id) {
      this.systemID = id; // 修改 systemID
    },
    clearSystemID() {
      this.systemID = ''; // 重置 systemID
    },
    setGSCID(id) {
      this.gscID = id; // 修改 systemID
    },
    clearGSCID() {
      this.gscID = ''; // 重置 systemID
    },
    setStandardName(name) {
      this.systemID = name; 
    },
    clearStandardName() {
      this.systemID = ''; 
    },
    setStageName(name) {
      this.systemID = name; 
    },
    clearStageName() {
      this.systemID = ''; 
    },
    setAdjustedFP2(dfp) {
      this.adjustedFP2 = dfp; 
    },
    clearAdjustedFP2() {
      this.adjustedFP2 = 0; 
    },
    setAdjustedFP1(dfp) {
      this.adjustedFP2 = dfp; 
    },
    clearAdjustedFP1() {
      this.adjustedFP2 = 0; 
    },
  },
  persist: {
    enabled: true, // 启用持久化
    strategies: [
      {
        key: 'systemStore', // 本地存储的键名
        storage: sessionStorage,
      },
    ],
  },
});
