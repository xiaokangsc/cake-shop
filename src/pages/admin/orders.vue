<template>
  <view class="admin-orders">
    <view class="tabs">
      <text v-for="tab in tabs" :key="tab.key" :class="['tab', activeTab===tab.key ? 'active' : '']" @click="switchTab(tab.key)">{{ tab.label }}</text>
    </view>

    <view class="order-list">
      <view class="order-card" v-for="order in list" :key="order.id">
        <view class="order-header flex-between">
          <text class="order-no">{{ order.order_no }}</text>
          <text :class="'status status-'+order.status">{{ statusMap[order.status] }}</text>
        </view>
        <view class="order-item" v-for="item in order.items" :key="item.product_id">
          <text>{{ item.name }} x{{ item.quantity }}</text>
          <text class="price">{{ item.price }}</text>
        </view>
        <view class="order-footer flex-between">
          <text>实付: <text class="price">{{ order.pay_amount }}</text></text>
          <text>{{ order.address_snapshot?.name }} {{ order.address_snapshot?.phone?.slice(-4) }}</text>
        </view>
        <view class="status-actions">
          <text v-if="order.status==='paid'" class="s-btn" @click="updateStatus(order.id, 'making')">开始制作</text>
          <text v-if="order.status==='making'" class="s-btn" @click="updateStatus(order.id, 'shipped')">开始配送</text>
        </view>
      </view>
      <text v-if="list.length === 0" class="empty">暂无订单</text>
    </view>
  </view>
</template>

<script>
import { getAdminOrders, updateOrderStatus } from '../../api/index';

export default {
  data() {
    return {
      tabs: [{key:'',label:'全部'},{key:'paid',label:'待制作'},{key:'making',label:'制作中'},{key:'shipped',label:'配送中'},{key:'completed',label:'已完成'}],
      activeTab: '', list: [],
      statusMap: { pending:'待付款', paid:'待制作', making:'制作中', shipped:'配送中', completed:'已完成', cancelled:'已取消' }
    };
  },
  onShow() { this.loadOrders(); },
  methods: {
    async loadOrders() { this.list = (await getAdminOrders({ status: this.activeTab || undefined })).list; },
    switchTab(key) { this.activeTab = key; this.loadOrders(); },
    async updateStatus(orderId, status) {
      await updateOrderStatus(orderId, status);
      uni.showToast({ title: '状态已更新', icon: 'success' }); this.loadOrders();
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs { display: flex; background: #fff; padding: 8rpx 24rpx; overflow-x: auto; white-space: nowrap; }
.tab { padding: 12rpx 24rpx; font-size: 26rpx; border-radius: 20rpx; margin-right: 8rpx; color: #666; }
.tab.active { color: #FF6B81; font-weight: bold; background: #FFF5F5; }

.order-list { padding: 16rpx 24rpx; }
.order-card { background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; padding: 20rpx 24rpx; }
.order-header { margin-bottom: 12rpx; }
.order-no { font-size: 24rpx; color: #666; }
.status { font-size: 24rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.status-paid { color: #2196F3; background: #E3F2FD; }
.status-making { color: #FF9800; background: #FFF8E1; }
.status-shipped { color: #4CAF50; background: #E8F5E9; }

.order-item { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 26rpx; }
.order-footer { padding-top: 12rpx; border-top: 1rpx solid #F0F0F0; margin-top: 8rpx; font-size: 24rpx; color: #666; }

.status-actions { display: flex; justify-content: flex-end; gap: 16rpx; margin-top: 12rpx; padding-top: 12rpx; border-top: 1rpx dashed #F0F0F0; }
.s-btn { padding: 10rpx 28rpx; border-radius: 32rpx; font-size: 24rpx; background: #FF6B81; color: #fff; }
.empty { text-align: center; padding: 200rpx 0; color: #999; font-size: 28rpx; display: block; }
</style>
