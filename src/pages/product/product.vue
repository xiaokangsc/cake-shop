<template>
  <view class="product-page" v-if="product">
    <!-- 产品图片轮播 -->
    <swiper class="img-swiper" indicator-dots circular>
      <swiper-item v-for="(img, i) in product.images" :key="i">
        <image :src="getImg(img)" mode="aspectFill" class="product-main-img" />
      </swiper-item>
    </swiper>

    <!-- 产品基本信息 -->
    <view class="product-base">
      <text class="product-title">{{ product.name }}</text>
      <text class="product-desc">{{ product.description }}</text>
      <view class="price-row">
        <text class="price" style="font-size:44rpx">{{ product.price }}</text>
        <text class="original-price" v-if="product.original_price > product.price">{{ product.original_price }}</text>
        <text class="stock">库存: {{ product.stock }} | 已售: {{ product.sales }}</text>
      </view>
      <text class="category-tag">{{ product.category_name }}</text>
    </view>

    <!-- 规格选择 -->
    <view class="spec-section" v-if="product.specs && product.specs.length > 0">
      <view class="spec-group" v-for="(spec, si) in product.specs" :key="si">
        <text class="spec-label">{{ spec.name }}</text>
        <view class="spec-values">
          <text
            v-for="(val, vi) in spec.values"
            :key="vi"
            :class="['spec-val', selectedSpecs[spec.name] === val ? 'active' : '']"
            @click="selectSpec(spec.name, val)"
          >{{ val }}</text>
        </view>
      </view>
    </view>

    <!-- 数量选择 -->
    <view class="quantity-row flex-between">
      <text>数量</text>
      <view class="quantity-ctrl">
        <text class="q-btn" @click="changeQty(-1)">−</text>
        <text class="q-num">{{ quantity }}</text>
        <text class="q-btn" @click="changeQty(1)">+</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-icon" @click="goShopInfo">🏪<text>店铺</text></view>
        <view class="bar-icon" @click="goCart">🛒<text>购物车</text><text class="badge" v-if="cartCount">{{ cartCount }}</text></view>
      </view>
      <button class="btn-add-cart" @click="addCart">加入购物车</button>
      <button class="btn-buy-now" @click="buyNow">立即购买</button>
    </view>
  </view>
</template>

<script>
import { getProductDetail, addToCart } from '../../api/index';
import { useCartStore } from '../../store/cart';

export default {
  data() {
    return { product: null, selectedSpecs: {}, quantity: 1, cartCount: 0, baseUrl: 'http://localhost:3000' };
  },
  onLoad(options) {
    this.loadProduct(options.id);
  },
  onShow() {
    const store = useCartStore();
    store.fetchCount().then(() => { this.cartCount = store.count; });
  },
  methods: {
    async loadProduct(id) {
      this.product = await getProductDetail(id);
    },
    getImg(img) {
      return img ? (img.startsWith('http') ? img : this.baseUrl + img) : '/static/images/cake1.jpg';
    },
    selectSpec(name, val) {
      this.selectedSpecs[name] = val;
    },
    changeQty(n) {
      this.quantity = Math.max(1, Math.min(99, this.quantity + n));
    },
    getSpecInfo() {
      return Object.values(this.selectedSpecs).join('/');
    },
    async addCart() {
      await addToCart({ product_id: this.product.id, spec_info: this.getSpecInfo(), quantity: this.quantity });
      const store = useCartStore();
      await store.fetchCount();
      this.cartCount = store.count;
      uni.showToast({ title: '已加入购物车', icon: 'success' });
    },
    async buyNow() {
      await this.addCart();
      setTimeout(() => { uni.switchTab({ url: '/pages/cart/cart' }); }, 500);
    },
    goShopInfo() { uni.navigateTo({ url: '/pages/shop/info' }); },
    goCart() { uni.switchTab({ url: '/pages/cart/cart' }); }
  }
}
</script>

<style lang="scss" scoped>
.product-page { padding-bottom: 140rpx; }

.img-swiper { width: 100%; height: 600rpx; }
.product-main-img { width: 100%; height: 100%; }

.product-base { padding: 28rpx 24rpx; background: #fff; }
.product-title { font-size: 36rpx; font-weight: bold; display: block; }
.product-desc { font-size: 26rpx; color: #666; display: block; margin: 12rpx 0; }
.price-row { display: flex; align-items: baseline; margin: 16rpx 0; }
.stock { font-size: 22rpx; color: #ccc; margin-left: auto; }
.category-tag { display: inline-block; background: #FFF0F0; color: #FF6B81; font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; }

.spec-section { margin: 20rpx 24rpx; background: #fff; padding: 24rpx; border-radius: 16rpx; }
.spec-group { margin-bottom: 20rpx; }
.spec-label { font-size: 26rpx; color: #666; display: block; margin-bottom: 12rpx; }
.spec-values { display: flex; flex-wrap: wrap; gap: 16rpx; }
.spec-val { font-size: 26rpx; padding: 10rpx 28rpx; border: 2rpx solid #E0E0E0; border-radius: 8rpx; color: #333; }
.spec-val.active { border-color: #FF6B81; color: #FF6B81; background: #FFF5F5; }

.quantity-row { margin: 0 24rpx; background: #fff; padding: 24rpx; border-radius: 16rpx; font-size: 28rpx; }
.quantity-ctrl { display: flex; align-items: center; gap: 24rpx; }
.q-btn { width: 48rpx; height: 48rpx; border-radius: 50%; background: #F5F5F5; text-align: center; line-height: 48rpx; font-size: 32rpx; color: #333; }
.q-num { font-size: 32rpx; font-weight: bold; min-width: 48rpx; text-align: center; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex; align-items: center; gap: 16rpx; border-top: 2rpx solid #F0F0F0; z-index: 100;
  .bar-left { display: flex; gap: 24rpx; }
  .bar-icon { display: flex; flex-direction: column; align-items: center; font-size: 36rpx; position: relative; }
  .bar-icon text:last-child { font-size: 20rpx; color: #666; }
  .badge { position: absolute; top: -8rpx; right: -8rpx; background: #FF6B81; color: #fff; font-size: 18rpx; border-radius: 50%; min-width: 28rpx; height: 28rpx; text-align: center; line-height: 28rpx; padding: 0 6rpx; }
  .btn-add-cart { flex: 1; background: #FFF5F5; color: #FF6B81; border: 2rpx solid #FF6B81; border-radius: 44rpx; font-size: 28rpx; padding: 16rpx 0; }
  .btn-buy-now { flex: 1; background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border: none; border-radius: 44rpx; font-size: 28rpx; padding: 16rpx 0; }
}
</style>
