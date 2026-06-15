<template>
  <view class="order-detail-page" v-if="order">
    <!-- 状态 -->
    <view class="status-card" :class="'bg-'+order.status">
      <text class="status-title">{{ statusMap[order.status] }}</text>
      <text class="status-desc">{{ statusDesc[order.status] || '' }}</text>
    </view>

    <!-- 收货地址 -->
    <view class="info-card">
      <text class="card-title">📍 收货地址</text>
      <text class="addr-text">{{ order.address_snapshot.name }} {{ order.address_snapshot.phone }}</text>
      <text class="addr-text">{{ order.address_snapshot.address }}</text>
    </view>

    <!-- 商品列表 -->
    <view class="info-card">
      <text class="card-title">📦 商品信息</text>
      <view class="order-item" v-for="item in order.items" :key="item.product_id">
        <image :src="getImg(item)" mode="aspectFill" class="item-img" />
        <view class="item-info">
          <text>{{ item.name }}</text>
          <text class="item-spec" v-if="item.spec_info">{{ item.spec_info }}</text>
        </view>
        <view class="item-right">
          <text class="price">{{ item.price }}</text>
          <text>x{{ item.quantity }}</text>
        </view>
      </view>
      <view class="amount-summary">
        <view class="flex-between"><text>商品金额</text><text>¥{{ order.total_amount }}</text></view>
        <view class="flex-between"><text>实付金额</text><text class="price" style="font-size:32rpx">¥{{ order.pay_amount }}</text></view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card">
      <text class="card-title">📋 订单信息</text>
      <view class="info-row"><text>订单编号</text><text>{{ order.order_no }}</text></view>
      <view class="info-row"><text>创建时间</text><text>{{ order.created_at }}</text></view>
      <view class="info-row" v-if="order.pay_time"><text>支付时间</text><text>{{ order.pay_time }}</text></view>
      <view class="info-row" v-if="order.remark"><text>备注</text><text>{{ order.remark }}</text></view>
    </view>
  </view>
</template>

<script>
import { getOrderDetail } from '../../api/index';

export default {
  data() {
    return {
      order: null, baseUrl: 'http://localhost:3000',
      statusMap: { pending:'待付款', paid:'待制作', making:'制作中', shipped:'配送中', completed:'已完成', cancelled:'已取消' },
      statusDesc: { pending:'请尽快付款哦~', paid:'店主正在准备制作', making:'您的蛋糕正在精心制作中', shipped:'正在为您配送', completed:'感谢您的购买!', cancelled:'订单已取消' }
    };
  },
  onLoad(options) { this.loadOrder(options.id); },
  methods: {
    async loadOrder(id) { this.order = await getOrderDetail(id); },
    getImg(item) { return (item.image || '/static/images/cake1.jpg').startsWith('http') ? item.image : this.baseUrl + item.image; }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-page { padding: 20rpx 24rpx 100rpx; }
.status-card { padding: 40rpx 24rpx; border-radius: 16rpx; margin-bottom: 16rpx; text-align: center; color: #fff; }
.bg-pending { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.bg-paid, .bg-making { background: linear-gradient(135deg, #2196F3, #64B5F6); }
.bg-shipped { background: linear-gradient(135deg, #4CAF50, #81C784); }
.bg-completed { background: linear-gradient(135deg, #999, #BDBDBD); }
.bg-cancelled { background: linear-gradient(135deg, #999, #BDBDBD); }
.status-title { font-size: 40rpx; font-weight: bold; display: block; }
.status-desc { font-size: 26rpx; display: block; margin-top: 8rpx; opacity: 0.9; }

.info-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; }
.card-title { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 16rpx; padding-bottom: 12rpx; border-bottom: 1rpx solid #F5F5F5; }
.addr-text { font-size: 28rpx; display: block; margin-bottom: 4rpx; color: #333; }

.order-item { display: flex; align-items: center; padding: 12rpx 0; border-bottom: 1rpx solid #F5F5F5; }
.order-item:last-child { border: none; }
.item-img { width: 80rpx; height: 80rpx; border-radius: 12rpx; }
.item-info { flex: 1; margin-left: 16rpx; font-size: 26rpx; }
.item-spec { color: #999; font-size: 22rpx; display: block; }
.item-right { text-align: right; font-size: 26rpx; }

.amount-summary { margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid #F5F5F5; font-size: 26rpx; color: #666; }
.amount-summary > view { padding: 4rpx 0; }

.info-row { display: flex; justify-content: space-between; padding: 8rpx 0; font-size: 26rpx; color: #666; }
</style>
