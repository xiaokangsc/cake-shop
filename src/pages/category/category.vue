<template>
  <view class="category-page">
    <!-- 搜索 -->
    <view class="search-bar">
      <text class="search-icon">🔍</text>
      <input class="search-input" v-model="keyword" placeholder="搜索蛋糕名称..." @confirm="doSearch" />
    </view>

    <view class="cat-content">
      <!-- 左侧分类 -->
      <scroll-view class="cat-sidebar" scroll-y>
        <view :class="['cat-item', activeCat===0 ? 'active' : '']" @click="switchCat(0)">全部</view>
        <view :class="['cat-item', activeCat===c.id ? 'active' : '']" v-for="c in categories" :key="c.id" @click="switchCat(c.id)">
          {{ c.name }}
        </view>
      </scroll-view>

      <!-- 右侧产品列表 -->
      <scroll-view class="product-list" scroll-y @scrolltolower="loadMore">
        <view class="product-card" v-for="item in productList" :key="item.id" @click="goDetail(item.id)">
          <image :src="getImage(item)" mode="aspectFill" class="product-img" />
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-desc text-ellipsis">{{ item.description }}</text>
            <view class="flex-between">
              <text class="price">{{ item.price }}</text>
              <text class="sales">已售{{ item.sales }}</text>
            </view>
          </view>
        </view>
        <text v-if="loading" class="loading-text">加载中...</text>
        <text v-if="!loading && productList.length === 0" class="empty-text">暂无产品</text>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getCategories, getProducts } from '../../api/index';

export default {
  data() {
    return { categories: [], activeCat: 0, productList: [], page: 1, keyword: '', loading: false, noMore: false, baseUrl: 'http://localhost:3000' };
  },
  onLoad(options) {
    if (options.id) this.activeCat = Number(options.id);
    this.loadCategories();
    this.loadProducts(true);
  },
  methods: {
    async loadCategories() { this.categories = await getCategories(); },
    async loadProducts(reset = false) {
      if (this.loading) return;
      if (reset) { this.page = 1; this.noMore = false; }
      this.loading = true;
      const res = await getProducts({
        category_id: this.activeCat || undefined,
        keyword: this.keyword || undefined,
        page: this.page, page_size: 8
      });
      if (reset) { this.productList = res.list; } else { this.productList.push(...res.list); }
      this.noMore = this.productList.length >= res.total;
      this.loading = false;
    },
    switchCat(id) { this.activeCat = id; this.loadProducts(true); },
    doSearch() { this.loadProducts(true); },
    loadMore() { if (!this.noMore) { this.page++; this.loadProducts(false); } },
    getImage(item) { const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images; return (imgs[0] || '/static/images/cake1.jpg').startsWith('http') ? imgs[0] : this.baseUrl + imgs[0]; },
    goDetail(id) { uni.navigateTo({ url: `/pages/product/product?id=${id}` }); }
  }
}
</script>

<style lang="scss" scoped>
.category-page { height: 100vh; display: flex; flex-direction: column; }
.search-bar { margin: 16rpx 24rpx; padding: 14rpx 24rpx; background: #fff; border-radius: 40rpx; display: flex; align-items: center; }
.search-icon { margin-right: 12rpx; }
.search-input { flex: 1; font-size: 28rpx; }

.cat-content { flex: 1; display: flex; overflow: hidden; }
.cat-sidebar { width: 180rpx; background: #F5F5F5; padding: 8rpx 0; }
.cat-item { padding: 28rpx 0; text-align: center; font-size: 26rpx; color: #666; position: relative; }
.cat-item.active { background: #fff; color: #FF6B81; font-weight: bold; }
.cat-item.active::before { content: ''; position: absolute; left: 0; top: 25%; width: 6rpx; height: 50%; background: #FF6B81; border-radius: 0 4rpx 4rpx 0; }

.product-list { flex: 1; padding: 16rpx; }
.product-card { background: #fff; border-radius: 16rpx; overflow: hidden; margin-bottom: 16rpx; }
.product-img { width: 100%; height: 280rpx; }
.product-info { padding: 16rpx; }
.product-name { font-size: 28rpx; font-weight: bold; display: block; }
.product-desc { font-size: 22rpx; color: #999; display: block; margin: 6rpx 0; }
.sales { font-size: 20rpx; color: #ccc; }
.loading-text, .empty-text { text-align: center; color: #999; padding: 40rpx; font-size: 26rpx; }
</style>
