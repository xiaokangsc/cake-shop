<template>
  <view class="admin-page">
    <view class="admin-header">🔧 管理后台</view>

    <!-- 数据概览 -->
    <view class="stats-grid">
      <view class="stat-card"><text class="stat-num">{{ dashboard.todayOrders }}</text><text class="stat-label">今日订单</text></view>
      <view class="stat-card"><text class="stat-num">¥{{ dashboard.todayAmount }}</text><text class="stat-label">今日营收</text></view>
      <view class="stat-card"><text class="stat-num">{{ dashboard.totalOrders }}</text><text class="stat-label">总订单</text></view>
      <view class="stat-card"><text class="stat-num">¥{{ dashboard.totalAmount }}</text><text class="stat-label">总营收</text></view>
    </view>

    <view class="stats-grid">
      <view class="stat-card"><text class="stat-num">{{ dashboard.productCount }}</text><text class="stat-label">产品数</text></view>
      <view class="stat-card"><text class="stat-num">{{ dashboard.userCount }}</text><text class="stat-label">用户数</text></view>
    </view>

    <!-- 快捷操作 -->
    <view class="menu-section">
      <text class="section-title">快捷操作</text>
      <view class="menu-item" @click="goPage('/pages/admin/products')"><text>📦 产品管理</text><text>></text></view>
      <view class="menu-item" @click="goPage('/pages/admin/orders')"><text>📋 订单管理</text><text>></text></view>
      <view class="menu-item" @click="goPage('/pages/shop/info')"><text>🏪 店铺设置</text><text>></text></view>
      <view class="menu-item" @click="importData"><text>📥 导入抖音数据</text><text>></text></view>
    </view>
  </view>
</template>

<script>
import { getDashboard } from '../../api/index';

export default {
  data() { return { dashboard: {} }; },
  onShow() { this.loadData(); },
  methods: {
    async loadData() { this.dashboard = await getDashboard(); },
    goPage(url) { uni.navigateTo({ url }); },
    importData() {
      // 示例：从抖音导出的JSON数据导入
      const sampleData = [
        { name: "草莓奶油蛋糕", price: 168, category: "生日", description: "新鲜草莓+动物奶油" },
        { name: "芒果千层", price: 188, category: "千层", description: "新鲜芒果+手工薄皮" }
      ];
      uni.showModal({
        title: '导入抖音数据',
        content: `将导入 ${sampleData.length} 个产品（示例数据），确定继续？`,
        success: async (res) => {
          if (res.confirm) {
            const { importDouyinProducts } = require('../../api/index');
            const result = await importDouyinProducts(sampleData);
            uni.showToast({ title: `已导入 ${result.imported} 个`, icon: 'success' });
            this.loadData();
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-page { padding: 20rpx 24rpx 120rpx; }
.admin-header { background: #333; color: #fff; padding: 40rpx 24rpx; border-radius: 16rpx; font-size: 34rpx; font-weight: bold; margin-bottom: 20rpx; }

.stats-grid { display: flex; gap: 16rpx; margin-bottom: 16rpx; }
.stat-card { flex: 1; background: #fff; border-radius: 16rpx; padding: 28rpx 16rpx; text-align: center; }
.stat-num { font-size: 38rpx; font-weight: bold; color: #FF6B81; display: block; }
.stat-label { font-size: 22rpx; color: #999; display: block; margin-top: 8rpx; }

.menu-section { background: #fff; border-radius: 16rpx; padding: 0 24rpx; }
.section-title { font-size: 30rpx; font-weight: bold; display: block; padding: 24rpx 0; border-bottom: 1rpx solid #F5F5F5; }
.menu-item { display: flex; justify-content: space-between; padding: 28rpx 0; font-size: 28rpx; border-bottom: 1rpx solid #F5F5F5; }
.menu-item:last-child { border: none; }
.menu-item text:last-child { color: #ccc; }
</style>
