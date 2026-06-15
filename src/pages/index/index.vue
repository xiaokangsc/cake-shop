<template>
  <view class="home-page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goSearch">
      <text class="search-icon">🔍</text>
      <text class="search-text">搜索蛋糕...</text>
    </view>

    <!-- 轮播 Banner -->
    <swiper class="banner-swiper" indicator-dots autoplay interval="3000" circular>
      <swiper-item v-for="item in banners" :key="item.id" @click="goProduct(item.link)">
        <image :src="baseUrl + item.image" mode="aspectFill" class="banner-img" />
      </swiper-item>
    </swiper>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="cat-item" v-for="cat in categories" :key="cat.id" @click="goCategory(cat.id)">
        <text class="cat-icon">{{ getCatIcon(cat.name) }}</text>
        <text class="cat-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 店铺信息卡片 -->
    <view class="shop-card" @click="goShopInfo">
      <view class="shop-logo">🏪</view>
      <view class="shop-info">
        <text class="shop-name">{{ shopInfo.name }}</text>
        <text class="shop-desc">🕐 {{ shopInfo.business_hours }} | 🚚 配送费 ¥{{ shopInfo.delivery_fee }}</text>
        <text class="shop-notice">📢 {{ shopInfo.notice }}</text>
      </view>
    </view>

    <!-- 推荐产品 -->
    <view class="section">
      <view class="section-header"><text class="section-title">🔥 热销推荐</text><text class="section-more" @click="goCategory(0)">更多 ></text></view>
      <view class="product-grid">
        <view class="product-card" v-for="item in recommendList" :key="item.id" @click="goProduct(item.id)">
          <image :src="getImage(item)" mode="aspectFill" class="product-img" />
          <view class="product-info">
            <text class="product-name text-ellipsis">{{ item.name }}</text>
            <text class="product-desc text-ellipsis">{{ item.description }}</text>
            <view class="product-footer flex-between">
              <text class="price">{{ item.price }}</text>
              <text class="sales">已售{{ item.sales }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<script>
import { getBanners, getCategories, getShopInfo, getProducts } from '../../api/index';

export default {
  data() {
    return { baseUrl: 'http://localhost:3000', banners: [], categories: [], shopInfo: {}, recommendList: [] };
  },
  onLoad() { this.loadData(); },
  onShow() {
    const store = require('../../store/cart').useCartStore();
    store.fetchCount();
  },
  methods: {
    async loadData() {
      try {
        const [banners, categories, shopInfo, products] = await Promise.all([
          getBanners(), getCategories(), getShopInfo(),
          getProducts({ is_recommend: 1, page_size: 10 })
        ]);
        this.banners = banners;
        this.categories = categories.slice(0, 8);
        this.shopInfo = shopInfo;
        this.recommendList = products.list;
      } catch (e) { console.error(e); }
    },
    getImage(item) {
      if (!item.images) return '/static/images/cake1.jpg';
      const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
      return (imgs[0] || '/static/images/cake1.jpg').startsWith('http') ? imgs[0] : this.baseUrl + imgs[0];
    },
    getCatIcon(name) {
      const icons = { '生日蛋糕': '🎂', '慕斯蛋糕': '🍰', '芝士蛋糕': '🧀', '千层蛋糕': '🥞', '杯子蛋糕': '🧁', '定制蛋糕': '🎨' };
      return icons[name] || '🍰';
    },
    goProduct(id) { uni.navigateTo({ url: `/pages/product/product?id=${id}` }); },
    goCategory(id) { uni.navigateTo({ url: `/pages/category/category?id=${id || ''}` }); },
    goSearch() { uni.navigateTo({ url: '/pages/category/category' }); },
    goShopInfo() { uni.navigateTo({ url: '/pages/shop/info' }); }
  }
}
</script>

<style lang="scss" scoped>
.home-page { padding-bottom: 100rpx; }

.search-bar {
  margin: 20rpx 24rpx; padding: 16rpx 24rpx;
  background: #fff; border-radius: 40rpx; display: flex; align-items: center;
  .search-icon { margin-right: 12rpx; }
  .search-text { color: #999; font-size: 28rpx; }
}

.banner-swiper {
  margin: 0 24rpx; height: 320rpx; border-radius: 16rpx; overflow: hidden;
  .banner-img { width: 100%; height: 100%; }
}

.category-nav {
  display: flex; flex-wrap: wrap; padding: 24rpx; background: #fff; margin: 20rpx 24rpx; border-radius: 16rpx;
  .cat-item { width: 25%; display: flex; flex-direction: column; align-items: center; padding: 16rpx 0; }
  .cat-icon { font-size: 48rpx; margin-bottom: 8rpx; }
  .cat-name { font-size: 24rpx; color: #333; }
}

.shop-card {
  margin: 0 24rpx 20rpx; padding: 24rpx; background: linear-gradient(135deg, #FFF5F5, #FFF); border-radius: 16rpx;
  display: flex; align-items: center; border: 2rpx solid #FFE0E0;
  .shop-logo { font-size: 56rpx; margin-right: 20rpx; }
  .shop-info { flex: 1; }
  .shop-name { font-size: 30rpx; font-weight: bold; display: block; }
  .shop-desc { font-size: 24rpx; color: #666; display: block; margin: 6rpx 0; }
  .shop-notice { font-size: 22rpx; color: #FF6B81; }
}

.section { margin: 32rpx 24rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.section-title { font-size: 34rpx; font-weight: bold; }
.section-more { font-size: 26rpx; color: #999; }

.product-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.product-card {
  width: calc(50% - 8rpx); background: #fff; border-radius: 16rpx; overflow: hidden;
  .product-img { width: 100%; height: 340rpx; }
  .product-info { padding: 16rpx; }
  .product-name { font-size: 28rpx; font-weight: bold; display: block; }
  .product-desc { font-size: 22rpx; color: #999; display: block; margin: 6rpx 0; }
  .product-footer { margin-top: 8rpx; }
  .sales { font-size: 22rpx; color: #ccc; }
}

.safe-bottom { height: calc(100rpx + env(safe-area-inset-bottom)); }
</style>
