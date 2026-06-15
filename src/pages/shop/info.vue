<template>
  <view class="shop-page">
    <view class="shop-header">
      <text class="shop-icon">🏪</text>
      <text class="shop-name">{{ info.name }}</text>
      <text class="shop-desc">精品蛋糕 · 现做现发</text>
    </view>

    <view class="info-card">
      <view class="info-row"><text>🕐 营业时间</text><text>{{ info.business_hours }}</text></view>
      <view class="info-row" @click="call"><text>📞 联系电话</text><text class="link">{{ info.phone }}</text></view>
      <view class="info-row" @click="navigate"><text>📍 店铺地址</text><text class="link">{{ info.address }}</text></view>
      <view class="info-row"><text>🚚 配送费</text><text>¥{{ info.delivery_fee }}</text></view>
      <view class="info-row"><text>📦 起送价</text><text>¥{{ info.min_order }}</text></view>
    </view>

    <view class="notice-card">
      <text class="notice-title">📢 店铺公告</text>
      <text class="notice-text">{{ info.notice }}</text>
    </view>
  </view>
</template>

<script>
import { getShopInfo } from '../../api/index';

export default {
  data() { return { info: {} }; },
  onLoad() { this.loadInfo(); },
  methods: {
    async loadInfo() { this.info = await getShopInfo(); },
    call() { if (this.info.phone) uni.makePhoneCall({ phoneNumber: this.info.phone }); },
    navigate() {
      if (this.info.latitude) {
        uni.openLocation({ latitude: this.info.latitude, longitude: this.info.longitude, name: this.info.name, address: this.info.address });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-header { background: linear-gradient(135deg, #FF6B81, #FF8E9E); padding: 60rpx 24rpx; text-align: center; color: #fff; }
.shop-icon { font-size: 80rpx; }
.shop-name { font-size: 38rpx; font-weight: bold; display: block; margin-top: 12rpx; }
.shop-desc { font-size: 26rpx; opacity: 0.8; display: block; margin-top: 8rpx; }

.info-card { margin: 20rpx 24rpx; background: #fff; border-radius: 16rpx; padding: 8rpx 24rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; font-size: 28rpx; border-bottom: 1rpx solid #F5F5F5; }
.info-row:last-child { border: none; }
.link { color: #2196F3; }

.notice-card { margin: 20rpx 24rpx; background: #FFF8E1; border-radius: 16rpx; padding: 24rpx; }
.notice-title { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 12rpx; }
.notice-text { font-size: 26rpx; color: #666; line-height: 1.6; }
</style>
