<script>
export default {
  onLaunch() {
    console.log('🍰 甜蜜蛋糕坊启动');
    // 检查登录状态
    const token = uni.getStorageSync('token');
    if (!token) {
      this.autoLogin();
    }
  },
  methods: {
    async autoLogin() {
      try {
        const res = await uni.request({
          url: this.$apiBase + '/api/users/login',
          method: 'POST',
          data: {}
        });
        if (res.data.code === 0) {
          uni.setStorageSync('token', res.data.data.token);
          uni.setStorageSync('userInfo', res.data.data.user);
        }
      } catch (e) {
        console.log('自动登录失败，使用游客模式');
      }
    }
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 主题色变量 */
$primary: #FF6B81;
$primary-dark: #E55A6F;
$bg-color: #F8F8F8;
$text-color: #333;
$text-light: #999;
$border-color: #F0F0F0;
$white: #FFFFFF;

/* 通用工具类 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 价格样式 */
.price { color: #FF6B81; font-weight: bold; }
.price::before { content: '¥'; font-size: 0.7em; }
.original-price { color: #999; text-decoration: line-through; font-size: 0.85em; margin-left: 8px; }
.original-price::before { content: '¥'; }

/* 按钮 */
.btn-primary { background: linear-gradient(135deg, #FF6B81, #FF8E9E); color: #fff; border: none; border-radius: 44px; padding: 12px 32px; font-size: 16px; }
.btn-primary:active { opacity: 0.85; }
.btn-outline { background: #fff; color: #FF6B81; border: 2px solid #FF6B81; border-radius: 44px; padding: 10px 30px; font-size: 14px; }
</style>
