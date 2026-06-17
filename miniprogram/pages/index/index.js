Page({
  data: {
    products: [], displayProducts: [], activeCat: 0, sectionTitle: '全部产品',
    categories: [], banners: ['/images/banners/banner1.jpg', '/images/banners/banner2.jpg', '/images/banners/banner3.jpg', '/images/banners/banner4.jpg', '/images/banners/banner5.jpg']
  },
  onLoad() {
    const imgPool = [
      '/images/douyin/7a497b8a606c4abd36920d428d334ff8.jpg',
      '/images/douyin/15a298c9a08a83447d51d5c3fec0aaec.jpg',
      '/images/douyin/859d4df379c611dae6a110ed10af779a.jpg',
      '/images/douyin/bdb33e3b0c85720336b92f88b1bf12d4.jpg',
      '/images/douyin/be46b2f47aad2f4691ef8d02262b2395.jpg',
      '/images/douyin/2f1f59f8044ac90b6070172895495375.jpg',
      '/images/douyin/毛巾卷12.jpg', '/images/douyin/4寸青提19.9.jpg', '/images/douyin/6寸蛋糕胚10.jpg',
      '/images/douyin/榴莲切块29.jpg', '/images/douyin/6寸五拼盒子38.jpg', '/images/douyin/4寸便当盒子9.9.jpg', '/images/douyin/6寸盒子榴莲千层68.jpg'
    ];
    function img(i) { return imgPool[i % imgPool.length]; }
    const spec = [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约", "自选沟通"] }];
    const specS = [{ name: "款式", values: ["简约水果", "ins风", "复古裱花", "韩式简约"] }];
    const specL = [{ name: "款式", values: ["简约水果", "ins风", "复古裱花"] }];

    const products = [
      // 动物奶油蛋糕
      { id: 1, name: "4寸动物奶油蛋糕", price: 68, orig: 88, category: "动物奶油蛋糕", sales: 22, img: img(0), desc: "4寸动物奶油蛋糕，适合1-2人", specs: spec },
      { id: 2, name: "6寸动物奶油蛋糕", price: 98, orig: 128, category: "动物奶油蛋糕", sales: 18, img: img(1), desc: "6寸动物奶油蛋糕，适合3-5人", specs: spec },
      { id: 3, name: "8寸动物奶油蛋糕", price: 128, orig: 168, category: "动物奶油蛋糕", sales: 15, img: img(2), desc: "8寸动物奶油蛋糕，适合6-8人", specs: spec },
      { id: 4, name: "10寸动物奶油蛋糕", price: 168, orig: 218, category: "动物奶油蛋糕", sales: 10, img: img(3), desc: "10寸动物奶油蛋糕，适合9-12人", specs: spec },
      { id: 5, name: "12寸动物奶油蛋糕", price: 218, orig: 278, category: "动物奶油蛋糕", sales: 6, img: img(4), desc: "12寸动物奶油蛋糕，适合13-16人", specs: spec },
      { id: 6, name: "8+6动物奶油蛋糕", price: 198, orig: 258, category: "动物奶油蛋糕", sales: 8, img: img(5), desc: "双层8+6寸动物奶油，适合10-14人", specs: specS },
      { id: 7, name: "10+6动物奶油蛋糕", price: 268, orig: 338, category: "动物奶油蛋糕", sales: 5, img: img(0), desc: "双层10+6寸动物奶油，适合14-18人", specs: specS },
      { id: 8, name: "10+8动物奶油蛋糕", price: 298, orig: 378, category: "动物奶油蛋糕", sales: 4, img: img(1), desc: "双层10+8寸动物奶油，适合16-22人", specs: specL },
      { id: 9, name: "12+8动物奶油蛋糕", price: 338, orig: 428, category: "动物奶油蛋糕", sales: 3, img: img(2), desc: "双层12+8寸动物奶油，适合20-28人", specs: specL },
      { id: 10, name: "6+4动物奶油蛋糕", price: 138, orig: 178, category: "动物奶油蛋糕", sales: 12, img: img(3), desc: "双层6+4寸动物奶油，适合5-7人", specs: specS },
      // 乳脂奶油
      { id: 11, name: "6寸乳脂奶油蛋糕", price: 68, orig: 88, category: "乳脂奶油", sales: 14, img: img(4), desc: "6寸乳脂奶油蛋糕，口感更浓郁", specs: specS },
      { id: 12, name: "8寸乳脂奶油蛋糕", price: 88, orig: 118, category: "乳脂奶油", sales: 12, img: img(5), desc: "8寸乳脂奶油蛋糕", specs: specS },
      { id: 13, name: "10寸乳脂奶油蛋糕", price: 128, orig: 168, category: "乳脂奶油", sales: 8, img: img(0), desc: "10寸乳脂奶油蛋糕", specs: specS },
      { id: 14, name: "12寸乳脂奶油蛋糕", price: 158, orig: 208, category: "乳脂奶油", sales: 5, img: img(1), desc: "12寸乳脂奶油蛋糕", specs: specL },
      { id: 15, name: "14寸乳脂奶油蛋糕", price: 188, orig: 248, category: "乳脂奶油", sales: 3, img: img(2), desc: "14寸乳脂奶油蛋糕，大型聚会首选", specs: specL },
      { id: 16, name: "8+6乳脂奶油蛋糕", price: 138, orig: 178, category: "乳脂奶油", sales: 7, img: img(3), desc: "双层8+6乳脂奶油", specs: specS },
      { id: 17, name: "10+6乳脂奶油蛋糕", price: 168, orig: 218, category: "乳脂奶油", sales: 5, img: img(4), desc: "双层10+6乳脂奶油", specs: specS },
      { id: 18, name: "10+8乳脂奶油蛋糕", price: 198, orig: 258, category: "乳脂奶油", sales: 4, img: img(5), desc: "双层10+8乳脂奶油", specs: specL },
      { id: 19, name: "12+8乳脂奶油蛋糕", price: 228, orig: 298, category: "乳脂奶油", sales: 3, img: img(0), desc: "双层12+8乳脂奶油", specs: specL },
      // 榴莲千层
      { id: 20, name: "6寸榴莲千层(动物奶油)", price: 188, orig: 228, category: "榴莲千层", sales: 9, img: img(1), desc: "6寸榴莲千层，进口猫山王榴莲+动物奶油", specs: [] },
      { id: 21, name: "8寸榴莲千层(动物奶油)", price: 228, orig: 288, category: "榴莲千层", sales: 7, img: img(2), desc: "8寸榴莲千层，进口猫山王榴莲+动物奶油", specs: [] },
      { id: 22, name: "10寸榴莲千层(动物奶油)", price: 288, orig: 358, category: "榴莲千层", sales: 4, img: img(3), desc: "10寸榴莲千层，进口猫山王榴莲+动物奶油", specs: [] },
      // 精品蛋糕
      { id: 23, name: "八+六寸动物奶油蛋糕（自选简单款式）", price: 189, orig: 239, category: "精品蛋糕", sales: 25, img: img(4), desc: "双层动物奶油，8+6寸组合，适合6-10人", specs: spec },
      { id: 24, name: "八寸纯动物奶油蛋糕（自选简单款式）", price: 119, orig: 159, category: "精品蛋糕", sales: 18, img: img(5), desc: "8寸纯动物奶油蛋糕，适合4-6人", specs: spec },
      { id: 25, name: "六寸纯动物奶油蛋糕（自选简单款式）", price: 79, orig: 109, category: "精品蛋糕", sales: 12, img: img(0), desc: "6寸纯动物奶油蛋糕，适合2-4人", specs: spec },
      // 甜品系列
      { id: 26, name: "毛巾卷", price: 12, orig: 18, category: "甜品系列", sales: 8, img: img(6), desc: "超软毛巾卷蛋糕，一口一个满足", specs: [] },
      { id: 27, name: "4寸青提蛋糕", price: 19.9, orig: 29.9, category: "甜品系列", sales: 5, img: img(7), desc: "新鲜青提搭配轻盈奶油", specs: [] },
      { id: 28, name: "6寸蛋糕胚", price: 10, orig: 15, category: "甜品系列", sales: 20, img: img(8), desc: "6寸纯动物奶油蛋糕胚", specs: [] },
      { id: 29, name: "榴莲切块", price: 29, orig: 39, category: "甜品系列", sales: 15, img: img(9), desc: "猫山王榴莲切块", specs: [] },
      { id: 30, name: "6寸五拼盒子", price: 38, orig: 48, category: "甜品系列", sales: 12, img: img(10), desc: "五种口味拼盒", specs: [{ name: "口味", values: ["芒果", "抹茶", "巧克力", "草莓", "原味"] }] },
      { id: 31, name: "4寸便当盒子", price: 9.9, orig: 15, category: "甜品系列", sales: 25, img: img(11), desc: "便当盒蛋糕，下午茶首选", specs: [] },
      { id: 32, name: "6寸盒子榴莲千层", price: 68, orig: 88, category: "甜品系列", sales: 10, img: img(12), desc: "6寸榴莲千层盒装", specs: [] },
      // 面包系列
      { id: 33, name: "北海道吐司", price: 18, orig: 25, category: "面包系列", sales: 20, img: img(0), desc: "日式北海道吐司，柔软拉丝，奶香浓郁", specs: [] },
      { id: 34, name: "蒜香法棍", price: 12, orig: 18, category: "面包系列", sales: 15, img: img(1), desc: "法式蒜香法棍，外酥内软", specs: [] },
      { id: 35, name: "牛角可颂", price: 15, orig: 22, category: "面包系列", sales: 18, img: img(2), desc: "法式牛角可颂，层层酥脆", specs: [] },
      { id: 36, name: "全麦欧包", price: 22, orig: 32, category: "面包系列", sales: 12, img: img(3), desc: "全麦欧包，健康低脂", specs: [] },
      // 点心系列
      { id: 37, name: "蛋挞(4个装)", price: 6, orig: 10, category: "点心系列", sales: 30, img: img(4), desc: "经典葡式蛋挞，酥脆香甜", specs: [] },
      { id: 38, name: "蝴蝶酥", price: 10, orig: 15, category: "点心系列", sales: 22, img: img(5), desc: "法式蝴蝶酥，层层酥脆", specs: [] },
      { id: 39, name: "奶油泡芙(6个)", price: 12, orig: 18, category: "点心系列", sales: 18, img: img(0), desc: "鲜奶油泡芙，一口爆浆", specs: [] },
      { id: 40, name: "蛋黄酥(4个)", price: 15, orig: 22, category: "点心系列", sales: 25, img: img(1), desc: "手工蛋黄酥，咸蛋黄+红豆沙", specs: [] }
    ];

    this.setData({
      products, displayProducts: products, activeCat: 0, sectionTitle: '全部产品',
      categories: [
        { id: 1, name: '动物奶油蛋糕' }, { id: 2, name: '乳脂奶油' }, { id: 3, name: '榴莲千层' },
        { id: 4, name: '精品蛋糕' }, { id: 5, name: '甜品系列' }, { id: 6, name: '面包系列' }, { id: 7, name: '点心系列' }
      ]
    });
  },
  filterCat(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products;
    const catMap = { 1: '动物奶油蛋糕', 2: '乳脂奶油', 3: '榴莲千层', 4: '精品蛋糕', 5: '甜品系列', 6: '面包系列', 7: '点心系列' };
    this.setData({ activeCat: id, sectionTitle: id == 0 ? '全部产品' : catMap[id] });
    this.setData({ displayProducts: id == 0 ? products : products.filter(p => p.category === catMap[id]) });
  },
  onCall() { wx.makePhoneCall({ phoneNumber: '15192634983' }); },
  onDetail(e) {
    const product = this.data.products.find(p => p.id === e.currentTarget.dataset.id);
    if (product) {
      const specs = (product.specs || []).map(s => s.name + '：' + s.values.join('/')).join('\n') || '多种规格可选';
      wx.showModal({
        title: product.name, confirmText: '📞 电话咨询', cancelText: '关闭',
        content: product.desc + '\n\n💰 参考价：¥' + product.price + '\n📋 规格：' + specs + '\n📦 已售：' + product.sales + '份\n\n具体价格请电话咨询',
        success(res) { if (res.confirm) wx.makePhoneCall({ phoneNumber: '15192634983' }); }
      });
    }
  }
});
