const express = require('express');
const router = express.Router();
const { get, rows, run, save } = require('../database/init');
const { auth, adminAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// 提交订单
router.post('/create', auth, (req, res) => {
  const { address_id, remark = '' } = req.body;

  const cartItems = rows(
    `SELECT c.*, p.name, p.price, p.images, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ? AND c.checked = 1`,
    [req.userId]
  );

  if (cartItems.length === 0) return res.json({ code: 400, msg: '请先选择要购买的商品' });

  const address = get('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [address_id, req.userId]);
  if (!address) return res.json({ code: 400, msg: '请先选择收货地址' });

  let totalAmount = 0;
  const items = cartItems.map(item => {
    const subtotal = item.price * item.quantity;
    totalAmount += subtotal;
    return {
      product_id: item.product_id, name: item.name, price: item.price,
      quantity: item.quantity, spec_info: item.spec_info,
      image: JSON.parse(item.images || '[]')[0] || '', subtotal
    };
  });

  const orderNo = `CK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  const addressSnapshot = {
    name: address.name, phone: address.phone,
    address: `${address.province || ''}${address.city || ''}${address.district || ''}${address.detail}`
  };

  run(
    `INSERT INTO orders (order_no, user_id, items, total_amount, pay_amount, status, address_snapshot, remark)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [orderNo, req.userId, JSON.stringify(items), totalAmount, totalAmount, JSON.stringify(addressSnapshot), remark]
  );

  // 清空已下单购物车
  for (const item of cartItems) {
    run('DELETE FROM cart WHERE id = ? AND user_id = ?', [item.id, req.userId]);
  }
  save();

  res.json({ code: 0, data: { order_no: orderNo, total_amount: totalAmount }, msg: '下单成功' });
});

// 订单列表
router.get('/list', auth, (req, res) => {
  const { status, page = 1, page_size = 10 } = req.query;
  const conditions = ['user_id = ?'];
  const params = [req.userId];
  if (status) { conditions.push('status = ?'); params.push(status); }

  const offset = (Number(page) - 1) * Number(page_size);
  const totalObj = get(`SELECT COUNT(*) as count FROM orders WHERE ${conditions.join(' AND ')}`, params);
  const list = rows(
    `SELECT * FROM orders WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(page_size), offset]
  );
  list.forEach(order => { order.items = JSON.parse(order.items || '[]'); });

  res.json({ code: 0, data: { list, total: totalObj ? totalObj.count : 0, page: Number(page) } });
});

// 订单详情
router.get('/detail/:id', auth, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [Number(req.params.id), req.userId]);
  if (!order) return res.json({ code: 404, msg: '订单不存在' });
  order.items = JSON.parse(order.items || '[]');
  order.address_snapshot = JSON.parse(order.address_snapshot || '{}');
  res.json({ code: 0, data: order });
});

// 取消订单
router.post('/cancel/:id', auth, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [Number(req.params.id), req.userId]);
  if (!order) return res.json({ code: 404, msg: '订单不存在' });
  if (order.status !== 'pending') return res.json({ code: 400, msg: '只能取消待付款订单' });
  run('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', Number(req.params.id)]);
  save();
  res.json({ code: 0, msg: '订单已取消' });
});

// 模拟支付
router.post('/pay/:id', auth, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [Number(req.params.id), req.userId]);
  if (!order) return res.json({ code: 404, msg: '订单不存在' });
  run("UPDATE orders SET status = 'paid', pay_time = datetime('now') WHERE id = ?", [Number(req.params.id)]);
  save();
  res.json({ code: 0, msg: '支付成功（模拟）' });
});

// 确认收货
router.post('/confirm/:id', auth, (req, res) => {
  run("UPDATE orders SET status = 'completed' WHERE id = ? AND user_id = ? AND status = 'shipped'",
    [Number(req.params.id), req.userId]);
  save();
  res.json({ code: 0, msg: '已确认收货' });
});

// ---- 管理员 ----
router.get('/admin/list', auth, adminAuth, (req, res) => {
  const { status, page = 1, page_size = 20 } = req.query;
  const conditions = []; const params = [];
  if (status) { conditions.push('status = ?'); params.push(status); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const totalObj = get(`SELECT COUNT(*) as count FROM orders ${where}`, params);
  const list = rows(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(page_size), (Number(page) - 1) * Number(page_size)]);
  list.forEach(o => { o.items = JSON.parse(o.items || '[]'); o.address_snapshot = JSON.parse(o.address_snapshot || '{}'); });

  res.json({ code: 0, data: { list, total: totalObj ? totalObj.count : 0 } });
});

router.post('/admin/status', auth, adminAuth, (req, res) => {
  const { order_id, status } = req.body;
  const validStatus = ['pending', 'paid', 'making', 'shipped', 'completed', 'cancelled'];
  if (!validStatus.includes(status)) return res.json({ code: 400, msg: '无效状态' });

  if (status === 'paid') {
    run("UPDATE orders SET status = ?, pay_time = datetime('now') WHERE id = ?", [status, order_id]);
  } else {
    run('UPDATE orders SET status = ? WHERE id = ?', [status, order_id]);
  }
  save();
  res.json({ code: 0, msg: '状态已更新' });
});

module.exports = router;
