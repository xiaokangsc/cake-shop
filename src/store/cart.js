import { defineStore } from 'pinia';
import { getCartCount } from '../api/index';

export const useCartStore = defineStore('cart', {
  state: () => ({ count: 0 }),
  actions: {
    async fetchCount() {
      try {
        const res = await getCartCount();
        this.count = res.count;
      } catch (e) { /* ignore */ }
    },
    setCount(n) { this.count = n; }
  }
});
