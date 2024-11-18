import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemID: '', // 定义全局变量
    standardName:'',
    stageName: '',
    adjustedFP2: ''
  }),
  actions: {
    setSystemID(id) {
      this.systemID = id; // 修改 systemID
    },
    clearSystemID() {
      this.systemID = ''; // 重置 systemID
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
      this.adjustedFP2 = ''; 
    },
  },
});
