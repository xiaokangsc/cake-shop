<template>
  <view class="user-page">
    <!-- 用户头部 -->
    <view class="user-header">
      <image :src="userInfo.avatar || '/static/images/cake1.jpg'" mode="aspectFill" class="avatar" />
      <text class="nickname">{{ userInfo.nickname || '蛋糕爱好者' }}</text>
      <text class="phone" v-if="userInfo.phone">{{ userInfo.phone }}</text>
    </view>

    <!-- 订单状态 -->
    <view class="order-section">
      <view class="section-title flex-between">
        <text>我的订单</text>
        <text class="more" @click="goOrders()">全部 ></text>
      </view>
      <view class="order-status-grid">
        <view class="status-item" @click="goOrders('pending')">
          <text class="status-icon">💳</text><text>待付款</text>
        </view>
        <view class="status-item" @click="goOrders('paid')">
          <text class="status-icon">👨‍🍳</text><text>待制作</text>
        </view>
        <view class="status-item" @click="goOrders('shipped')">
          <text class="status-icon">🚚</text><text>配送中</text>
        </view>
        <view class="status-item" @click="goOrders('completed')">
          <text class="status-icon">✅</text><text>已完成</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goAddress"><text>📍 收货地址</text><text>></text></view>
      <view class="menu-item" @click="goShopInfo"><text>🏪 店铺信息</text><text>></text></view>
      <view class="menu-item" @click="goAdmin" v-if="userInfo.role === 'admin'"><text>⚙️ 管理后台</text><text>></text></view>
      <view class="menu-item" @click="callShop"><text>📞 联系客服</text><text>></text></view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '../../store/user';
import { getShopInfo } from '../../api/index';

export default {
  data() { return { userInfo: {}, shopPhone: '' }; },
  onShow() {
    const store = useUserStore();
    store.loadFromStorage();
    this.userInfo = store.userInfo || {};
    this.loadShopInfo();
  },
  methods: {
    async loadShopInfo() { try { const shop = await getShopInfo(); this.shopPhone = shop.phone; } catch (e) {} },
    goOrders(status) { uni.navigateTo({ url: `/pages/order/list${status ? '?status='+status : ''}` }); },
    goAddress() { uni.navigateTo({ url: '/pages/user/address' }); },
    goShopInfo() { uni.navigateTo({ url: '/pages/shop/info' }); },
    goAdmin() { uni.navigateTo({ url: '/pages/admin/dashboard' }); },
    callShop() {
      if (this.shopPhone) { uni.makePhoneCall({ phoneNumber: this.shopPhone }); }
      else { uni.showToast({ title: '暂无客服电话', icon: 'none' }); }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-header {
  background: linear-gradient(135deg, #FF6B81, #FF8E9E); padding: 60rpx 24rpx 40rpx;
  display: flex; flex-direction: column; align-items: center;
  .avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 4rpx solid #fff; }
  .nickname { font-size: 34rpx; color: #fff; font-weight: bold; margin-top: 16rpx; }
  .phone { font-size: 24rpx; color: rgba(255,255,255,0.8); margin-top: 4rpx; }
}

.order-section, .menu-section { margin: 20rpx 24rpx; background: #fff; border-radius: 16rpx; padding: 24rpx; }
.section-title { font-size: 30rpx; font-weight: bold; margin-bottom: 24rpx; }
.more { font-size: 24rpx; color: #999; font-weight: normal; }

.order-status-grid { display: flex; justify-content: space-around; }
.status-item { display: flex; flex-direction: column; align-items: center; font-size: 24rpx; color: #333; }
.status-icon { font-size: 48rpx; margin-bottom: 8rpx; }

.menu-item { display: flex; justify-content: space-between; padding: 24rpx 0; font-size: 28rpx; border-bottom: 1rpx solid #F5F5F5; }
.menu-item:last-child { border: none; }
.menu-item text:last-child { color: #ccc; }
</style>
