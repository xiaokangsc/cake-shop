<template>
  <view class="cart-page">
    <view v-if="items.length === 0" class="empty-cart">🛒 <text>购物车是空的，去挑些蛋糕吧~</text></view>

    <view v-else class="cart-list">
      <view class="cart-item" v-for="item in items" :key="item.id">
        <text class="check-icon" @click="toggleCheck(item)">{{ item.checked ? '✅' : '⬜' }}</text>
        <image :src="getImg(item)" mode="aspectFill" class="item-img" @click="goDetail(item)" />
        <view class="item-info">
          <text class="item-name text-ellipsis">{{ item.name }}</text>
          <text class="item-spec" v-if="item.spec_info">{{ item.spec_info }}</text>
          <view class="item-footer flex-between">
            <text class="price">{{ item.price }}</text>
            <view class="quantity-ctrl">
              <text class="q-btn" @click="changeQty(item, -1)">−</text>
              <text class="q-num">{{ item.quantity }}</text>
              <text class="q-btn" @click="changeQty(item, 1)">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="items.length > 0">
      <text class="check-icon" @click="toggleAll">{{ allChecked ? '✅' : '⬜' }}</text>
      <text class="check-label">全选</text>
      <view class="total-info">
        <text>合计: </text><text class="price" style="font-size:36rpx">{{ totalAmount }}</text>
      </view>
      <view class="btn-checkout" @click="goCheckout">去结算 ({{ checkedCount }})</view>
    </view>
  </view>
</template>

<script>
import { getCartList, updateCart, checkAllCart, deleteCart } from '../../api/index';
import { useCartStore } from '../../store/cart';

export default {
  data() { return { items: [], baseUrl: 'http://localhost:3000' }; },
  computed: {
    checkedItems() { return this.items.filter(i => i.checked); },
    totalAmount() { return this.checkedItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2); },
    allChecked() { return this.items.length > 0 && this.items.every(i => i.checked); },
    checkedCount() { return this.checkedItems.length; }
  },
  onShow() { this.loadCart(); },
  methods: {
    async loadCart() { this.items = await getCartList(); },
    async changeQty(item, n) {
      const qty = item.quantity + n;
      if (qty <= 0) {
        await deleteCart(item.id);
      } else {
        await updateCart({ id: item.id, quantity: qty });
      }
      this.loadCart();
      useCartStore().fetchCount();
    },
    async toggleCheck(item) {
      await updateCart({ id: item.id, checked: item.checked ? 0 : 1 });
      this.loadCart();
    },
    async toggleAll() {
      await checkAllCart(!this.allChecked);
      this.loadCart();
    },
    getImg(item) {
      const imgs = item.images; return (imgs[0] || '/static/images/cake1.jpg').startsWith('http') ? imgs[0] : this.baseUrl + imgs[0];
    },
    goDetail(item) { uni.navigateTo({ url: `/pages/product/product?id=${item.product_id}` }); },
    goCheckout() {
      if (this.checkedCount === 0) { uni.showToast({ title: '请选择商品', icon: 'none' }); return; }
      uni.navigateTo({ url: '/pages/order/checkout' });
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page { padding-bottom: 140rpx; min-height: 100vh; }
.empty-cart { display: flex; flex-direction: column; align-items: center; padding: 200rpx 0; font-size: 80rpx; }
.empty-cart text { font-size: 28rpx; color: #999; margin-top: 24rpx; }

.cart-list { padding: 16rpx 24rpx; }
.cart-item { display: flex; align-items: center; background: #fff; padding: 20rpx; border-radius: 16rpx; margin-bottom: 16rpx; }
.check-icon { font-size: 40rpx; margin-right: 16rpx; }
.item-img { width: 140rpx; height: 140rpx; border-radius: 12rpx; }
.item-info { flex: 1; margin-left: 16rpx; }
.item-name { font-size: 28rpx; font-weight: bold; display: block; }
.item-spec { font-size: 22rpx; color: #999; display: block; margin: 4rpx 0; }
.item-footer { margin-top: 12rpx; }
.quantity-ctrl { display: flex; align-items: center; gap: 12rpx; }
.q-btn { width: 44rpx; height: 44rpx; border-radius: 50%; background: #F5F5F5; text-align: center; line-height: 44rpx; font-size: 28rpx; color: #333; }
.q-num { font-size: 28rpx; font-weight: bold; min-width: 40rpx; text-align: center; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex; align-items: center; gap: 16rpx; border-top: 2rpx solid #F0F0F0; z-index: 100;
  .check-label { font-size: 26rpx; margin-right: 16rpx; }
  .total-info { flex: 1; font-size: 26rpx; text-align: right; margin-right: 16rpx; }
  .btn-checkout { background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border-radius: 44rpx; padding: 16rpx 36rpx; font-size: 28rpx; }
}
</style>
