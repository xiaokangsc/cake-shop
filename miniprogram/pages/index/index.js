Page({
  data: {
    products: [],
    displayProducts: [],
    activeCat: 0,
    categories: [],
    banners: ['/images/banners/banner1.jpg', '/images/banners/banner2.jpg', '/images/banners/banner3.jpg', '/images/banners/banner4.jpg', '/images/banners/banner5.jpg'],
    currentBanner: 0
  },
  onLoad() {
    this.loadProducts();
  },
  loadProducts() {
    // 可用的产品图片（循环使用）
    const imgPool = [
      '/images/douyin/7a497b8a606c4abd36920d428d334ff8.jpg',
      '/images/douyin/15a298c9a08a83447d51d5c3fec0aaec.jpg',
      '/images/douyin/859d4df379c611dae6a110ed10af779a.jpg',
      '/images/douyin/bdb33e3b0c85720336b92f88b1bf12d4.jpg',
      '/images/douyin/be46b2f47aad2f4691ef8d02262b2395.jpg',
      '/images/douyin/2f1f59f8044ac90b6070172895495375.jpg'
    ];
    const products = [
      // === 🆕 切块甜品 ===
      { id: 17, name: "毛巾卷", price: 12, orig: 18, category: "切块甜品", sales: 8, img: '/images/douyin/毛巾卷12.jpg', desc: "超软毛巾卷蛋糕，一口一个满足", specs: [] },
      { id: 20, name: "榴莲切块", price: 29, orig: 39, category: "切块甜品", sales: 15, img: '/images/douyin/榴莲切块29.jpg', desc: "猫山王榴莲切块，榴莲控必入", specs: [] },
      // === 🆕 超值盒子 ===
      { id: 18, name: "4寸青提蛋糕", price: 19.9, orig: 29.9, category: "超值盒子", sales: 5, img: '/images/douyin/4寸青提19.9.jpg', desc: "新鲜青提搭配轻盈奶油，清新爽口", specs: [] },
      { id: 19, name: "6寸蛋糕胚", price: 10, orig: 15, category: "超值盒子", sales: 20, img: '/images/douyin/6寸蛋糕胚10.jpg', desc: "6寸纯动物奶油蛋糕胚，可DIY装饰", specs: [] },
      { id: 21, name: "6寸五拼盒子", price: 38, orig: 48, category: "超值盒子", sales: 12, img: '/images/douyin/6寸五拼盒子38.jpg', desc: "五种口味拼盒，一次尝遍", specs: [{ name: "口味", values: ["芒果", "抹茶", "巧克力", "草莓", "原味"] }] },
      { id: 22, name: "4寸便当盒子", price: 9.9, orig: 15, category: "超值盒子", sales: 25, img: '/images/douyin/4寸便当盒子9.9.jpg', desc: "便当盒蛋糕，方便携带，下午茶首选", specs: [] },
      { id: 23, name: "6寸盒子榴莲千层", price: 68, orig: 88, category: "超值盒子", sales: 10, img: '/images/douyin/6寸盒子榴莲千层68.jpg', desc: "6寸榴莲千层盒装，层层榴莲香", specs: [] },
      // === 迷你蛋糕 ===
      { id: 1, name: "四寸巴斯克", price: 59, orig: 79, category: "迷你蛋糕", sales: 30, img: imgPool[3], desc: "经典巴斯克烤芝士蛋糕，焦香外皮、丝滑内心", specs: [] },
      { id: 2, name: "四寸纯动物奶油蛋糕（自选简单款式）", price: 59, orig: 79, category: "迷你蛋糕", sales: 15, img: imgPool[4], desc: "4寸动物奶油蛋糕，适合1-2人", specs: [{ name: "款式", values: ["简约水果", "ins风", "韩式简约"] }] },
      { id: 3, name: "四寸豆乳蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 22, img: imgPool[0], desc: "日式豆乳风味，豆香浓郁，口感轻盈绵密", specs: [] },
      { id: 4, name: "四寸芋泥肉松蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 28, img: imgPool[1], desc: "芋泥+肉松+麻薯三层组合，咸甜交织", specs: [] },
      { id: 5, name: "四寸提拉米苏", price: 59, orig: 79, category: "迷你蛋糕", sales: 35, img: imgPool[5], desc: "经典意式提拉米苏，咖啡+可可+马斯卡彭", specs: [] },
      { id: 6, name: "四寸海盐奥利奥蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 18, img: imgPool[2], desc: "奥利奥碎+海盐芝士，咸甜奶香", specs: [] },
      { id: 7, name: "四寸芒果慕斯", price: 59, orig: 79, category: "迷你蛋糕", sales: 25, img: imgPool[3], desc: "新鲜芒果泥混合轻盈慕斯，酸甜清新", specs: [] },
      { id: 8, name: "四寸双莓蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 16, img: imgPool[4], desc: "蓝莓+草莓双重莓果，酸甜清新", specs: [] },
      { id: 9, name: "四寸生椰拿铁蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 13, img: imgPool[0], desc: "生椰+拿铁双层慕斯，咖啡与椰香融合", specs: [] },
      { id: 10, name: "四寸白桃乌龙蛋糕", price: 59, orig: 79, category: "迷你蛋糕", sales: 11, img: imgPool[1], desc: "白桃果肉+乌龙茶香，清新不腻", specs: [] },
      // === 精品蛋糕 ===
      { id: 11, name: "五寸纯动物奶油蛋糕（自选简单款式）", price: 69, orig: 89, category: "精品蛋糕", sales: 10, img: imgPool[2], desc: "5寸动物奶油蛋糕", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花"] }] },
      { id: 12, name: "六寸纯动物奶油蛋糕（自选简单款式）", price: 79, orig: 109, category: "精品蛋糕", sales: 12, img: imgPool[5], desc: "6寸纯动物奶油蛋糕，适合2-4人", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约", "自选沟通"] }] },
      { id: 13, name: "八寸纯动物奶油蛋糕（自选简单款式）", price: 119, orig: 159, category: "精品蛋糕", sales: 18, img: imgPool[3], desc: "8寸纯动物奶油蛋糕，适合4-6人", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约", "自选沟通"] }] },
      { id: 14, name: "八+六寸动物奶油蛋糕（自选简单款式）", price: 189, orig: 239, category: "精品蛋糕", sales: 25, img: imgPool[4], desc: "双层动物奶油蛋糕，8寸+6寸组合，适合6-10人", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约", "自选沟通"] }] },
      { id: 15, name: "十寸纯动物奶油蛋糕（自选简单款式）", price: 159, orig: 199, category: "精品蛋糕", sales: 8, img: imgPool[0], desc: "10寸动物奶油蛋糕，适合8-12人", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约"] }] },
      { id: 16, name: "十二寸纯动物奶油蛋糕（自选简单款式）", price: 219, orig: 269, category: "精品蛋糕", sales: 5, img: imgPool[1], desc: "12寸动物奶油蛋糕，适合12-16人", specs: [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约", "自选沟通"] }] }
    ];
    this.setData({
      products,
      displayProducts: products,
      activeCat: 0,
      categories: [
        { id: 1, name: '精品蛋糕' },
        { id: 2, name: '迷你蛋糕' },
        { id: 3, name: '切块甜品' },
        { id: 4, name: '超值盒子' }
      ]
    });
  },
  filterCat(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products;
    // toggle active
    this.setData({ activeCat: id });
    if (id == 0) {
      this.setData({ displayProducts: products });
    } else {
      const catMap = { 1: '精品蛋糕', 2: '迷你蛋糕', 3: '切块甜品', 4: '超值盒子' };
      this.setData({ displayProducts: products.filter(p => p.category === catMap[id]) });
    }
  },
  onCall() {
    wx.makePhoneCall({ phoneNumber: '15192634983' });
  },
  onBuy(e) {
    const id = e.currentTarget.dataset.id;
    wx.makePhoneCall({ phoneNumber: '15192634983' });
  },
  onDetail(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.products.find(p => p.id === id);
    if (product) {
      const specs = (product.specs || []).map(s => s.name + '：' + s.values.join('/')).join('\n') || '多种规格可选';
      wx.showModal({
        title: product.name,
        content: product.desc + '\n\n💰 参考价：¥' + product.price + '\n📋 规格：' + specs + '\n📦 已售：' + product.sales + '份\n\n具体价格请电话咨询',
        confirmText: '📞 电话咨询',
        cancelText: '关闭',
        cancelText: '关闭',
        success(res) {
          if (res.confirm) wx.makePhoneCall({ phoneNumber: '15192634983' });
        }
      });
    }
  }
});
