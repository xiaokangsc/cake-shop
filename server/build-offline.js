const fs = require('fs');
const { initDB, rows } = require('./database/init');

initDB().then(() => {
  const ps = rows(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = 1 ORDER BY p.is_recommend DESC, p.sales DESC`);
  const cats = rows('SELECT * FROM categories ORDER BY sort ASC');
  ps.forEach(p => { p.images = JSON.parse(p.images || '[]'); p.specs = JSON.parse(p.specs || '[]'); });

  const DATA = JSON.stringify({ products: ps, categories: cats });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Cake-甜也（佳妮）</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;background:#faf7f4;max-width:430px;margin:0 auto;min-height:100vh;color:#3d2c2c;padding-bottom:70px}
.top{background:linear-gradient(135deg,#fdf6f2,#faf0eb);padding:14px 16px;text-align:center;font-family:Georgia,serif;font-size:18px;letter-spacing:4px;color:#5C3D3A;position:sticky;top:0;z-index:100;border-bottom:1px solid #E8D5CB}
.banner{width:100%;height:360px;overflow:hidden;background:linear-gradient(135deg,#fdf6f2,#faf0eb)}
.banner-inner{display:flex;height:100%;transition:transform.4s}
.banner-slide{min-width:100%;height:100%}
.banner-slide img{width:100%;height:100%;object-fit:cover}
.cat-scroll{display:flex;gap:8px;padding:12px 16px;overflow-x:auto;scrollbar-width:none;background:linear-gradient(135deg,#fdf6f2,#faf0eb)}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-tag{padding:8px 18px;border-radius:20px;font-size:13px;white-space:nowrap;background:#fff;color:#3d2c2c;border:1px solid #F0E8E4;cursor:pointer;flex-shrink:0}
.cat-tag.active{background:#C8827A;color:#fff;border-color:#C8827A}
.section{padding:16px;padding-bottom:80px}
.section h3{font-size:16px;margin-bottom:12px;color:#5C3D3A;font-family:Georgia,serif}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.card{background:#fff;border-radius:14px;overflow:hidden;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.card-img-wrap{width:100%;height:200px;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative}
.card-img-wrap img{width:100%;height:100%;object-fit:contain}
.card-placeholder{font-size:64px;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.card-info{padding:12px}
.card-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-sold{font-size:10px;color:#9B8E8A;margin:4px 0}
.card-pricerow{display:flex;align-items:baseline;justify-content:space-between}
.card-price{color:#D4655A;font-size:18px;font-weight:700}
.card-btn{display:block;margin-top:8px;background:#C8827A;color:#fff;text-align:center;padding:6px 0;border-radius:20px;font-size:12px;cursor:pointer}
.img-count{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.5);color:#fff;font-size:10px;padding:2px 6px;border-radius:8px}
.detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.detail-panel{background:#fff;width:100%;max-width:430px;border-radius:24px 24px 0 0;max-height:85vh;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom)}
.detail-slider{display:flex;transition:transform.3s}
.detail-slider img{min-width:100%;height:320px;object-fit:contain;background:linear-gradient(135deg,#fdf6f2,#faf0eb)}
.detail-info{padding:20px}
.detail-name{font-size:20px;font-weight:700}
.detail-desc{font-size:13px;color:#9B8E8A;margin:8px 0;line-height:1.5}
.detail-pricerow{display:flex;align-items:baseline;gap:10px;margin:12px 0}
.detail-price{color:#D4655A;font-size:24px;font-weight:700}
.specs{margin:16px 0}.spec-group{margin-bottom:12px}.spec-label{font-size:13px;font-weight:600;margin-bottom:8px;display:block}
.spec-options{display:flex;flex-wrap:wrap;gap:8px}
.spec-opt{padding:8px 18px;border-radius:20px;font-size:13px;background:#fff;border:1px solid #F0E8E4;cursor:pointer}
.spec-opt.active{background:#C8827A;color:#fff;border-color:#C8827A}
.qty-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0}
.qty-btn{width:32px;height:32px;border-radius:50%;border:1px solid #F0E8E4;background:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.qty-num{font-size:16px;font-weight:600;width:30px;text-align:center}
.detail-btns{display:flex;gap:10px;margin-top:20px}
.btn-cart{flex:1;background:#C8827A;color:#fff;border:none;padding:12px;border-radius:24px;font-size:14px;cursor:pointer}
.btn-close{flex:1;background:#f5f5f5;color:#666;border:none;padding:12px;border-radius:24px;font-size:14px;cursor:pointer}
.tabs{position:fixed;bottom:0;left:0;right:0;max-width:430px;margin:0 auto;background:#fff;display:flex;border-top:1px solid #F0E8E4;padding-bottom:env(safe-area-inset-bottom);z-index:150}
.tab{flex:1;text-align:center;padding:6px 0;cursor:pointer;font-size:10px;color:#9B8E8A}
.tab.active{color:#C8827A}
.tab svg{display:block;margin:0 auto 2px}
.toast{position:fixed;top:45%;left:50%;transform:translate(-50%,-50%);background:rgba(60,44,44,.85);color:#fff;padding:10px 22px;border-radius:10px;font-size:14px;z-index:999;pointer-events:none;opacity:0;transition:opacity.25s}
.toast.show{opacity:1}
</style>
</head>
<body>
<div class="banner"><div class="banner-inner" id="bannerInner"></div></div>
<div class="cat-scroll" id="catTags"></div>
<div class="section"><h3>全部产品</h3><div class="grid" id="grid">加载中...</div></div>
<div class="tabs">
<div class="tab active" id="tbHome" onclick="goHomeTab()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>首页</div>
<div class="tab" id="tbCat" onclick="showMenuPage()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>点单</div>
<div class="tab" id="tbPoints" onclick="showPointsPage()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7"/><polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="15"/></svg>积分</div>
<div class="tab" id="tbCart" onclick="showCartPage()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>购物车(<span id="cartBadge">0</span>)</div>
<div class="tab" id="tbUser" onclick="showMyPage()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>我的</div>
</div>
<div class="toast" id="toast"></div>
<div id="detailBox"></div>
<script>
var DATA = ${DATA};
var IMG_BASE = (location.protocol === "file:" ? "../src/static/images" : (location.hostname === "localhost"||location.hostname==="127.0.0.1"||location.hostname==="192.168.1.4") ? "/static/images" : "images");
var detailIdx = 0, detailCnt = 0;
var cart = [];
var catIcons = {"生日蛋糕":"🎂","慕斯蛋糕":"🍰","芝士蛋糕":"🧀","千层蛋糕":"🥞","杯子蛋糕":"🧁","定制蛋糕":"🎨"};
function ci(n){return catIcons[n]||"🍰"}
function t(msg){var e=document.getElementById("toast");e.textContent=msg;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},1500)}
var gradColors = ["#fde8e0","#fef3e4","#f5e8f0","#e8f0e8","#fef0e8","#fce4e4","#fff0e0","#f0e8f4","#e8f4f0","#fee8e0","#f8f0e8","#f0e4e8","#fdf4e8"];
function getImgSrc(img){if(!img)return"";return IMG_BASE+"/douyin/"+img.split("/").pop()}

// Banner
var banners = ["banner1.png","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"];
document.getElementById("bannerInner").innerHTML = banners.map(function(b){return '<div class="banner-slide"><img src="'+IMG_BASE+'/banners/'+b+'" alt=""></div>'}).join("");
var bi = 0;
setInterval(function(){bi=(bi+1)%banners.length;document.getElementById("bannerInner").style.transform="translateX(-"+bi+"00%)"},3500);

// Categories
var activeCat = 0;
function renderCats(){
  var h = '<span class="cat-tag active" onclick="filterCat(0,this)">全部</span>';
  DATA.categories.forEach(function(c){h += '<span class="cat-tag" onclick="filterCat('+c.id+',this)">'+c.name+'</span>'});
  document.getElementById("catTags").innerHTML = h;
}
function filterCat(id,el){
  activeCat = id;
  document.querySelectorAll(".cat-tag").forEach(function(t){t.classList.remove("active")});
  if(el) el.classList.add("active");
  renderProds(id===0 ? DATA.products : DATA.products.filter(function(p){return p.category_id===id}));
}

// Products
function renderProds(list){
  var h = "";
  list.forEach(function(p,i){
    var imgs = p.images || [];
    var bg = gradColors[i % gradColors.length];
    h += '<div class="card" onclick="showDetail('+p.id+')"><div class="card-img-wrap" style="background:'+bg+'">';
    if(imgs.length === 0){
      h += '<div class="card-placeholder">'+ci(p.category_name)+'</div>';
    } else {
      h += '<img src="'+getImgSrc(imgs[0])+'" alt="'+p.name+'" style="width:100%;height:100%;object-fit:contain">';
      if(imgs.length > 1) h += '<span class="img-count">1/'+imgs.length+'</span>';
    }
    h += '</div><div class="card-info"><div class="card-name">'+p.name+'</div><div class="card-sold">已售 '+p.sales+'</div><div class="card-pricerow"><span class="card-price">¥'+p.price+'</span>';
    if(p.original_price > p.price) h += '<span style="color:#C0B0AA;text-decoration:line-through;font-size:11px">¥'+p.original_price+'</span>';
    h += '</div><div class="card-btn" onclick="event.stopPropagation();quickBuy('+p.id+')">立即购买</div></div></div>';
  });
  document.getElementById("grid").innerHTML = h || '<div style="text-align:center;padding:40px;color:#9B8E8A">暂无产品</div>';
}

// Detail
var curProd = null, qty = 1, specs = {};
function showDetail(id){
  curProd = DATA.products.find(function(p){return p.id===id}); if(!curProd) return;
  qty = 1; specs = {}; detailIdx = 0;
  var sh = "";
  curProd.specs.forEach(function(s){
    sh += '<div class="spec-group"><div class="spec-label">'+s.name+'</div><div class="spec-options">';
    s.values.forEach(function(v,i){
      if(!specs[s.name] && i===0) specs[s.name] = v;
      sh += '<span class="spec-opt'+(i===0?" active":"")+'" onclick="pickSpec(this)">'+v+'</span>';
    });
    sh += '</div></div>';
  });
  var imgs = curProd.images || []; detailCnt = imgs.length;
  var h = '<div class="detail-overlay" id="detailOverlay" onclick="closeDetail()"><div class="detail-panel" onclick="event.stopPropagation()">';
  if(imgs.length === 0){
    h += '<div style="height:320px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fdf6f2,#faf0eb);font-size:80px">'+ci(curProd.category_name)+'</div>';
  } else {
    h += '<div style="position:relative;overflow:hidden"><div class="detail-slider" id="detailSlider">';
    imgs.forEach(function(img){h += '<img src="'+getImgSrc(img)+'" alt="'+curProd.name+'">'});
    h += '</div>';
    if(imgs.length > 1){
      h += '<div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px" id="detailDots">';
      imgs.forEach(function(_,j){h += '<div style="width:6px;height:6px;border-radius:50%;background:'+(j===0?"#C8827A":"rgba(200,130,122,0.3)")+'"></div>'});
      h += '</div>';
      h += '<div onclick="slideD(-1)" style="position:absolute;top:50%;left:8px;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.3);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;z-index:10">◀</div>';
      h += '<div onclick="slideD(1)" style="position:absolute;top:50%;right:8px;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.3);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;z-index:10">▶</div>';
    }
    h += '</div>';
  }
  h += '<div class="detail-info"><div class="detail-name">'+curProd.name+'</div><div class="detail-desc">'+curProd.description+'</div>';
  h += '<div class="detail-pricerow"><span class="detail-price">¥'+curProd.price+'</span>';
  if(curProd.original_price > curProd.price) h += '<span style="color:#9B8E8A;text-decoration:line-through;font-size:13px">¥'+curProd.original_price+'</span>';
  h += '<span style="margin-left:auto;font-size:11px;color:#9B8E8A">已售'+curProd.sales+'</span></div><div class="specs">'+sh+'</div>';
  h += '<div class="qty-row"><span style="font-weight:600">数量</span><div style="display:flex;align-items:center;gap:16px"><span class="qty-btn" onclick="chgQty(-1)">-</span><span class="qty-num" id="qtyDisp">1</span><span class="qty-btn" onclick="chgQty(1)">+</span></div></div>';
  h += '<div class="detail-btns"><button class="btn-close" onclick="closeDetail()">关闭</button><button class="btn-cart" onclick="addToCart()">加入购物车</button></div></div></div></div>';
  document.getElementById("detailBox").innerHTML = h;
}
function slideD(dir){
  detailIdx = (detailIdx + dir + detailCnt) % detailCnt;
  var s = document.getElementById("detailSlider"); if(s) s.style.transform = "translateX(-"+detailIdx+"00%)";
  var dots = document.querySelectorAll("#detailDots div"); dots.forEach(function(d,i){d.style.background = i===detailIdx ? "#C8827A" : "rgba(200,130,122,0.3)"});
}
function pickSpec(el){
  var p = el.parentElement;
  p.querySelectorAll(".spec-opt").forEach(function(s){s.classList.remove("active")});
  el.classList.add("active");
  var key = el.parentElement.previousElementSibling.textContent;
  specs[key] = el.textContent;
}
function chgQty(n){qty = Math.max(1, Math.min(99, qty+n)); document.getElementById("qtyDisp").textContent = qty}
function closeDetail(){document.getElementById("detailBox").innerHTML = ""}
function addToCart(){
  var spec = Object.values(specs).join("/");
  var exist = cart.find(function(c){return c.id===curProd.id && c.spec===spec});
  if(exist){exist.qty += qty} else {cart.push({id:curProd.id, name:curProd.name, price:curProd.price, spec:spec, qty:qty})}
  updateBadge(); closeDetail(); t("已加入购物车");
}
function quickBuy(pid){
  var p = DATA.products.find(function(x){return x.id===pid}); if(!p) return;
  var exist = cart.find(function(c){return c.id===pid && c.spec===""});
  if(exist){exist.qty += 1} else {cart.push({id:pid, name:p.name, price:p.price, spec:"", qty:1})}
  updateBadge(); t("已加入购物车");
}
function updateBadge(){document.getElementById("cartBadge").textContent = cart.reduce(function(s,c){return s+c.qty},0)}

// Cart Tab
var showCart = false;
function showCartTab(){
  showCart = !showCart;
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active")});
  if(showCart){
    document.getElementById("tbCart").classList.add("active");
    document.querySelector(".section h3").textContent = "购物车";
    var h = "";
    if(cart.length === 0){h = '<div style="text-align:center;padding:60px;color:#9B8E8A">购物车是空的</div>'}
    else {
      var total = 0;
      cart.forEach(function(c,i){
        total += c.price * c.qty;
        h += '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:600;font-size:14px">'+c.name+'</div><div style="font-size:11px;color:#9B8E8A">'+c.spec+'</div><span style="color:#D4655A;font-weight:700">¥'+(c.price*c.qty).toFixed(2)+'</span></div><div style="display:flex;align-items:center;gap:8px"><span class="qty-btn" style="width:24px;height:24px;font-size:12px" onclick="cartChg('+i+',-1)">-</span><span>'+c.qty+'</span><span class="qty-btn" style="width:24px;height:24px;font-size:12px" onclick="cartChg('+i+',1)">+</span></div></div>';
      });
      h += '<div style="text-align:right;padding:12px;font-size:16px">合计 <span style="color:#D4655A;font-weight:700;font-size:20px">¥'+total.toFixed(2)+'</span></div>';
    }
    document.getElementById("grid").innerHTML = h;
  } else { goHomeTab() }
}
var curPage = "home";
function cartChg(i,n){cart[i].qty += n; if(cart[i].qty <= 0) cart.splice(i,1); updateBadge(); showCartPage();}
function switchTab(tabId){
  document.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active")});
  var el = document.getElementById("tb" + tabId); if(el) el.classList.add("active");
  document.getElementById("grid").style.gridTemplateColumns = "";
  document.getElementById("grid").style.display = "";
}
function goHomeTab(){
  curPage = "home"; switchTab("Home");
  document.querySelector(".section h3").textContent = "全部产品";
  document.getElementById("catTags").style.display = "";
  document.getElementById("bannerInner").parentElement.style.display = "";
  renderProds(activeCat===0 ? DATA.products : DATA.products.filter(function(p){return p.category_id===activeCat}));
}

// ===== 点单页 =====
function showMenuPage(){
  curPage = "menu"; switchTab("Cat");
  document.querySelector(".section h3").textContent = "点单";
  document.getElementById("catTags").style.display = "";
  document.getElementById("bannerInner").parentElement.style.display = "none";
  document.getElementById("grid").style.gridTemplateColumns = "1fr";
  renderProds(activeCat===0 ? DATA.products : DATA.products.filter(function(p){return p.category_id===activeCat}));
}

// ===== 积分页 =====
var pointsBalance = 268;
var pointItems = [
  {name:"4寸巴斯克芝士蛋糕", points:200, icon:"🎂"},
  {name:"4寸提拉米苏蛋糕", points:350, icon:"🍫"},
  {name:"4寸海盐奥利奥蛋糕", points:300, icon:"🍪"},
  {name:"生椰拿铁+豆乳双拼", points:500, icon:"🥥"},
  {name:"4寸蛋糕全家福6选4", points:800, icon:"🎁"},
  {name:"满50减10元优惠券", points:150, icon:"🎫"}
];
function showPointsPage(){
  curPage = "points"; switchTab("Points");
  document.querySelector(".section h3").textContent = "积分兑换";
  document.getElementById("catTags").style.display = "none";
  document.getElementById("bannerInner").parentElement.style.display = "none";
  var h = '<div style="background:linear-gradient(135deg,#5C3D3A,#7B5B5A);padding:28px 24px;color:#fff;text-align:center;border-radius:14px;margin-bottom:16px">';
  h += '<div style="font-size:44px;font-weight:300">'+pointsBalance+'</div><div style="font-size:13px;opacity:.8">当前积分</div>';
  h += '<div style="margin-top:10px;background:rgba(255,255,255,.15);border-radius:20px;padding:4px 14px;display:inline-block;font-size:11px">消费¥1 = 1分 · 365天有效</div></div>';
  h += '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:16px;font-size:12px;color:#9B8E8A;line-height:2">📋 积分规则：消费满¥1积1分 | 积分可兑换蛋糕/优惠券 | 不可提现转赠</div>';
  h += '<div style="font-size:14px;font-weight:600;color:#5C3D3A;margin-bottom:10px">可兑换商品</div>';
  h += '<div class="grid">';
  pointItems.forEach(function(item,i){
    h += '<div class="card" onclick="redeemPoints('+i+')"><div class="card-img-wrap" style="background:linear-gradient(135deg,#fdf6f2,#faf0eb)"><div style="font-size:48px">'+item.icon+'</div></div>';
    h += '<div class="card-info"><div class="card-name">'+item.name+'</div><div style="color:#C8827A;font-size:16px;font-weight:700">'+item.points+' 积分</div>';
    h += '<div class="card-btn" style="background:#5C3D3A">立即兑换</div></div></div>';
  });
  h += '</div>';
  document.getElementById("grid").style.gridTemplateColumns = "1fr";
  document.getElementById("grid").innerHTML = h;
}
function redeemPoints(idx){
  var item=pointItems[idx];
  if(pointsBalance < item.points){t("积分不足！需要"+item.points+"分，当前"+pointsBalance+"分");return}
  if(!confirm("确认使用 "+item.points+" 积分兑换「"+item.name+"」？")) return;
  pointsBalance -= item.points;
  t("兑换成功！剩余"+pointsBalance+"积分"); showPointsPage();
}

// ===== 购物车页 =====
function showCartPage(){
  curPage = "cart"; switchTab("Cart");
  document.querySelector(".section h3").textContent = "购物车";
  document.getElementById("catTags").style.display = "none";
  document.getElementById("bannerInner").parentElement.style.display = "none";
  var h = "";
  if(cart.length === 0){
    h = '<div style="text-align:center;padding:80px 0;color:#9B8E8A"><div style="font-size:48px;margin-bottom:12px">🛒</div><div>购物车是空的</div></div>';
  } else {
    var total = 0;
    cart.forEach(function(c,i){
      total += c.price * c.qty;
      h += '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">';
      h += '<div style="flex:1"><div style="font-weight:600;font-size:14px">'+c.name+'</div><div style="font-size:11px;color:#9B8E8A">'+c.spec+'</div><span style="color:#D4655A;font-weight:700">¥'+(c.price*c.qty).toFixed(2)+'</span></div>';
      h += '<div style="display:flex;align-items:center;gap:8px"><span class="qty-btn" style="width:24px;height:24px;font-size:12px" onclick="cartChg('+i+',-1)">-</span><span>'+c.qty+'</span><span class="qty-btn" style="width:24px;height:24px;font-size:12px" onclick="cartChg('+i+',1)">+</span>';
      h += '<span onclick="cartDel('+i+')" style="margin-left:6px;font-size:16px;cursor:pointer;color:#C8827A">🗑</span></div></div>';
    });
    h += '<div style="text-align:right;padding:12px;font-size:16px">合计 <span style="color:#D4655A;font-weight:700;font-size:20px">¥'+total.toFixed(2)+'</span></div>';
    h += '<div style="text-align:center;padding:8px"><span style="color:#9B8E8A;font-size:12px;cursor:pointer" onclick="cartClear()">清空购物车</span></div>';
  }
  document.getElementById("grid").style.gridTemplateColumns = "1fr";
  document.getElementById("grid").innerHTML = h;
}
function cartDel(i){cart.splice(i,1);updateBadge();showCartPage()}
function cartClear(){if(!confirm("确认清空购物车？"))return;cart=[];updateBadge();showCartPage()}

// ===== 我的页 =====
function showMyPage(){
  curPage = "my"; switchTab("User");
  document.querySelector(".section h3").textContent = "我的";
  document.getElementById("catTags").style.display = "none";
  document.getElementById("bannerInner").parentElement.style.display = "none";
  var h = '<div style="text-align:center;padding:30px 16px;background:linear-gradient(180deg,#FDF6F2,#FAF7F4);border-radius:14px;margin-bottom:16px">';
  h += '<div style="width:64px;height:64px;border-radius:50%;background:#fdf6f2;border:2px solid #E8C4B8;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:28px">🍰</div>';
  h += '<div style="font-size:16px;font-weight:600">Cake-甜也（佳妮）</div><div style="font-size:12px;color:#9B8E8A">手作精品蛋糕</div></div>';
  h += '<div style="background:#fff;border-radius:14px;padding:16px;margin-bottom:12px">';
  h += '<div style="font-size:14px;font-weight:600;margin-bottom:12px;color:#5C3D3A">🏪 店铺信息</div>';
  h += '<div style="font-size:13px;line-height:2.2;color:#666"><div>📍 胶州市滨州路祥瑞苑北门东侧</div><div>🕐 营业时间: 8:00-18:00</div><div>📞 <span style="color:#2196F3;cursor:pointer" onclick="callShop()">15192634983</span></div></div></div>';
  h += '<div style="background:#fff;border-radius:14px;overflow:hidden">';
  h += '<div onclick="callShop()" style="padding:14px 16px;border-bottom:1px solid #F0E8E4;font-size:14px;cursor:pointer">📞 联系客服<span style="float:right;color:#C0B0AA">›</span></div>';
  h += '<div style="padding:14px 16px;font-size:14px;cursor:pointer">📋 订单查询<span style="float:right;color:#C0B0AA">›</span></div></div>';
  document.getElementById("grid").style.gridTemplateColumns = "1fr";
  document.getElementById("grid").innerHTML = h;
}
function callShop(){window.location.href="tel:15192634983"}

// Init
renderCats();
renderProds(DATA.products);
</script>
</body>
</html>`;

  fs.writeFileSync('../preview/offline.html', html, 'utf8');
  console.log('OK - ' + ps.length + ' products');
  process.exit(0);
});
