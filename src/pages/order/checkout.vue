<template>
  <view class="checkout-page">
    <!-- 地址 -->
    <view class="address-section" @click="goAddress" v-if="selectedAddress">
      <text class="addr-name">{{ selectedAddress.name }} {{ selectedAddress.phone }}</text>
      <text class="addr-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
    </view>
    <view class="address-section address-empty" @click="goAddress" v-else>
      <text>📍 请添加收货地址</text>
    </view>

    <!-- 订单商品 -->
    <view class="order-items">
      <view class="order-item" v-for="item in items" :key="item.id">
        <image :src="getImg(item)" mode="aspectFill" class="item-img" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec" v-if="item.spec_info">{{ item.spec_info }}</text>
          <view class="flex-between">
            <text class="price">{{ item.price }}</text>
            <text>x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <text>备注</text>
      <input v-model="remark" placeholder="如有特殊要求请留言..." />
    </view>

    <!-- 金额汇总 -->
    <view class="amount-section">
      <view class="amount-row"><text>商品金额</text><text>¥{{ totalAmount.toFixed(2) }}</text></view>
      <view class="amount-row"><text>配送费</text><text>¥{{ deliveryFee }}</text></view>
      <view class="amount-row total"><text>实付金额</text><text class="price" style="font-size:36rpx">¥{{ (totalAmount + deliveryFee).toFixed(2) }}</text></view>
    </view>

    <!-- 提交 -->
    <view class="submit-bar">
      <view class="total-line">合计: <text class="price" style="font-size:36rpx">¥{{ (totalAmount + deliveryFee).toFixed(2) }}</text></view>
      <view class="btn-submit" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script>
import { getCartList, createOrder, getAddresses, getShopInfo } from '../../api/index';
import { useCartStore } from '../../store/cart';

export default {
  data() {
    return { items: [], selectedAddress: null, remark: '', deliveryFee: 5, minOrder: 30, baseUrl: 'http://localhost:3000' };
  },
  computed: { totalAmount() { return this.items.filter(i => i.checked).reduce((s, i) => s + i.price * i.quantity, 0); } },
  async onLoad() {
    const cartItems = await getCartList();
    this.items = cartItems;
    const addrs = await getAddresses();
    this.selectedAddress = addrs.find(a => a.is_default) || addrs[0] || null;
    try { const shop = await getShopInfo(); this.deliveryFee = shop.delivery_fee || 5; this.minOrder = shop.min_order || 30; } catch (e) {}
  },
  methods: {
    getImg(item) { const imgs = item.images || []; return (imgs[0] || '/static/images/cake1.jpg').startsWith('http') ? imgs[0] : this.baseUrl + imgs[0]; },
    goAddress() { uni.navigateTo({ url: '/pages/user/address?select=1' }); },
    async submitOrder() {
      if (!this.selectedAddress) { uni.showToast({ title: '请选择地址', icon: 'none' }); return; }
      if (this.totalAmount < this.minOrder) { uni.showToast({ title: `满¥${this.minOrder}起送`, icon: 'none' }); return; }
      const res = await createOrder({ address_id: this.selectedAddress.id, remark: this.remark });
      uni.showToast({ title: '下单成功!', icon: 'success' });
      useCartStore().fetchCount();
      // 模拟支付
      setTimeout(async () => {
        const { payOrder } = require('../../api/index');
        await payOrder((await getCartList()).length === 0 ? res.order_no : ''); // 简化处理
      }, 500);
      setTimeout(() => { uni.redirectTo({ url: `/pages/order/detail?order_no=${res.order_no}` }); }, 800);
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-page { padding: 20rpx 24rpx 160rpx; }
.address-section { background: #fff; padding: 28rpx; border-radius: 16rpx; margin-bottom: 16rpx; }
.address-empty { color: #999; text-align: center; }
.addr-name { font-size: 30rpx; font-weight: bold; display: block; }
.addr-detail { font-size: 26rpx; color: #666; display: block; margin-top: 8rpx; }

.order-items { background: #fff; border-radius: 16rpx; padding: 16rpx 24rpx; margin-bottom: 16rpx; }
.order-item { display: flex; padding: 16rpx 0; border-bottom: 1rpx solid #F0F0F0; }
.order-item:last-child { border: none; }
.item-img { width: 120rpx; height: 120rpx; border-radius: 12rpx; }
.item-info { flex: 1; margin-left: 16rpx; }
.item-name { font-size: 28rpx; font-weight: bold; display: block; }
.item-spec { font-size: 22rpx; color: #999; display: block; margin: 4rpx 0; }

.remark-section { background: #fff; padding: 24rpx; border-radius: 16rpx; margin-bottom: 16rpx; font-size: 28rpx; display: flex; }
.remark-section text { width: 100rpx; flex-shrink: 0; }
.remark-section input { flex: 1; font-size: 26rpx; }

.amount-section { background: #fff; padding: 24rpx; border-radius: 16rpx; margin-bottom: 16rpx; }
.amount-row { display: flex; justify-content: space-between; font-size: 28rpx; padding: 8rpx 0; color: #666; }
.amount-row.total { color: #333; font-weight: bold; padding-top: 16rpx; border-top: 1rpx solid #F0F0F0; margin-top: 8rpx; }

.submit-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 16rpx 24rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: flex-end; gap: 24rpx; border-top: 2rpx solid #F0F0F0; }
.total-line { font-size: 28rpx; }
.btn-submit { background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border-radius: 44rpx; padding: 16rpx 48rpx; font-size: 28rpx; }
</style>
