const express = require('express');
const router = express.Router();
const { get, rows, run, save } = require('../database/init');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/info', (req, res) => {
  const info = get('SELECT * FROM shop_info WHERE id = 1') || {};
  res.json({ code: 0, data: info });
});

router.get('/banners', (req, res) => {
  const banners = rows('SELECT * FROM banners WHERE status = 1 ORDER BY sort ASC');
  res.json({ code: 0, data: banners });
});

// 更新店铺
router.post('/admin/update', auth, adminAuth, (req, res) => {
  const { name, phone, address, business_hours, notice, delivery_fee, min_order } = req.body;
  run('UPDATE shop_info SET name=?, phone=?, address=?, business_hours=?, notice=?, delivery_fee=?, min_order=? WHERE id=1',
    [name, phone, address, business_hours, notice, delivery_fee, min_order]);
  save();
  res.json({ code: 0, msg: '更新成功' });
});

// 产品管理
router.get('/admin/products', auth, adminAuth, (req, res) => {
  const list = rows(
    `SELECT p.*, c.name as category_name FROM products p
     LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC`
  );
  res.json({ code: 0, data: list });
});

router.post('/admin/product/save', auth, adminAuth, (req, res) => {
  const { id, name, category_id, price, original_price, images, description, specs, stock, status, is_recommend } = req.body;
  const imgStr = JSON.stringify(images || []);
  const specStr = JSON.stringify(specs || []);

  if (id) {
    run(`UPDATE products SET name=?, category_id=?, price=?, original_price=?, images=?, description=?, specs=?, stock=?, status=?, is_recommend=? WHERE id=?`,
      [name, category_id, price, original_price, imgStr, description, specStr, stock, status || 1, is_recommend || 0, id]);
  } else {
    run(`INSERT INTO products (name, category_id, price, original_price, images, description, specs, stock, status, is_recommend) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [name, category_id, price, original_price, imgStr, description, specStr, stock, status || 1, is_recommend || 0]);
  }
  save();
  res.json({ code: 0, msg: id ? '更新成功' : '添加成功' });
});

router.post('/admin/product/delete', auth, adminAuth, (req, res) => {
  run('DELETE FROM products WHERE id = ?', [req.body.id]);
  save();
  res.json({ code: 0, msg: '已删除' });
});

router.post('/admin/product/status', auth, adminAuth, (req, res) => {
  run('UPDATE products SET status = ? WHERE id = ?', [req.body.status, req.body.id]);
  save();
  res.json({ code: 0, msg: '状态已更新' });
});

// 数据概览
router.get('/admin/dashboard', auth, adminAuth, (req, res) => {
  const orderTotal = get("SELECT COUNT(*) as count, COALESCE(SUM(pay_amount),0) as amount FROM orders WHERE status != 'cancelled'") || {};
  const todayOrders = get("SELECT COUNT(*) as count, COALESCE(SUM(pay_amount),0) as amount FROM orders WHERE date(created_at) = date('now')") || {};
  const productCount = get('SELECT COUNT(*) as count FROM products') || {};
  const userCount = get('SELECT COUNT(*) as count FROM users') || {};

  res.json({ code: 0, data: {
    totalOrders: orderTotal.count || 0, totalAmount: orderTotal.amount || 0,
    todayOrders: todayOrders.count || 0, todayAmount: todayOrders.amount || 0,
    productCount: productCount.count || 0, userCount: userCount.count || 0
  }});
});

// 抖音数据导入
router.post('/admin/import-douyin', auth, adminAuth, (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.json({ code: 400, msg: '请提供产品数据' });
  }

  let imported = 0;
  for (const p of products) {
    let categoryId = 1;
    if (p.category) {
      const cat = get('SELECT id FROM categories WHERE name LIKE ?', [`%${p.category}%`]);
      if (cat) categoryId = cat.id;
    }
    const images = JSON.stringify(p.images || []);
    run('INSERT INTO products (name, category_id, price, original_price, images, description, stock, status) VALUES (?,?,?,?,?,?,999,1)',
      [p.name, categoryId, p.price || 0, p.price || 0, images, p.description || '']);
    imported++;
  }
  save();
  res.json({ code: 0, data: { imported }, msg: `成功导入 ${imported} 个产品` });
});

module.exports = router;
