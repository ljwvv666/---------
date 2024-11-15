import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: '',
      userName: '',
      userNickname: '',
      department: '',
      phoneNumber: '',
      companyId: '',
      createTime: '',
      role: '',
      status: '',
      password: '',
    },
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
    },
  },
});
