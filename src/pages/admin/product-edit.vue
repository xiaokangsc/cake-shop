<template>
  <view class="product-edit">
    <view class="form">
      <text class="form-label">产品名称</text>
      <input v-model="form.name" placeholder="请输入产品名称" class="form-input" />

      <text class="form-label">所属分类</text>
      <picker :range="categories" range-key="name" @change="onCatChange">
        <view class="form-picker">{{ categories[catIndex]?.name || '请选择分类' }}</view>
      </picker>

      <text class="form-label">价格</text>
      <input v-model="form.price" type="digit" placeholder="请输入价格" class="form-input" />

      <text class="form-label">原价</text>
      <input v-model="form.original_price" type="digit" placeholder="请输入原价（可不填）" class="form-input" />

      <text class="form-label">图片地址（每行一个）</text>
      <textarea v-model="imagesText" placeholder="每行一个图片URL" class="form-textarea" />

      <text class="form-label">产品描述</text>
      <textarea v-model="form.description" placeholder="请输入产品描述" class="form-textarea" />

      <text class="form-label">库存</text>
      <input v-model="form.stock" type="number" placeholder="库存数量" class="form-input" />

      <text class="form-label">推荐</text>
      <switch :checked="form.is_recommend === 1" @change="e => form.is_recommend = e.detail.value ? 1 : 0" color="#FF6B81" />

      <button class="btn-save" @click="save">保存</button>
    </view>
  </view>
</template>

<script>
import { getCategories, getProductDetail, saveProduct } from '../../api/index';

export default {
  data() {
    return {
      form: { name: '', category_id: 1, price: '', original_price: '', images: [], description: '', stock: 999, is_recommend: 0 },
      categories: [], catIndex: 0, imagesText: '', editId: null
    };
  },
  async onLoad(options) {
    this.categories = await getCategories();
    if (options.id) {
      const product = await getProductDetail(options.id);
      this.editId = product.id;
      this.form = {
        name: product.name, category_id: product.category_id, price: String(product.price),
        original_price: String(product.original_price), images: product.images,
        description: product.description, stock: product.stock, is_recommend: product.is_recommend
      };
      this.imagesText = product.images.join('\n');
      this.catIndex = this.categories.findIndex(c => c.id === product.category_id);
    }
  },
  methods: {
    onCatChange(e) { this.catIndex = e.detail.value; this.form.category_id = this.categories[this.catIndex].id; },
    async save() {
      if (!this.form.name || !this.form.price) { uni.showToast({ title: '请填写产品名和价格', icon: 'none' }); return; }
      this.form.images = this.imagesText.split('\n').filter(s => s.trim());
      this.form.price = Number(this.form.price);
      this.form.original_price = Number(this.form.original_price) || Number(this.form.price);
      if (this.editId) this.form.id = this.editId;
      await saveProduct(this.form);
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 800);
    }
  }
}
</script>

<style lang="scss" scoped>
.form { padding: 24rpx; }
.form-label { font-size: 28rpx; color: #333; display: block; margin-top: 24rpx; margin-bottom: 12rpx; font-weight: bold; }
.form-input { background: #fff; border-radius: 12rpx; padding: 20rpx; font-size: 28rpx; border: 1rpx solid #E0E0E0; }
.form-picker { background: #fff; border-radius: 12rpx; padding: 20rpx; font-size: 28rpx; border: 1rpx solid #E0E0E0; color: #333; }
.form-textarea { background: #fff; border-radius: 12rpx; padding: 20rpx; font-size: 26rpx; border: 1rpx solid #E0E0E0; min-height: 120rpx; }
.btn-save { background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border-radius: 44rpx; font-size: 30rpx; padding: 20rpx; margin-top: 48rpx; }
</style>
