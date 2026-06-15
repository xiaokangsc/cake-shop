<template>
  <view class="address-page">
    <view class="address-card" v-for="addr in addresses" :key="addr.id" @click="selectAddr(addr)">
      <view class="addr-header flex-between">
        <text class="addr-name">{{ addr.name }} {{ addr.phone }}</text>
        <text class="default-tag" v-if="addr.is_default">默认</text>
      </view>
      <text class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
      <view class="addr-actions">
        <text @click.stop="editAddr(addr)">编辑</text>
        <text @click.stop="delAddr(addr.id)">删除</text>
      </view>
    </view>

    <button class="btn-add" @click="showForm = true; editingAddr = null">+ 添加新地址</button>

    <!-- 编辑/新增弹窗 -->
    <view class="modal" v-if="showForm" @click="showForm = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ editingAddr ? '编辑地址' : '添加地址' }}</text>
        <input v-model="form.name" placeholder="收货人姓名" class="form-input" />
        <input v-model="form.phone" placeholder="手机号" class="form-input" />
        <input v-model="form.province" placeholder="省份" class="form-input" />
        <input v-model="form.city" placeholder="城市" class="form-input" />
        <input v-model="form.district" placeholder="区/县" class="form-input" />
        <input v-model="form.detail" placeholder="详细地址" class="form-input" />
        <label class="form-check"><switch :checked="form.is_default" @change="e => form.is_default = e.detail.value" color="#FF6B81" /> 设为默认地址</label>
        <button class="btn-save" @click="saveAddr">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../api/index';

export default {
  data() {
    return {
      addresses: [], showForm: false, editingAddr: null,
      form: { name: '', phone: '', province: '', city: '', district: '', detail: '', is_default: false },
      selectMode: false
    };
  },
  onLoad(options) { this.selectMode = options.select === '1'; this.loadAddrs(); },
  methods: {
    async loadAddrs() { this.addresses = await getAddresses(); },
    editAddr(addr) {
      this.editingAddr = addr;
      this.form = { name: addr.name, phone: addr.phone, province: addr.province, city: addr.city, district: addr.district, detail: addr.detail, is_default: !!addr.is_default };
      this.showForm = true;
    },
    async delAddr(id) {
      await deleteAddress(id); this.loadAddrs(); uni.showToast({ title: '已删除', icon: 'success' });
    },
    async saveAddr() {
      if (!this.form.name || !this.form.phone || !this.form.detail) {
        uni.showToast({ title: '请填写完整', icon: 'none' }); return;
      }
      if (this.editingAddr) {
        await updateAddress({ id: this.editingAddr.id, ...this.form });
      } else {
        await addAddress(this.form);
      }
      this.showForm = false; this.loadAddrs();
      uni.showToast({ title: '保存成功', icon: 'success' });
    },
    selectAddr(addr) {
      if (this.selectMode) {
        // 简化: 设置默认后返回
        updateAddress({ id: addr.id, ...addr, is_default: true }).then(() => {
          uni.navigateBack();
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.address-page { padding: 20rpx 24rpx 120rpx; }
.address-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; }
.default-tag { background: #FFF5F5; color: #FF6B81; font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 8rpx; }
.addr-detail { font-size: 26rpx; color: #666; display: block; margin: 8rpx 0; }
.addr-actions { display: flex; justify-content: flex-end; gap: 24rpx; font-size: 24rpx; color: #2196F3; }

.btn-add { background: #fff; color: #FF6B81; border: 2rpx dashed #FF6B81; border-radius: 16rpx; font-size: 28rpx; margin: 24rpx 0; }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 200; }
.modal-content { background: #fff; border-radius: 32rpx 32rpx 0 0; padding: 40rpx 32rpx; width: 100%; max-height: 80vh; overflow-y: auto; padding-bottom: calc(40rpx + env(safe-area-inset-bottom)); }
.modal-title { font-size: 34rpx; font-weight: bold; display: block; margin-bottom: 32rpx; text-align: center; }
.form-input { background: #F5F5F5; border-radius: 12rpx; padding: 20rpx; margin-bottom: 16rpx; font-size: 28rpx; }
.form-check { display: flex; align-items: center; font-size: 26rpx; color: #666; margin-bottom: 16rpx; }
.btn-save { background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border-radius: 44rpx; font-size: 30rpx; padding: 20rpx 0; margin-top: 24rpx; }
</style>
