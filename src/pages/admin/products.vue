<template>
  <view class="admin-products">
    <view class="top-bar">
      <input v-model="keyword" placeholder="搜索产品..." class="search-input" @confirm="loadData" />
      <text class="btn-add" @click="goEdit()">+新增</text>
    </view>

    <view class="product-list">
      <view class="product-card" v-for="item in list" :key="item.id">
        <image :src="getImg(item)" mode="aspectFill" class="product-img" />
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-cat">{{ item.category_name }}</text>
          <view class="flex-between">
            <text class="price">{{ item.price }}</text>
            <text :class="item.status===1 ? 'tag-on' : 'tag-off'">{{ item.status===1 ? '上架' : '下架' }}</text>
          </view>
          <view class="actions">
            <text @click="goEdit(item)">编辑</text>
            <text @click="toggleStatus(item)">{{ item.status===1 ? '下架' : '上架' }}</text>
            <text class="del" @click="delProduct(item.id)">删除</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAdminProducts, updateProductStatus, deleteProduct } from '../../api/index';

export default {
  data() { return { list: [], keyword: '', baseUrl: 'http://localhost:3000' }; },
  onShow() { this.loadData(); },
  methods: {
    async loadData() { this.list = await getAdminProducts(); },
    getImg(item) { const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []); return (imgs[0] || '/static/images/cake1.jpg').startsWith('http') ? imgs[0] : this.baseUrl + imgs[0]; },
    goEdit(item) { if (item) { uni.navigateTo({ url: `/pages/admin/product-edit?id=${item.id}` }); } else { uni.navigateTo({ url: '/pages/admin/product-edit' }); } },
    async toggleStatus(item) {
      const newStatus = item.status === 1 ? 0 : 1;
      await updateProductStatus(item.id, newStatus);
      item.status = newStatus;
      uni.showToast({ title: newStatus === 1 ? '已上架' : '已下架', icon: 'success' });
    },
    async delProduct(id) {
      const res = await new Promise(r => uni.showModal({ title: '确认删除', content: '删除后不可恢复', success: r }));
      if (res.confirm) { await deleteProduct(id); this.loadData(); uni.showToast({ title: '已删除', icon: 'success' }); }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar { display: flex; margin: 20rpx 24rpx; gap: 16rpx; }
.search-input { flex: 1; background: #fff; border-radius: 40rpx; padding: 16rpx 24rpx; font-size: 28rpx; }
.btn-add { background: #FF6B81; color: #fff; border-radius: 40rpx; padding: 16rpx 28rpx; font-size: 26rpx; white-space: nowrap; }

.product-list { padding: 0 24rpx; }
.product-card { background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; overflow: hidden; display: flex; }
.product-img { width: 160rpx; height: 160rpx; flex-shrink: 0; }
.product-info { flex: 1; padding: 16rpx; }
.product-name { font-size: 28rpx; font-weight: bold; display: block; }
.product-cat { font-size: 22rpx; color: #999; }
.tag-on { color: #4CAF50; font-size: 22rpx; }
.tag-off { color: #999; font-size: 22rpx; }
.actions { display: flex; gap: 20rpx; margin-top: 8rpx; font-size: 24rpx; color: #2196F3; }
.actions .del { color: #FF6B81; }
</style>
