import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null
  }),
  actions: {
    setLogin(token, user) {
      this.token = token;
      this.userInfo = user;
      uni.setStorageSync('token', token);
      uni.setStorageSync('userInfo', user);
    },
    loadFromStorage() {
      this.token = uni.getStorageSync('token') || '';
      this.userInfo = uni.getStorageSync('userInfo') || null;
    },
    logout() {
      this.token = '';
      this.userInfo = null;
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
    }
  }
});
