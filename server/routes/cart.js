const express = require('express');
const router = express.Router();
const { get, rows, run, save } = require('../database/init');
const { auth } = require('../middleware/auth');

// 获取购物车
router.get('/list', auth, (req, res) => {
  const items = rows(
    `SELECT c.*, p.name, p.price, p.images, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ? ORDER BY c.created_at DESC`,
    [req.userId]
  );
  items.forEach(item => { item.images = JSON.parse(item.images || '[]'); });
  res.json({ code: 0, data: items });
});

// 加入购物车
router.post('/add', auth, (req, res) => {
  const { product_id, spec_info = '', quantity = 1 } = req.body;

  const exist = get('SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND spec_info = ?',
    [req.userId, product_id, spec_info]);

  if (exist) {
    run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, exist.id]);
  } else {
    run('INSERT INTO cart (user_id, product_id, spec_info, quantity) VALUES (?,?,?,?)',
      [req.userId, product_id, spec_info, quantity]);
  }
  save();

  const count = get('SELECT SUM(quantity) as total FROM cart WHERE user_id = ?', [req.userId]);
  res.json({ code: 0, data: { cartCount: count ? count.total || 0 : 0 }, msg: '已加入购物车' });
});

// 更新购物车
router.post('/update', auth, (req, res) => {
  const { id, quantity, checked } = req.body;

  if (quantity !== undefined) {
    if (quantity <= 0) {
      run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.userId]);
    } else {
      run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, req.userId]);
    }
  }
  if (checked !== undefined) {
    run('UPDATE cart SET checked = ? WHERE id = ? AND user_id = ?', [checked ? 1 : 0, id, req.userId]);
  }
  save();
  res.json({ code: 0, msg: '更新成功' });
});

// 全选/取消全选
router.post('/check-all', auth, (req, res) => {
  const { checked } = req.body;
  run('UPDATE cart SET checked = ? WHERE user_id = ?', [checked ? 1 : 0, req.userId]);
  save();
  res.json({ code: 0, msg: '操作成功' });
});

// 删除
router.post('/delete', auth, (req, res) => {
  const { ids } = req.body;
  if (Array.isArray(ids)) {
    for (const id of ids) {
      run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.userId]);
    }
  } else {
    run('DELETE FROM cart WHERE id = ? AND user_id = ?', [ids, req.userId]);
  }
  save();
  res.json({ code: 0, msg: '删除成功' });
});

// 购物车统计
router.get('/count', auth, (req, res) => {
  const count = get('SELECT SUM(quantity) as total FROM cart WHERE user_id = ?', [req.userId]);
  res.json({ code: 0, data: { count: count ? count.total || 0 : 0 } });
});

module.exports = router;
