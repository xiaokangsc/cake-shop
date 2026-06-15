<template>
  <view class="order-page">
    <!-- 状态筛选 -->
    <view class="tabs">
      <text v-for="tab in tabs" :key="tab.key" :class="['tab', activeTab===tab.key ? 'active' : '']" @click="switchTab(tab.key)">{{ tab.label }}</text>
    </view>

    <view class="order-list">
      <view class="order-card" v-for="order in list" :key="order.id" @click="goDetail(order)">
        <view class="order-header flex-between">
          <text>📋 {{ order.order_no }}</text>
          <text :class="'status status-'+order.status">{{ statusMap[order.status] }}</text>
        </view>
        <view class="order-item" v-for="item in order.items" :key="item.product_id">
          <image :src="getImg(item)" mode="aspectFill" class="item-img" />
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-spec" v-if="item.spec_info">{{ item.spec_info }}</text>
            <view class="flex-between"><text class="price">{{ item.price }}</text><text>x{{ item.quantity }}</text></view>
          </view>
        </view>
        <view class="order-footer">
          <text>共{{ order.items.length }}件 合计: <text class="price">{{ order.pay_amount }}</text></text>
          <view class="actions">
            <text class="action-btn" v-if="order.status==='pending'" @click.stop="cancelOrder(order.id)">取消</text>
            <text class="action-btn primary" v-if="order.status==='pending'" @click.stop="payOrder(order.id)">付款</text>
            <text class="action-btn primary" v-if="order.status==='shipped'" @click.stop="confirmOrder(order.id)">确认收货</text>
          </view>
        </view>
      </view>
      <text v-if="list.length === 0" class="empty">暂无订单</text>
    </view>
  </view>
</template>

<script>
import { getOrders, cancelOrder, payOrder, confirmOrder } from '../../api/index';

export default {
  data() {
    return {
      tabs: [{key:'',label:'全部'},{key:'pending',label:'待付款'},{key:'paid',label:'待制作'},{key:'making',label:'制作中'},{key:'shipped',label:'配送中'},{key:'completed',label:'已完成'}],
      activeTab: '', list: [],
      statusMap: { pending:'待付款', paid:'待制作', making:'制作中', shipped:'配送中', completed:'已完成', cancelled:'已取消' },
      baseUrl: 'http://localhost:3000'
    };
  },
  onShow() { this.loadOrders(); },
  methods: {
    async loadOrders() { this.list = (await getOrders({ status: this.activeTab || undefined })).list; },
    switchTab(key) { this.activeTab = key; this.loadOrders(); },
    getImg(item) { return (item.image || '/static/images/cake1.jpg').startsWith('http') ? item.image : this.baseUrl + item.image; },
    goDetail(order) { uni.navigateTo({ url: `/pages/order/detail?id=${order.id}` }); },
    async cancelOrder(id) {
      await cancelOrder(id); uni.showToast({ title: '已取消', icon: 'success' }); this.loadOrders();
    },
    async payOrder(id) {
      await payOrder(id); uni.showToast({ title: '支付成功', icon: 'success' }); this.loadOrders();
    },
    async confirmOrder(id) {
      await confirmOrder(id); uni.showToast({ title: '已确认收货', icon: 'success' }); this.loadOrders();
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs { display: flex; background: #fff; padding: 8rpx 24rpx; overflow-x: auto; white-space: nowrap; }
.tab { display: inline-block; padding: 12rpx 24rpx; font-size: 26rpx; color: #666; margin-right: 8rpx; border-radius: 20rpx; }
.tab.active { color: #FF6B81; font-weight: bold; background: #FFF5F5; }

.order-list { padding: 16rpx 24rpx; }
.order-card { background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; overflow: hidden; }
.order-header { padding: 16rpx 24rpx; border-bottom: 1rpx solid #F5F5F5; font-size: 24rpx; }
.status { font-size: 24rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.status-pending { color: #FF9800; background: #FFF8E1; }
.status-paid, .status-making { color: #2196F3; background: #E3F2FD; }
.status-shipped { color: #4CAF50; background: #E8F5E9; }
.status-completed { color: #999; background: #F5F5F5; }
.status-cancelled { color: #999; background: #F5F5F5; }

.order-item { display: flex; padding: 16rpx 24rpx; }
.item-img { width: 100rpx; height: 100rpx; border-radius: 12rpx; }
.item-info { flex: 1; margin-left: 16rpx; }
.item-name { font-size: 28rpx; font-weight: bold; display: block; }
.item-spec { font-size: 22rpx; color: #999; }

.order-footer { padding: 16rpx 24rpx; border-top: 1rpx solid #F5F5F5; display: flex; justify-content: space-between; align-items: center; font-size: 26rpx; }
.actions { display: flex; gap: 12rpx; }
.action-btn { padding: 8rpx 20rpx; border: 1rpx solid #DDD; border-radius: 32rpx; font-size: 24rpx; color: #666; }
.action-btn.primary { background: #FF6B81; color: #fff; border-color: #FF6B81; }
.empty { text-align: center; padding: 200rpx 0; color: #999; font-size: 28rpx; display: block; }
</style>
